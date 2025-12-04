"""
Blob Trigger Function - Data Processing Pipeline
Triggered when All_Diets.csv is uploaded or updated

This function performs:
1. Data cleaning (load_and_clean_data)
2. Pre-computation of all analysis results
3. Pre-generation of all charts
4. Caching everything in Redis for quick API access

This ensures data cleaning and calculations are done ONCE per file change,
not on every API request.
"""

import azure.functions as func
import pandas as pd
import json
import time
import logging
import io
from datetime import datetime, timezone

# Import shared modules
from shared.processing import (
    load_and_clean_data,
    calculate_macronutrient_averages,
    find_top5_protein_recipes,
    diet_with_highest_avg_protein,
    most_common_cuisines_per_diet,
    calculate_ratios,
    generate_insights_summary
)
from shared.chart_generator import ChartGenerator
from shared.redis_cache import RedisCache

def main(blob: func.InputStream):
    """
    Main trigger function - processes CSV file and caches all results
    
    Args:
        blob: InputStream of the uploaded/updated CSV file
    """
    name = blob.name  
    logging.info(f"BlobTrigger fired for blob: {name}, size: {blob.length} bytes")
    if not name.endswith("All_Diets.csv"):
        logging.info(f"Skipping blob {name} because it is not All_Diets.csv")
        return
    processing_start_time = time.time()
    trigger_time = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
    
    logging.info("=" * 80)
    logging.info("== BLOB TRIGGER ACTIVATED ==")
    logging.info(f"File: {blob.name}")
    logging.info(f"Size: {blob.length} bytes")
    logging.info(f"Triggered at: {trigger_time}")
    logging.info("=" * 80)
    
    try:
        # Initialize Redis connection
        logging.info("Step 0: Connecting to Redis...")
        redis = RedisCache()
        
        # ===== STEP 1: Load and Clean Data =====
        logging.info("\n" + "=" * 80)
        logging.info("STEP 1: DATA CLEANING (This happens ONCE per file change)")
        logging.info("=" * 80)
        
        step1_start = time.time()
        # Read CSV from blob
        # Note:
        # Unlike phase two, which we manually use environment variables and connection strings to read from Blob Storage, 
        # Here we leverage Azure Functions' built-in Blob binding to directly read the blob content since it's a blob trigger function.
        csv_data = blob.read()
        df = pd.read_csv(io.BytesIO(csv_data), encoding='utf-8')
        logging.info(f"Raw data loaded: {len(df)} rows, {len(df.columns)} columns")
        
        # Clean data
        df = load_and_clean_data(df)
        logging.info(f"✓ Data cleaned successfully: {len(df)} rows")
        
        # Store cleaned data in Redis
        cleaned_data_json = df.to_json(orient='records')
        redis.set("cleaned_data", cleaned_data_json)
        step1_time = time.time() - step1_start
        logging.info("Cleaned data stored in Redis cache")
        
        
        # ===== STEP 2: Pre-calculate Charts Data =====
        logging.info("\n" + "=" * 80)
        logging.info("STEP 2: GENERATING CHARTS (This happens ONCE per file change)")
        logging.info("=" * 80)
        
        step2_start = time.time()
        # Calculate data for charts
        avg_macros = calculate_macronutrient_averages(df)
        logging.info("✓ Calculated: Average macronutrients")
        
        top5_protein = find_top5_protein_recipes(df)
        logging.info("✓ Calculated: Top 5 protein recipes")
        
        # Generate all charts
        chart_gen = ChartGenerator()
        
        bar_chart_base64 = chart_gen.generate_bar_chart(avg_macros)
        redis.set("charts:bar_chart", bar_chart_base64)
        logging.info("Generated & cached: Bar chart")
        
        heatmap_base64 = chart_gen.generate_heatmap(avg_macros)
        redis.set("charts:heatmap", heatmap_base64)
        logging.info("Generated & cached: Heatmap")
        
        scatter_plot_base64 = chart_gen.generate_scatter_plot(top5_protein)
        redis.set("charts:scatter_plot", scatter_plot_base64)
        step2_time = time.time() - step2_start
        logging.info("Generated & cached: Scatter plot")
        
        
        # ===== STEP 3: Pre-calculate Insights =====
        logging.info("\n" + "=" * 80)
        logging.info("STEP 3: CALCULATING INSIGHTS (This happens ONCE per file change)")
        logging.info("=" * 80)
        
        step3_start = time.time()
        highest_protein_diet = diet_with_highest_avg_protein(df)
        logging.info(f"✓ Calculated: Highest protein diet = {highest_protein_diet}")
        
        common_cuisines = most_common_cuisines_per_diet(df)
        logging.info("✓ Calculated: Common cuisines per diet")
        
        df = calculate_ratios(df)
        logging.info("✓ Calculated: Nutritional ratios")
        
        # Generate insights summary
        insights = generate_insights_summary(
            avg_macros,
            top5_protein,
            highest_protein_diet,
            common_cuisines,
            df
        )
        redis.set("insights:summary", json.dumps(insights)) # Store as JSON string with json.dumps since it's a dict
        step3_time = time.time() - step3_start
        logging.info("Insights summary stored in Redis cache")
        
        
        # ===== STEP 4: Pre-cache Recipe Filters =====
        logging.info("\n" + "=" * 80)
        logging.info("STEP 4: PRE-CACHING RECIPE FILTERS (This happens ONCE per file change)")
        logging.info("=" * 80)
        
        step4_start = time.time()
        # Cache all recipes
        all_recipes = prepare_recipes_list(df)
        redis.set("recipes:all", json.dumps(all_recipes))
        logging.info(f"Cached {len(all_recipes)} total recipes")
        
        # Pre-cache by diet type
        diet_types = df['Diet_type'].unique()
        logging.info(f"Found {len(diet_types)} diet types: {list(diet_types)}")
        
        for diet_type in diet_types:
            filtered_df = df[df['Diet_type'] == diet_type]
            recipes = prepare_recipes_list(filtered_df)
            redis.set(f"recipes:diet:{diet_type}", json.dumps(recipes))
            logging.info(f"Cached {len(recipes)} recipes for diet_type='{diet_type}'")
        
        # Pre-cache by cuisine type
        cuisines = df['Cuisine_type'].unique()
        logging.info(f"Found {len(cuisines)} cuisine types")
        
        for cuisine in cuisines:
            filtered_df = df[df['Cuisine_type'] == cuisine]
            recipes = prepare_recipes_list(filtered_df)
            redis.set(f"recipes:cuisine:{cuisine}", json.dumps(recipes))
            logging.info(f"Cached {len(recipes)} recipes for cuisine_type='{cuisine}'")
        
        step4_time = time.time() - step4_start
        total_processing_time = time.time() - processing_start_time
        # ===== STEP 5: Store Metadata =====
        logging.info("\n" + "=" * 80)
        logging.info("STEP 5: STORING METADATA")
        logging.info("=" * 80)
        
        metadata = {
            "last_processed": trigger_time,
            "step_times": {
                "data_cleaning_sec": round(step1_time, 2),
                "chart_generation_sec": round(step2_time, 2),
                "insights_calculation_sec": round(step3_time, 2),
                "recipe_caching_sec": round(step4_time, 2),
                "total_processing_sec": round(total_processing_time, 2)
            },
            "file_name": blob.name,
            "file_size": blob.length,
            "total_recipes": len(df),
            "total_columns": len(df.columns),
            "diet_types": list(diet_types),
            "diet_types_count": len(diet_types),
            "cuisine_types": list(cuisines),
            "cuisines_count": len(cuisines),
            "processing_version": "1.0.0"
        }
        redis.set("metadata", json.dumps(metadata))
        logging.info("Metadata stored in Redis cache")
        
        # Log all cached keys for verification
        all_keys = redis.keys("*")
        logging.info(f"\nTotal keys in Redis: {len(all_keys)}")
        logging.info("Cached keys:")
        for key in sorted(all_keys):
            logging.info(f"  - {key}")
        
        
        # ===== SUCCESS =====
        logging.info("\n" + "=" * 80)
        logging.info("BLOB TRIGGER COMPLETED SUCCESSFULLY")
        logging.info("=" * 80)
        logging.info("All data has been:")
        logging.info("  ✓ Cleaned (ONCE)")
        logging.info("  ✓ Analyzed (ONCE)")
        logging.info("  ✓ Cached in Redis")
        logging.info("\nAPI endpoints can now serve results instantly from cache!")
        logging.info("=" * 80 + "\n")
        
    except Exception as e:
        logging.error("\n" + "=" * 80)
        logging.error("BLOB TRIGGER FAILED!!!")
        logging.error("=" * 80)
        logging.error(f"✗ Error: {str(e)}", exc_info=True)
        logging.error("=" * 80 + "\n")
        raise


def prepare_recipes_list(df):
    """
    Convert DataFrame to list of recipe dictionaries
    
    Args:
        df (pd.DataFrame): Filtered DataFrame
        
    Returns:
        list: List of recipe dictionaries
    """
    recipes = []
    for _, row in df.iterrows():
        recipes.append({
            "recipe_name": row.get("Recipe_name", "Unknown"),
            "diet_type": row.get("Diet_type", "Unknown"),
            "cuisine_type": row.get("Cuisine_type", "Unknown"),
            "protein_g": round(float(row.get("Protein(g)", 0)), 2),
            "carbs_g": round(float(row.get("Carbs(g)", 0)), 2),
            "fat_g": round(float(row.get("Fat(g)", 0)), 2)
        })
    return recipes
