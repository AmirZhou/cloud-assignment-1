import axios from 'axios';

// API base URL - automatically uses the correct environment based on mode
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetch all nutritional insights
 * Returns: {
 *   status, data: { insights, data_stats }, execution_time, timestamp, message
 * }
 */
export const fetchInsights = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-insights`);
    return response.data;
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }
};

/**
 * Fetch top recipes by protein
 * Returns: {
 *   status, data: { recipes }, execution_time, timestamp, message
 * }
 */
export const fetchRecipes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-recipes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

/**
 * Fetch chart data
 * Returns: {
 *   status, data: { charts }, execution_time, timestamp, message
 * }
 */
export const fetchCharts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get-charts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching charts:', error);
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
