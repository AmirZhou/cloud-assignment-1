#!/usr/bin/env python3
"""
Task 1: Dataset Analysis and Insights
AI/ML Expert: Start here immediately - no dependencies!

This script processes All_Diets.csv to extract nutritional insights.
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from pathlib import Path

# Configuration
DATA_PATH = "data/All_Diets.csv"
OUTPUT_DIR = "outputs"
VIZ_DIR = f"{OUTPUT_DIR}/visualizations"
RESULTS_DIR = f"{OUTPUT_DIR}/results"

def setup_directories():
    """Create output directories if they don't exist"""
    Path(VIZ_DIR).mkdir(parents=True, exist_ok=True)
    Path(RESULTS_DIR).mkdir(parents=True, exist_ok=True)
    print(f"Created directories: {VIZ_DIR}, {RESULTS_DIR}")

def load_and_clean_data():
    """Load the dataset and handle missing values"""
    # Load CSV file
    df = pd.read_csv(DATA_PATH)
    print("Loading dataset:", DATA_PATH)
    
    # Handle missing data (fill missing values with mean) 
    df.fillna(df.mean(numeric_only=True), inplace=True)

    # Validate No null value 
    nulls = int(df.isna().sum().sum())
    if (nulls !=0): 
        print(f"Total nulls remaining: {nulls}")
        return
    else:
        print("Data clean success, no missing values, ready for analysis!")
        print("=" * 50)
        return df

def calculate_macronutrient_averages(df):
    """ Calculate the average macronutrient content for each diet type """
    print("Calculating average macronutrient content...")
    
    # Calculate averages
    avg_macros = df.groupby('Diet_type')[['Protein(g)', 'Carbs(g)', 'Fat(g)']].mean()
    print(avg_macros)
    print("=" * 50)
    
    return avg_macros

def find_top5_protein_recipes(df):
    """Find the top 5 protein-rich recipes for each diet type"""
    print("Finding top 5 protein-rich recipes for each diet type...")
    
    # Find top5 protein recipes
    top5_protein_recipes = df.sort_values('Protein(g)', ascending=False).groupby('Diet_type').head(5)
    print(top5_protein_recipes)
    print("=" * 50)

    return  top5_protein_recipes

def diet_with_highest_avg_protein(df):
    """Find the diet type with the highest protein content across all recipes."""

    avg_protein = df.groupby("Diet_type")["Protein(g)"].mean()
    top_diet = avg_protein.idxmax()
    top_value = avg_protein.max()
    print(f"Highest average protein diet: {top_diet} ({top_value:.2f} g)")
    print("=" * 50)

    return top_diet

def most_common_cuisines_per_diet(df):
    """Identify the most common cuisine for each diet type """
    print("Finding most common cuisines per diet type...")

    common_cuisines = (
        df.groupby("Diet_type")["Cuisine_type"]
        .agg(lambda x: x.value_counts().idxmax())
        .reset_index()
    )

    print(common_cuisines)
    print("=" * 50)

    return common_cuisines
  
def calculate_ratios(df):
    """
    Add new metrics: Protein-to-Carbs ratio and Carbs-to-Fat ratio
    """
    print("Calculating protein-to-carbs and carbs-to-fat ratios...")
    
    # Add ratio calculations
    df['Protein_to_Carbs_ratio'] = df['Protein(g)'] / df['Carbs(g)'].replace(0, np.nan) #avoid 0 division
    df['Carbs_to_Fat_ratio'] = df['Carbs(g)'] / df['Fat(g)'].replace(0, np.nan)

    print("Calculation Finish")
    
    return df

def create_visualizations(avg_macros, top5_protein_recipes):
    """
    Create required visualizations:
    - Bar charts for average macronutrients
    - Heatmaps for macronutrient relationships  
    - Scatter plots for top protein recipes
    """
    print("Creating visualizations...")
    
    # Bar chart for average macronutrients
    avg_long = (
    avg_macros
    .reset_index()
    .melt(id_vars="Diet_type",
          value_vars=["Protein(g)", "Carbs(g)", "Fat(g)"],
          var_name="Macronutrient", value_name="Average (g)")
    )

    sns.barplot(data=avg_long, x="Diet_type", y="Average (g)", hue="Macronutrient")

    plt.title("Average Macronutrients by Diet Type")
    plt.ylabel("Average (g)")
    plt.xlabel("Diet Type")
    plt.tight_layout()
    plt.savefig(f"{VIZ_DIR}/avg_macros_by_diet.png")
    print(f"Saved plot: {VIZ_DIR}/avg_macros_by_diet.png")
    plt.show()
    
    # Create heatmap for macronutrient relationships
    plt.figure(figsize=(10, 6))
    sns.heatmap(avg_macros, annot=True, fmt='.1f', cmap='YlGnBu')
    plt.title('Heatmap of Macronutrient Content by Diet Type')
    plt.ylabel('Diet Type')
    plt.xlabel('Macronutrient')
    plt.tight_layout()
    plt.savefig(f'{VIZ_DIR}/heatmap_macros_by_diet.png')
    print(f"Saved plot: {VIZ_DIR}/heatmap_macros_by_diet.png")
    plt.show()
    
    # Create scatter plots for top 5 protein recipes, distributed by Cuisine
    plt.figure(figsize=(12, 6))
    sns.scatterplot(
        data=top5_protein_recipes,
        x='Cuisine_type',
        y='Protein(g)',
        hue='Diet_type',
        style='Diet_type',
        s=100
    )
    plt.title('Top 5 Protein-Rich Recipes by Cuisine (per Diet Type)')
    plt.xlabel('Cuisine_type')
    plt.ylabel('Protein (g)')
    plt.tight_layout()
    plt.savefig(f'{VIZ_DIR}/top5_protein_scatter_by_cuisine.png')
    print(f"Saved plot: {VIZ_DIR}/top5_protein_scatter_by_cuisine.png")
    plt.show()

    print(f"All plots saved to: {VIZ_DIR}/")

