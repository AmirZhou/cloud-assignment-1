"""
Data Processing Module
Contains all data cleaning, analysis, and insights generation functions.
Can be called by Azure Function for nutritional data processing.

This module provides:
- Data validation and cleaning
- Statistical analysis of nutritional content
- Data transformation and aggregation
- Insights summary generation for frontend display
"""

import numpy as np
import logging


def load_and_clean_data(df):
    """
    Clean and validate input data.
    Handles missing values and ensures data integrity.
    
    Processing steps:
    1. Fill missing values with column means
    2. Validate no null values remain
    3. Return cleaned dataframe or raise error
    
    Args:
        df (pandas.DataFrame): Raw input data from CSV
        
    Returns:
        pandas.DataFrame: Cleaned and validated data
        
    Raises:
        ValueError: If data cleaning fails or nulls remain
    """
    logging.info("Cleaning data...")
    
    # Replace missing values with mean of respective columns
    # This preserves data distribution while handling gaps
    df.fillna(df.mean(numeric_only=True), inplace=True)
    
    # Count total null values remaining (should be zero)
    nulls = int(df.isna().sum().sum())
    if nulls != 0:
        # Raise error if data cleaning was unsuccessful
        raise ValueError(f"Data cleaning failed: {nulls} null values remaining")
    
    logging.info("Data cleaned successfully")
    return df


def calculate_macronutrient_averages(df):
    """
    Calculate average macronutrient content for each diet type.
    Groups data by Diet_type and computes mean of protein, carbs, and fat.
    
    Args:
        df (pandas.DataFrame): Cleaned nutritional data with columns:
                              - Diet_type: Type of diet
                              - Protein(g): Protein content in grams
                              - Carbs(g): Carbohydrate content in grams
                              - Fat(g): Fat content in grams
        
    Returns:
        pandas.DataFrame: Index is Diet_type, columns are average macronutrients
    """
    logging.info("Calculating average macronutrients...")
    
    # Group by diet type and calculate mean for each macronutrient
    avg_macros = df.groupby('Diet_type')[['Protein(g)', 'Carbs(g)', 'Fat(g)']].mean()
    
    logging.info(f"Calculated averages for {len(avg_macros)} diet types")
    return avg_macros


def find_top5_protein_recipes(df):
    """
    Find the top 5 protein-rich recipes for each diet type.
    Sorts recipes by protein content and selects top 5 per diet type.
    
    Args:
        df (pandas.DataFrame): Complete nutritional dataset
        
    Returns:
        pandas.DataFrame: Top 5 recipes per diet type, sorted by protein content
    """
    logging.info("Finding top 5 protein-rich recipes for each diet type...")
    
    # Sort by protein content (descending) and take first 5 of each diet type
    top5_protein_recipes = df.sort_values('Protein(g)', ascending=False).groupby('Diet_type').head(5)
    
    logging.info(f"Found {len(top5_protein_recipes)} top protein recipes")
    return top5_protein_recipes


def diet_with_highest_avg_protein(df):
    """
    Identify the diet type with the highest average protein content.
    Useful for determining which diet is most protein-rich.
    
    Args:
        df (pandas.DataFrame): Nutritional data with Diet_type and Protein(g) columns
        
    Returns:
        str: Name of diet type with highest average protein    
    """
    logging.info("Finding diet with highest average protein...")
    
    # Calculate mean protein per diet type
    avg_protein = df.groupby("Diet_type")["Protein(g)"].mean()
    # Find diet type with maximum average protein
    top_diet = avg_protein.idxmax()
    # Get the actual protein value for logging
    top_value = avg_protein.max()
    
    logging.info(f"Highest protein diet: {top_diet} ({top_value:.2f}g)")
    return top_diet


def most_common_cuisines_per_diet(df):
    """
    Identify the most common cuisine type for each diet.
    Useful for understanding cuisine-diet associations.
    
    Args:
        df (pandas.DataFrame): Data with Diet_type and Cuisine_type columns
        
    Returns:
        pandas.DataFrame: Two columns (Diet_type, Cuisine_type) showing most common
                         cuisine for each diet
    """
    logging.info("Finding most common cuisines per diet type...")
    
    # Group by diet type and find the most frequent cuisine for each
    common_cuisines = (
        df.groupby("Diet_type")["Cuisine_type"]
        .agg(lambda x: x.value_counts().idxmax())  # Get most common value
        .reset_index()
    )
    
    logging.info(f"Found most common cuisines for {len(common_cuisines)} diet types")
    return common_cuisines


def calculate_ratios(df):
    """
    Calculate nutritional ratios to identify macro balance patterns.
    Computes Protein-to-Carbs ratio and Carbs-to-Fat ratio.
    
    These ratios help identify:
    - Protein-to-Carbs: Higher = more protein-focused diet
    - Carbs-to-Fat: Higher = more carb-focused diet
    
    Args:
        df (pandas.DataFrame): Data with Protein(g), Carbs(g), Fat(g) columns
        
    Returns:
        pandas.DataFrame: Original data with two new columns:
                         - Protein_to_Carbs_ratio
                         - Carbs_to_Fat_ratio
        
    Note:
        Division by zero is handled by replacing zeros with NaN,
        which results in NaN ratios (safe handling).
    """
    logging.info("Calculating protein-to-carbs and carbs-to-fat ratios...")
    
    # Calculate Protein-to-Carbs ratio
    # Avoid division by zero by replacing 0 with NaN
    df['Protein_to_Carbs_ratio'] = df['Protein(g)'] / df['Carbs(g)'].replace(0, np.nan)
    
    # Calculate Carbs-to-Fat ratio
    # Avoid division by zero by replacing 0 with NaN
    df['Carbs_to_Fat_ratio'] = df['Carbs(g)'] / df['Fat(g)'].replace(0, np.nan)
    
    logging.info("Nutritional ratios calculated")
    return df


