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
DATA_PATH = "../data/All_Diets.csv"
OUTPUT_DIR = "../outputs"
VIZ_DIR = f"{OUTPUT_DIR}/visualizations"
RESULTS_DIR = f"{OUTPUT_DIR}/results"

def setup_directories():
    """Create output directories if they don't exist"""
    Path(VIZ_DIR).mkdir(parents=True, exist_ok=True)
    Path(RESULTS_DIR).mkdir(parents=True, exist_ok=True)

def load_and_clean_data():
    """
    Load the dataset and handle missing values
    TODO: Implement data loading and cleaning
    """
    print("Loading All_Diets.csv dataset...")
    
    # TODO: Load CSV file
    # df = pd.read_csv(DATA_PATH)
    
    # TODO: Handle missing data (fill missing values with mean)
    # df.fillna(df.mean(), inplace=True)
    
    # TODO: Add data validation and cleaning steps
    
    # Placeholder - remove when implementing
    print("⚠️  TODO: Implement data loading in load_and_clean_data()")
    return None

def calculate_macronutrient_averages(df):
    """
    Calculate the average macronutrient content for each diet type
    """
    print("Calculating average macronutrient content...")
    
    # TODO: Calculate averages
    # avg_macros = df.groupby('Diet_type')[['Protein(g)', 'Carbs(g)', 'Fat(g)']].mean()
    
    print("⚠️  TODO: Implement macronutrient calculations")
    return None

def find_top_protein_recipes(df):
    """
    Find the top 5 protein-rich recipes for each diet type
    """
    print("Finding top protein-rich recipes...")
    
    # TODO: Find top protein recipes
    # top_protein = df.sort_values('Protein(g)', ascending=False).groupby('Diet_type').head(5)
    
    print("⚠️  TODO: Implement protein recipe analysis")
    return None

def calculate_ratios(df):
    """
    Add new metrics: Protein-to-Carbs ratio and Carbs-to-Fat ratio
    """
    print("Calculating protein-to-carbs and carbs-to-fat ratios...")
    
    # TODO: Add ratio calculations
    # df['Protein_to_Carbs_ratio'] = df['Protein(g)'] / df['Carbs(g)']
    # df['Carbs_to_Fat_ratio'] = df['Carbs(g)'] / df['Fat(g)']
    
    print("⚠️  TODO: Implement ratio calculations")
    return df

def create_visualizations(df, avg_macros):
    """
    Create required visualizations:
    - Bar charts for average macronutrients
    - Heatmaps for macronutrient relationships  
    - Scatter plots for top protein recipes
    """
    print("Creating visualizations...")
    
    # TODO: Bar chart for average macronutrients
    # plt.figure(figsize=(12, 6))
    # sns.barplot(x=avg_macros.index, y=avg_macros['Protein(g)'])
    # plt.title('Average Protein by Diet Type')
    # plt.ylabel('Average Protein (g)')
    # plt.xticks(rotation=45)
    # plt.tight_layout()
    # plt.savefig(f'{VIZ_DIR}/avg_protein_by_diet.png')
    # plt.show()
    
    # TODO: Create heatmap for macronutrient relationships
    
    # TODO: Create scatter plots for top protein recipes
    
    print("⚠️  TODO: Implement all visualizations")
    print(f"📁 Save all plots to: {VIZ_DIR}/")

def generate_insights_report(df, avg_macros, top_protein):
    """
    Generate summary report with key insights
    """
    print("Generating insights report...")
    
    # TODO: Find diet type with highest protein content
    # highest_protein_diet = avg_macros['Protein(g)'].idxmax()
    
    # TODO: Identify most common cuisines for each diet type
    # common_cuisines = df.groupby('Diet_type')['Cuisine_type'].value_counts()
    
    # TODO: Generate comprehensive report
    
    print("⚠️  TODO: Implement insights generation")
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
        top_protein = find_top_protein_recipes(df)
        df = calculate_ratios(df)
        
        # Visualizations
        create_visualizations(df, avg_macros)
        
        # Report generation
        generate_insights_report(df, avg_macros, top_protein)
        
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