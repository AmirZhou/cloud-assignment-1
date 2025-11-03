import axios from 'axios';

// API base URL - change this when deploying to Azure
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch all nutritional insights
 * Returns: {
 *   total_recipes, diet_types, average_macronutrients,
 *   diet_distribution, protein_carbs_scatter, correlation_heatmap
 * }
 */
export const fetchInsights = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/insights`);
    return response.data;
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }
};

/**
 * Fetch top recipes by protein
 */
export const fetchRecipes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/recipes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`);
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};