def generate_insights_summary(avg_macros, top5_protein_recipes, 
                             highest_protein_diet, common_cuisines, df):
    """
    Generate comprehensive insights summary for frontend display.
    Compiles analysis results into user-friendly format.
    
    Args:
        avg_macros (pandas.DataFrame): Average macronutrients by diet type
        top5_protein_recipes (pandas.DataFrame): Top 5 protein recipes per diet
        highest_protein_diet (str): Name of highest protein diet
        common_cuisines (pandas.DataFrame): Most common cuisines per diet
        df (pandas.DataFrame): Full dataset with calculated ratios
        
    Returns:
        dict: Comprehensive insights dictionary with sections:
              - summary: Dataset statistics
              - average_macronutrients: Macro content by diet
              - highest_protein_diet: Which diet has most protein
              - top_5_protein_recipes: Highest protein recipes
              - most_common_cuisines: Cuisine-diet associations
              - average_ratios: Macro balance ratios
              - key_findings: Text summary of insights
    """
    logging.info("Generating insights summary...")
    
    # Convert average macronutrients to dictionary format (for JSON serialization)
    avg_macros_dict = avg_macros.round(2).to_dict(orient='index')
    
    # Transform top 5 protein-rich recipes into list of dictionaries for easy consumption
    top_recipes_list = []
    for _, row in top5_protein_recipes.iterrows():
        top_recipes_list.append({
            "recipe_name": row.get("Recipe_name", "Unknown"),
            "diet_type": row.get("Diet_type", "Unknown"),
            # Round values to 2 decimal places for readability
            "protein_g": round(float(row.get("Protein(g)", 0)), 2),
            "carbs_g": round(float(row.get("Carbs(g)", 0)), 2),
            "fat_g": round(float(row.get("Fat(g)", 0)), 2)
        })
    
    # Convert most common cuisines to dictionary for easy lookup
    common_cuisines_dict = {}
    for _, row in common_cuisines.iterrows():
        common_cuisines_dict[row["Diet_type"]] = row["Cuisine_type"]
    
    # Calculate average ratios for each diet type
    avg_ratios = df.groupby("Diet_type")[
        ["Protein_to_Carbs_ratio", "Carbs_to_Fat_ratio"]
    ].mean().round(2).to_dict(orient='index')
    
    # Compile all insights into structured format
    insights = {
        # Overview statistics
        "summary": {
            "total_recipes_analyzed": len(df),
            "diet_types_count": len(df['Diet_type'].unique()),
            "cuisines_count": len(df['Cuisine_type'].unique())
        },
        
        # Detailed macronutrient data
        "average_macronutrients": avg_macros_dict,
        
        # Protein leader identification
        "highest_protein_diet": highest_protein_diet,
        
        # Specific recipe recommendations
        "top_5_protein_recipes": top_recipes_list,
        
        # Cuisine preference mapping
        "most_common_cuisines": common_cuisines_dict,
        
        # Ratio analysis for macro balance
        "average_ratios": avg_ratios,
        
        # Key takeaways for user
        "key_findings": {
            "protein_leader": f"{highest_protein_diet} has the highest average protein content",
            "most_recipes_analyzed": len(top_recipes_list),
            "analysis_complete": True
        }
    }
    
    logging.info("Insights summary generated")
    return insights


# ===== Data validation functions =====

def validate_data_schema(df):
    """
    Validate that data contains all required columns.
    Ensures data integrity before processing.
    
    Required columns:
    - Diet_type: Type of diet plan
    - Recipe_name: Name of the recipe
    - Protein(g): Protein content in grams
    - Carbs(g): Carbohydrate content in grams
    - Fat(g): Fat content in grams
    - Cuisine_type: Type of cuisine
    
    Args:
        df (pandas.DataFrame): Data to validate
        
    Returns:
        bool: True if valid
        
    Raises:
        ValueError: If required columns are missing
    """
    
    # Define all required columns
    required_columns = ['Diet_type', 'Recipe_name', 'Protein(g)', 
                       'Carbs(g)', 'Fat(g)', 'Cuisine_type']
    
    # Find which required columns are missing
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    # Raise error if any columns are missing
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")
    
    return True


def get_data_statistics(df):
    """
    Retrieve comprehensive statistics about the dataset.
    Useful for understanding data range and distribution.
    
    Args:
        df (pandas.DataFrame): Dataset to analyze
        
    Returns:
        dict: Statistics including:
              - Counts of rows, columns, diet types, cuisines
              - Min/max/mean for protein, carbs, fat
    """
    
    # Compile statistics
    stats = {
        "total_rows": len(df),
        "total_columns": len(df.columns),
        # List all unique values for categorical columns
        "diet_types": df['Diet_type'].unique().tolist(),
        "cuisine_types": df['Cuisine_type'].unique().tolist(),
        # Range and distribution of protein content
        "protein_range": {
            "min": float(df['Protein(g)'].min()),
            "max": float(df['Protein(g)'].max()),
            "mean": float(df['Protein(g)'].mean())
        },
        # Range and distribution of carbs
        "carbs_range": {
            "min": float(df['Carbs(g)'].min()),
            "max": float(df['Carbs(g)'].max()),
            "mean": float(df['Carbs(g)'].mean())
        },
        # Range and distribution of fat
        "fat_range": {
            "min": float(df['Fat(g)'].min()),
            "max": float(df['Fat(g)'].max()),
            "mean": float(df['Fat(g)'].mean())
        }
    }
    
    return stats
