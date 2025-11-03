#!/usr/bin/env python3
"""
Flask API Server for Phase 2 Frontend Development
Provides JSON endpoints for the React dashboard
"""

import os
import json
import io
from flask import Flask, jsonify
from flask_cors import CORS
from pathlib import Path
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
DATA_PATH = "data/All_Diets.csv"

def load_and_process_data():
    """Load and process the diet dataset"""
    try:
        # Load CSV file
        df = pd.read_csv(DATA_PATH)

        # Handle missing data
        df.fillna(df.mean(numeric_only=True), inplace=True)

        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def calculate_macronutrient_averages(df):
    """Calculate average macronutrients by diet type"""
    avg_macros = df.groupby('Diet_type')[['Protein(g)', 'Carbs(g)', 'Fat(g)']].mean()
    return avg_macros.reset_index().to_dict(orient='records')

def get_diet_distribution(df):
    """Get recipe count by diet type for pie chart"""
    diet_counts = df['Diet_type'].value_counts()
    return {
        'labels': diet_counts.index.tolist(),
        'values': diet_counts.values.tolist()
    }

def get_protein_carbs_relationship(df):
    """Get protein vs carbs data for scatter plot"""
    # Sample data for performance (take 100 random recipes)
    sample_df = df.sample(min(100, len(df)))

    scatter_data = []
    for diet_type in sample_df['Diet_type'].unique():
        diet_data = sample_df[sample_df['Diet_type'] == diet_type]
        scatter_data.append({
            'diet_type': diet_type,
            'data': [
                {'x': row['Carbs(g)'], 'y': row['Protein(g)']}
                for _, row in diet_data.iterrows()
            ]
        })

    return scatter_data

def get_correlation_heatmap(df):
    """Get correlation matrix for heatmap"""
    # Calculate correlation matrix for macronutrients
    corr_cols = ['Protein(g)', 'Carbs(g)', 'Fat(g)']
    corr_matrix = df[corr_cols].corr()

    return {
        'labels': corr_cols,
        'data': corr_matrix.values.tolist()
    }

@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Main endpoint that returns all nutritional insights"""
    try:
        df = load_and_process_data()

        if df is None:
            return jsonify({'error': 'Failed to load dataset'}), 500

        # Calculate all insights
        response = {
            'total_recipes': int(len(df)),
            'diet_types': int(df['Diet_type'].nunique()),
            'average_macronutrients': calculate_macronutrient_averages(df),
            'diet_distribution': get_diet_distribution(df),
            'protein_carbs_scatter': get_protein_carbs_relationship(df),
            'correlation_heatmap': get_correlation_heatmap(df),
            'processing_status': 'success'
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    """Get recipe data with pagination support"""
    try:
        df = load_and_process_data()

        if df is None:
            return jsonify({'error': 'Failed to load dataset'}), 500

        # Get all recipes sorted by protein (highest first)
        all_recipes = df.sort_values('Protein(g)', ascending=False)[
            ['Recipe_name', 'Diet_type', 'Cuisine_type', 'Protein(g)', 'Carbs(g)', 'Fat(g)']
        ].to_dict(orient='records')

        return jsonify({
            'recipes': all_recipes,
            'total': len(df)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'API is running'}), 200

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API info"""
    return jsonify({
        'message': 'Nutritional Insights API',
        'endpoints': {
            '/api/insights': 'Get all nutritional insights and visualizations',
            '/api/recipes': 'Get top recipes by protein',
            '/api/health': 'Health check'
        }
    })

if __name__ == '__main__':
    # Check if dataset exists
    if not Path(DATA_PATH).exists():
        print(f"WARNING: Dataset not found at {DATA_PATH}")
        print("Please ensure All_Diets.csv is in the data/ folder")

    print("Starting Flask API Server")
    print("API running on http://localhost:5000")
    print("Frontend can call http://localhost:5000/api/insights")
    app.run(host='0.0.0.0', port=5000, debug=True)