def generate_insights_report(avg_macros, top5_protein_recipes, highest_protein_diet, common_cuisines, df):
    """
    Generate summary report with key insights
    - calculate_macronutrient_averages
    - find_top5_protein_recipes
    - diet_with_highest_avg_protein
    - most_common_cuisines_per_diet
    - calculate_ratios
    """
    print("Generating insights report...")

    lines = []
    lines.append("=== Insights Report ===\n")

    # A. Average macronutrients
    lines.append("[A] Average Macronutrients by Diet Type (g)")
    header = f"{'Diet_type':<20} {'Protein(g)':>12} {'Carbs(g)':>12} {'Fat(g)':>12}"
    lines.append(header)
    for diet_type, row in avg_macros.iterrows():
        lines.append(f"{diet_type:<20} {row['Protein(g)']:>12.2f} {row['Carbs(g)']:>12.2f} {row['Fat(g)']:>12.2f}")
    lines.append("")

    # B. Top 5 protein-rich recipes
    lines.append("[B] Top 5 Protein-Rich Recipes (per Diet Type)")
    for _, row in top5_protein_recipes.iterrows():
        recipe = row["Recipe_name"]
        diet = row["Diet_type"]
        protein = row["Protein(g)"]
        lines.append(f"  - {diet}: {recipe} ({protein:.2f} g)")
    lines.append("")

    # C. Highest average protein diet type
    lines.append("[C] Highest Average Protein by Diet Type")
    lines.append(f"  -> {highest_protein_diet}\n")

    # D. Most common cuisine per diet type
    lines.append("[D] Most Common Cuisine per Diet Type")
    for _, row in common_cuisines.iterrows():
        lines.append(f"  - {row['Diet_type']}: {row['Cuisine_type']}")
    lines.append("")

    # E. Ratios
    lines.append("[E] Average Ratios by Diet Type")
    ratio_means = df.groupby("Diet_type")[["Protein_to_Carbs_ratio", "Carbs_to_Fat_ratio"]].mean()
    header = f"{'Diet_type':<20} {'Prot/Carb':>12} {'Carb/Fat':>12}"
    lines.append(header)
    for diet_type, row in ratio_means.iterrows():
        lines.append(f"{diet_type:<20} {row['Protein_to_Carbs_ratio']:>12.2f} {row['Carbs_to_Fat_ratio']:>12.2f}")

    # --- Save the report ---
    out_path = f"{RESULTS_DIR}/insights_report.txt"
    Path(RESULTS_DIR).mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"📁 Save report to: {RESULTS_DIR}/insights_report.txt")

def main():
    """
    Main execution function
    Run this to complete Task 1
    """
    print("🚀 Starting Task 1: Dataset Analysis and Insights")
    print("=" * 50)
    
    # Setup
    setup_directories()
    
    # Data processing pipeline
    df = load_and_clean_data()
    
    if df is not None:
        # Analysis
        avg_macros = calculate_macronutrient_averages(df)
        top5_protein_recipes = find_top5_protein_recipes(df)
        highest_protein_diet = diet_with_highest_avg_protein(df)
        common_cuisines = most_common_cuisines_per_diet(df)
        df = calculate_ratios(df)
        
        # Visualizations
        create_visualizations(avg_macros, top5_protein_recipes)
        
        # Report generation
        generate_insights_report(avg_macros, top5_protein_recipes, highest_protein_diet, common_cuisines, df)
        
        print("\n✅ Task 1 completed successfully!")
        print("📋 Deliverables created:")
        print(f"   - Visualizations: {VIZ_DIR}/")
        print(f"   - Results: {RESULTS_DIR}/")
    else:
        print("\n❌ Please implement data loading first")
        print("💡 Next steps:")
        print("   1. Download All_Diets.csv to ../data/")
        print("   2. Implement load_and_clean_data() function")
        print("   3. Run script again")

if __name__ == "__main__":
    main()