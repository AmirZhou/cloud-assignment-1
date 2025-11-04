import { useState, useEffect } from 'react';
import { fetchInsights, fetchRecipes } from '../services/api';
import BarChart from './BarChart';
import PieChart from './PieChart';
import ScatterChart from './ScatterChart';
import HeatmapChart from './HeatmapChart';

const Dashboard = () => {
  const [insights, setInsights] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState('all');

  // Search and Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInsights();
      setInsights(data);
    } catch (err) {
      setError('Failed to load nutritional insights. Make sure the API server is running on port 5000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecipes();
      setRecipes(data.recipes);
    } catch (err) {
      setError('Failed to load recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load insights on component mount
    loadInsights();
  }, []);

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      searchQuery === '' ||
      recipe.Recipe_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.Diet_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.Cuisine_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiet = selectedDiet === 'all' || recipe.Diet_type === selectedDiet;

    return matchesSearch && matchesDiet;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDiet]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 p-6 text-white shadow-lg">
        <h1 className="text-4xl font-bold">Nutritional Insights Dashboard</h1>
        <p className="text-blue-100 mt-2">Cloud-based nutritional data analysis</p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Stats Section */}
        {insights && (
          <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-600 text-sm font-semibold">Total Recipes</h3>
              <p className="text-3xl font-bold text-blue-600">{insights.total_recipes}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-600 text-sm font-semibold">Diet Types</h3>
              <p className="text-3xl font-bold text-green-600">{insights.diet_types}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-600 text-sm font-semibold">Status</h3>
              <p className="text-xl font-semibold text-gray-700 capitalize">
                {insights.processing_status}
              </p>
            </div>
          </section>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* API Interaction Buttons */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Interaction</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={loadInsights}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Loading...' : 'Refresh Insights'}
            </button>
            <button
              onClick={loadRecipes}
              disabled={loading}
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              Get Top Recipes
            </button>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Search and Filters</h2>
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by recipe name, diet, or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-lg flex-1 min-w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
              className="p-2 border rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Diet Types</option>
              {insights?.average_macronutrients?.map((item) => (
                <option key={item.Diet_type} value={item.Diet_type}>
                  {item.Diet_type}
                </option>
              ))}
            </select>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Clear Search
              </button>
            )}
          </div>
          {recipes.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredRecipes.length)} of {filteredRecipes.length} recipes
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          )}
        </section>

        {/* Visualizations */}
        {insights && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Nutritional Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <div className="h-80">
                  <BarChart data={insights.average_macronutrients} />
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <div className="h-80">
                  <PieChart data={insights.diet_distribution} />
                </div>
              </div>

              {/* Scatter Plot */}
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <div className="h-80">
                  <ScatterChart data={insights.protein_carbs_scatter} />
                </div>
              </div>

              {/* Heatmap */}
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <div className="h-80">
                  <HeatmapChart data={insights.correlation_heatmap} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recipes Table */}
        {recipes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Top Protein-Rich Recipes</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Recipe Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Diet Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Cuisine
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Protein (g)
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Carbs (g)
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Fat (g)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedRecipes.length > 0 ? (
                      paginatedRecipes.map((recipe, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{recipe.Recipe_name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {recipe.Diet_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{recipe.Cuisine_type}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold">
                            {recipe['Protein(g)'].toFixed(1)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {recipe['Carbs(g)'].toFixed(1)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {recipe['Fat(g)'].toFixed(1)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          No recipes found. Try a different search term or filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={goToPrevious}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          Math.abs(pageNumber - currentPage) <= 1;

                        if (!showPage && pageNumber === currentPage - 2) {
                          return (
                            <span key={pageNumber} className="px-2 py-1">
                              ...
                            </span>
                          );
                        }

                        if (!showPage && pageNumber === currentPage + 2) {
                          return (
                            <span key={pageNumber} className="px-2 py-1">
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`px-3 py-1 rounded transition ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={goToNext}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && !insights && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading nutritional insights...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 p-6 text-white text-center mt-10">
        <p>&copy; 2025 Nutritional Insights. Powered by Azure Cloud Services</p>
      </footer>
    </div>
  );
};

export default Dashboard;
