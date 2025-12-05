import axios from 'axios';

// API base URL - automatically uses the correct environment based on mode
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetch all nutritional insights
 * Returns: {
 *   status, 
 *   data: { insights, data_stats }, 
 *   api_performance,
 *   blob_trigger_performance,
 *   performance_comparison,
 *   execution_time, 
 *   timestamp
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
 * Fetch recipes with filters and pagination
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.diet_type - Filter by diet type (e.g., 'Keto', 'Paleo', 'Vegan')
 * @param {string} params.cuisine_type - Filter by cuisine type (e.g., 'Italian', 'Asian')
 * @param {string} params.keyword - Search keyword for recipe names
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.page_size - Items per page (default: 10)
 * 
 * @returns {Promise} Response with recipes, pagination, and performance data
 * 
 * Examples:
 * fetchRecipes({ diet_type: 'Keto', keyword: 'chicken', page: 1, page_size: 20 })
 * fetchRecipes({ cuisine_type: 'Italian' })
 * fetchRecipes({ keyword: 'salad', page: 2 })
 */
export const fetchRecipes = async (params = {}) => {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    if (params.diet_type && params.diet_type !== 'all') {
      queryParams.append('diet_type', params.diet_type);
    }
    
    if (params.cuisine_type && params.cuisine_type !== 'all') {
      queryParams.append('cuisine_type', params.cuisine_type);
    }
    
    if (params.keyword && params.keyword.trim() !== '') {
      queryParams.append('keyword', params.keyword.trim());
    }
    
    if (params.page) {
      queryParams.append('page', params.page);
    }
    
    if (params.page_size) {
      queryParams.append('page_size', params.page_size);
    }
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_BASE_URL}/api/get-recipes?${queryString}`
      : `${API_BASE_URL}/api/get-recipes`;
    
    console.log('Fetching recipes:', url); // Debug
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

/**
 * Fetch chart data
 * Returns: {
 *   status, 
 *   data: { charts: { bar_chart, heatmap, scatter_plot } }, 
 *   api_performance,
 *   blob_trigger_performance,
 *   performance_comparison,
 *   execution_time, 
 *   timestamp
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
 * Returns: {
 *   status,
 *   service,
 *   version,
 *   timestamp,
 *   checks: { redis_cache, cache_data }
 * }
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