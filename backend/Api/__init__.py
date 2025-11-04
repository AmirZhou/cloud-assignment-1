"""
Azure Function: Nutritional Insights API with separated endpoints
Four main endpoints:
1. /api/get-charts - Get visualizations (page load)
2. /api/get-insights - Get analysis results (button click)
3. /api/get-recipes - Get recipes with optional diet_type filter
4. /api/health - Health check endpoint
"""

import azure.functions as func
import json
import time
import logging
from datetime import datetime, timezone

# Import shared modules for data processing
from shared.blob_io import read_csv_from_blob
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

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    Main entry point - routes requests to appropriate handler
    
    Supported routes:
    - GET /api/health → Health check endpoint
    - GET /api/get-charts → Returns charts only
    - GET /api/get-insights → Returns analysis insights only
    - GET /api/get-recipes → Returns recipes (optional: ?diet_type=keto)
    """
    
    # Get the action from route parameters
    # Azure Functions passes route params like this: /api/{action}
    action = req.route_params.get('action', '').lower()
    
    logging.info(f"Request received for action: {action}")
    
    try:
        if action == 'health':
            return get_health(req)
    
        elif action == 'get-charts':
            return get_charts(req)
        
        elif action == 'get-insights':
            return get_insights(req)
        
        elif action == 'get-recipes':
            return get_recipes(req)
        
        else:
            return error_response(
                f"Unknown action: {action}. Valid actions: get-charts, get-insights, get-recipes",
                404
            )
    
    except Exception as e:
        logging.error(f"❌ Error: {str(e)}", exc_info=True)
        return error_response(str(e), 500)

# ===== HANDLER 0: Health Check =====
def get_health(req: func.HttpRequest) -> func.HttpResponse:
    """
    Health check endpoint
    Returns the status of the API and its dependencies
    """
    
    start_time = time.time()
    logging.info("Health check requested")
    
    try:
        # Check Blob Storage connectivity
        logging.info("  - Checking Blob Storage connection...")
        try:
            df = read_csv_from_blob()
            blob_status = "connected"
            data_info = f"{len(df)} rows, {len(df.columns)} columns"
            logging.info(f"    ✓ Blob Storage connected - {data_info}")
        except Exception as e:
            blob_status = "error"
            data_info = str(e)
            logging.warning(f"    ✗ Blob Storage error: {str(e)}")
        
        # Build response
        execution_time = time.time() - start_time
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        response_data = {
            "status": "healthy" if blob_status == "connected" else "degraded",
            "service": "Nutritional Insights API",
            "version": "1.0.0",
            "timestamp": timestamp,
            "checks": {
                "blob_storage": blob_status,
                "data_available": data_info if blob_status == "connected" else "N/A"
            },
            "execution_time": f"{execution_time:.2f}s"
        }
        
        status_code = 200 if blob_status == "connected" else 503
        logging.info(f"Health check complete. Status: {response_data['status']}")
        
        return func.HttpResponse(
            json.dumps(response_data, ensure_ascii=False),
            status_code=status_code,
            mimetype="application/json; charset=utf-8",
        )
    
    except Exception as e:
        logging.error(f"Health check failed: {str(e)}", exc_info=True)
        
        error_data = {
            "status": "unhealthy",
            "service": "Nutritional Insights API",
            "version": "1.0.0",
            "timestamp": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            "error": str(e)
        }
        
        return func.HttpResponse(
            json.dumps(error_data, ensure_ascii=False),
            status_code=503,
            mimetype="application/json; charset=utf-8",
        )

# ===== HANDLER 1: Get Charts =====
def get_charts(req: func.HttpRequest) -> func.HttpResponse:
    """
    Generate and return visualization charts only
    Called when page loads (for fast initial display)
    
    Returns: Base64 encoded PNG images
    """
    
    start_time = time.time()
    logging.info("Step 1: Generating charts...")
    
    try:
        # ===== Read and clean data =====
        logging.info("  - Reading data from Blob Storage...")
        df = read_csv_from_blob()
        logging.info(f"    Data loaded: {len(df)} rows")
        
        logging.info("  - Cleaning data...")
        df = load_and_clean_data(df)
        logging.info("    Data cleaned")
        
        
        # ===== Analyze data for charts =====
        logging.info("  - Analyzing data...")
        avg_macros = calculate_macronutrient_averages(df)
        top5_protein_recipes = find_top5_protein_recipes(df)
        logging.info("    Analysis complete")
        
        
        # ===== Generate charts =====
        logging.info("  - Generating visualizations...")
        chart_gen = ChartGenerator()
        
        bar_chart_base64 = chart_gen.generate_bar_chart(avg_macros)
        logging.info("    ✓ Bar chart generated")
        
        heatmap_base64 = chart_gen.generate_heatmap(avg_macros)
        logging.info("    ✓ Heatmap generated")
        
        scatter_plot_base64 = chart_gen.generate_scatter_plot(top5_protein_recipes)
        logging.info("    ✓ Scatter plot generated")
        
        
        # ===== Build response =====
        execution_time = time.time() - start_time
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        response_data = {
            "status": "success",
            "data": {
                "bar_chart": f"data:image/png;base64,{bar_chart_base64}",
                "heatmap": f"data:image/png;base64,{heatmap_base64}",
                "scatter_plot": f"data:image/png;base64,{scatter_plot_base64}"
            },
            "execution_time": f"{execution_time:.2f}s",
            "timestamp": timestamp,
            "message": "Charts generated successfully"
        }
        
        logging.info(f"Charts ready. Execution time: {execution_time:.2f}s")
        
        return success_response(response_data)
    
    except Exception as e:
        logging.error(f"Error generating charts: {str(e)}", exc_info=True)
        return error_response(f"Failed to generate charts: {str(e)}", 500)


# ===== HANDLER 2: Get Insights =====
def get_insights(req: func.HttpRequest) -> func.HttpResponse:
    """
    Generate and return nutritional insights only
    Called when user clicks "Get Insights" button
    
    Returns: Analysis data, statistics, findings
    """
    
    start_time = time.time()
    logging.info("Step 2: Generating insights...")
    
    try:
        # ===== Read and clean data =====
        logging.info("  - Reading data from Blob Storage...")
        df = read_csv_from_blob()
        logging.info(f"    Data loaded: {len(df)} rows")
        
        logging.info("  - Cleaning data...")
        df = load_and_clean_data(df)
        logging.info("    Data cleaned")
        
        
        # ===== Perform comprehensive analysis =====
        logging.info("  - Analyzing nutritional data...")
        
        avg_macros = calculate_macronutrient_averages(df)
        logging.info("    ✓ Average macros calculated")
        
        top5_protein_recipes = find_top5_protein_recipes(df)
        logging.info("    ✓ Top 5 protein recipes found")
        
        highest_protein_diet = diet_with_highest_avg_protein(df)
        logging.info(f"    ✓ Highest protein diet: {highest_protein_diet}")
        
        common_cuisines = most_common_cuisines_per_diet(df)
        logging.info("    ✓ Common cuisines identified")
        
        df = calculate_ratios(df)
        logging.info("    ✓ Nutritional ratios calculated")
        
        
        # ===== Generate insights summary =====
        logging.info("  - Generating insights summary...")
        insights = generate_insights_summary(
            avg_macros,
            top5_protein_recipes,
            highest_protein_diet,
            common_cuisines,
            df
        )
        logging.info("    ✓ Insights summary generated")
        
        
        # ===== Build response =====
        execution_time = time.time() - start_time
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        response_data = {
            "status": "success",
            "data": {
                "insights": insights,
                "data_stats": {
                    "total_recipes": len(df),
                    "diet_types": len(df['Diet_type'].unique()),
                    "cuisines": len(df['Cuisine_type'].unique())
                }
            },
            "execution_time": f"{execution_time:.2f}s",
            "timestamp": timestamp,
            "message": "Insights generated successfully"
        }
        
        logging.info(f"Insights ready. Execution time: {execution_time:.2f}s")
        
        return success_response(response_data)
    
    except Exception as e:
        logging.error(f"Error generating insights: {str(e)}", exc_info=True)
        return error_response(f"Failed to generate insights: {str(e)}", 500)


# ===== HANDLER 3: Get Recipes =====
def get_recipes(req: func.HttpRequest) -> func.HttpResponse:
    """
    Get recipes from dataset with optional filtering by diet type
    
    Query parameters:
      - diet_type: Optional (e.g., ?diet_type=Keto)
    
    Example URLs:
      - /api/get-recipes (all recipes)
      - /api/get-recipes?diet_type=Keto (only Keto recipes)
      - /api/get-recipes?diet_type=Vegan (only Vegan recipes)
    
    Returns: List of recipes with nutrition info
    """
    
    start_time = time.time()
    logging.info("Step 3: Fetching recipes...")
    
    try:
        # ===== Read and clean data =====
        logging.info("  - Reading data from Blob Storage...")
        df = read_csv_from_blob()
        logging.info(f"    Data loaded: {len(df)} rows")
        
        logging.info("  - Cleaning data...")
        df = load_and_clean_data(df)
        logging.info("    Data cleaned")
        
        
        # ===== Apply optional filter =====
        diet_type_filter = req.params.get('diet_type')
        
        if diet_type_filter:
            # Filter by specific diet type
            filtered_df = df[df['Diet_type'] == diet_type_filter]
            logging.info(f"  - Filtering by diet type: {diet_type_filter}")
            logging.info(f"    Found {len(filtered_df)} recipes")
        else:
            # Return all recipes
            filtered_df = df
            logging.info("  - No filter applied, returning all recipes")
        
        
        # ===== Convert to recipe list =====
        recipes_list = []
        for _, row in filtered_df.iterrows():
            recipes_list.append({
                "recipe_name": row.get("Recipe_name", "Unknown"),
                "diet_type": row.get("Diet_type", "Unknown"),
                "cuisine_type": row.get("Cuisine_type", "Unknown"),
                "protein_g": round(float(row.get("Protein(g)", 0)), 2),
                "carbs_g": round(float(row.get("Carbs(g)", 0)), 2),
                "fat_g": round(float(row.get("Fat(g)", 0)), 2)
            })
        
        logging.info(f"  - Converted {len(recipes_list)} recipes")
        
        
        # ===== Build response =====
        execution_time = time.time() - start_time
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        response_data = {
            "status": "success",
            "data": {
                "recipes": recipes_list,
                "total_count": len(df),
                "filtered_count": len(recipes_list),
                "filter_applied": diet_type_filter if diet_type_filter else None
            },
            "execution_time": f"{execution_time:.2f}s",
            "timestamp": timestamp,
            "message": "Recipes fetched successfully"
        }
        
        logging.info(f"Recipes ready. Execution time: {execution_time:.2f}s")
        
        return success_response(response_data)
    
    except Exception as e:
        logging.error(f"Error fetching recipes: {str(e)}", exc_info=True)
        return error_response(f"Failed to fetch recipes: {str(e)}", 500)


# ===== UTILITY FUNCTIONS =====
def success_response(data):
    """Helper function to return successful HTTP response"""
    return func.HttpResponse(
        json.dumps(data),
        status_code=200,
        mimetype="application/json",
    )


def error_response(message, status_code):
    """Helper function to return error HTTP response"""
    return func.HttpResponse(
        json.dumps({
            "status": "error",
            "message": message,
            "timestamp": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        }),
        status_code=status_code,
        mimetype="application/json",
    )

