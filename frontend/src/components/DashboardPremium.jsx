import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchInsights, fetchRecipes } from '../services/api';
import BarChart from './BarChart';
import PieChart from './PieChart';
import ScatterChart from './ScatterChart';
import HeatmapChart from './HeatmapChart';

const DashboardPremium = () => {
  const [insights, setInsights] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState('all');
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
    loadInsights();
  }, []);

  // Filter and pagination logic
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      searchQuery === '' ||
      recipe.Recipe_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.Diet_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.Cuisine_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = selectedDiet === 'all' || recipe.Diet_type === selectedDiet;
    return matchesSearch && matchesDiet;
  });

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  const goToPage = (page) => setCurrentPage(page);
  const goToPrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDiet]);

  return (
    <div className="min-h-screen premium-background">
      {/* Premium Glassmorphic Header */}
      <header className="premium-header">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-light text-gray-900 mb-2">
              Nutritional Insights
            </h1>
            <p className="text-gray-500 font-light">
              Cloud-powered nutritional data analysis
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        {insights && (
          <motion.section
            className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatsCard
              title="Total Recipes"
              value={insights.total_recipes.toLocaleString()}
              color="blue"
            />
            <StatsCard
              title="Diet Types"
              value={insights.diet_types}
              color="green"
            />
            <StatsCard
              title="Processing Status"
              value={insights.processing_status}
              color="purple"
            />
          </motion.section>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-8 glass-card border-l-4 border-red-400 p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-light text-gray-800 mb-4">Data Interaction</h2>
          <div className="flex flex-wrap gap-4">
            <PremiumButton onClick={loadInsights} disabled={loading} variant="primary">
              {loading ? 'Loading...' : 'Refresh Insights'}
            </PremiumButton>
            <PremiumButton onClick={loadRecipes} disabled={loading} variant="secondary">
              Get Top Recipes
            </PremiumButton>
          </div>
        </motion.section>

        {/* Search and Filters */}
        <motion.section
          className="mb-8 glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-light text-gray-800 mb-4">Search and Filters</h2>
          <div className="flex flex-wrap gap-4">
            <GlassInput
              type="text"
              placeholder="Search by recipe name, diet, or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-64"
            />
            <GlassSelect
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
            >
              <option value="all">All Diet Types</option>
              {insights?.average_macronutrients?.map((item) => (
                <option key={item.Diet_type} value={item.Diet_type}>
                  {item.Diet_type}
                </option>
              ))}
            </GlassSelect>
            {searchQuery && (
              <PremiumButton onClick={() => setSearchQuery('')} variant="ghost">
                Clear Search
              </PremiumButton>
            )}
          </div>
          {recipes.length > 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredRecipes.length)} of {filteredRecipes.length} recipes
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          )}
        </motion.section>

        {/* Visualizations */}
        {insights && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-light text-gray-800 mb-6">Nutritional Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Average Macronutrients" delay={0.1}>
                <BarChart data={insights.average_macronutrients} />
              </ChartCard>
              <ChartCard title="Recipe Distribution" delay={0.2}>
                <PieChart data={insights.diet_distribution} />
              </ChartCard>
              <ChartCard title="Protein vs Carbs" delay={0.3}>
                <ScatterChart data={insights.protein_carbs_scatter} />
              </ChartCard>
              <ChartCard title="Nutrient Correlations" delay={0.4}>
                <HeatmapChart data={insights.correlation_heatmap} />
              </ChartCard>
            </div>
          </motion.section>
        )}

        {/* Recipes Table */}
        {recipes.length > 0 && (
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-light text-gray-800 mb-6">Top Protein-Rich Recipes</h2>
            <PremiumTable recipes={paginatedRecipes} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between glass-card p-4">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <PaginationButton onClick={goToPrevious} disabled={currentPage === 1}>
                    Previous
                  </PaginationButton>
                  <div className="flex gap-1">
                    {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <PaginationButton
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          active={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationButton>
                      );
                    })}
                  </div>
                  <PaginationButton onClick={goToNext} disabled={currentPage === totalPages}>
                    Next
                  </PaginationButton>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* Loading State */}
        {loading && !insights && (
          <div className="text-center py-20">
            <LoadingSpinner />
            <p className="mt-6 text-gray-500 font-light">Loading nutritional insights...</p>
          </div>
        )}
      </main>

      {/* Premium Footer */}
      <footer className="premium-footer">
        <div className="container mx-auto px-6 py-6 text-center">
          <p className="text-gray-500 font-light">
            &copy; 2025 Nutritional Insights · Powered by Azure Cloud Services
          </p>
        </div>
      </footer>

      <style jsx>{`
        .premium-background {
          background: linear-gradient(
            135deg,
            #fafafa 0%,
            #f5f5f5 50%,
            #fafafa 100%
          );
        }

        .premium-header {
          position: relative;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
        }

        .premium-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.6) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow:
            0 10px 20px rgba(0, 0, 0, 0.03),
            0 4px 8px rgba(0, 0, 0, 0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .premium-footer {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          margin-top: 80px;
        }
      `}</style>
    </div>
  );
};

// Sub-components

const StatsCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/10',
    green: 'from-green-500/10 to-green-500/5 border-green-500/10',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/10',
  };

  const valueColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };

  return (
    <motion.div
      className="glass-card p-6 group cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className={`absolute inset-0 rounded-20 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
          {title}
        </h3>
        <p className={`text-4xl font-light ${valueColors[color]}`}>
          {value}
        </p>
      </div>
    </motion.div>
  );
};

const ChartCard = ({ title, children, delay = 0 }) => {
  return (
    <motion.div
      className="glass-card p-6 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
      <div className="h-80">{children}</div>
    </motion.div>
  );
};

const PremiumButton = ({ children, onClick, disabled, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700',
    secondary: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700',
    ghost: 'bg-white/60 text-gray-700 hover:bg-white/80',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${variants[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } shadow-sm hover:shadow-md`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  );
};

const GlassInput = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={`p-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30
        transition-all duration-300 ${className}`}
    />
  );
};

const GlassSelect = ({ children, ...props }) => {
  return (
    <select
      {...props}
      className="p-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30
        transition-all duration-300 cursor-pointer"
    >
      {children}
    </select>
  );
};

const PremiumTable = ({ recipes }) => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-transparent">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Recipe Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Diet Type</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Cuisine</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Protein (g)</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Carbs (g)</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Fat (g)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/30">
            {recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-blue-50/30 transition-colors duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <td className="px-6 py-4 text-sm text-gray-800">{recipe.Recipe_name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100/60 text-blue-700 rounded-full text-xs font-medium">
                      {recipe.Diet_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{recipe.Cuisine_type}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-gray-800">
                    {recipe['Protein(g)'].toFixed(1)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-600">
                    {recipe['Carbs(g)'].toFixed(1)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-600">
                    {recipe['Fat(g)'].toFixed(1)}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No recipes found. Try a different search term or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaginationButton = ({ children, onClick, disabled, active }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${active
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-white/60 text-gray-700 hover:bg-white/80'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
};

const LoadingSpinner = () => {
  return (
    <motion.div
      className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

export default DashboardPremium;
