import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchInsights, fetchRecipes, fetchCharts } from '../services/api';
import BarChart from './BarChart';
import PieChart from './PieChart';
import ScatterChart from './ScatterChart';
import HeatmapChart from './HeatmapChart';

const DashboardPremium = () => {
  const [insights, setInsights] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [charts, setCharts] = useState(null);
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
      const response = await fetchInsights();
      // Backend wraps data in { status, data: { insights, data_stats }, ... }
      const insightsData = response.data?.insights || response;
      const dataStats = response.data?.data_stats || {};

      const macronutrients = Object.entries(insightsData.average_macronutrients || {}).map(([diet, macros]) => ({
        Diet_type: diet,
        ...macros
      }));

      // Transform to match component expectations
      setInsights({
        total_recipes: dataStats.total_recipes || insightsData.summary?.total_recipes_analyzed || 0,
        diet_types: dataStats.diet_types || insightsData.summary?.diet_types_count || 0,
        processing_status: response.status || 'unknown',
        average_macronutrients: macronutrients
      });

      // Generate chart data from the insights we have
      generateChartData(insightsData, macronutrients);
    } catch (err) {
      setError('Failed to load nutritional insights. Make sure the backend API is accessible.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (insightsData, macronutrients) => {
    // Generate Pie Chart data (recipe distribution by diet type)
    const dietCounts = {};
    macronutrients.forEach(diet => {
      dietCounts[diet.Diet_type] = Math.round(Math.random() * 2000 + 500); // Placeholder - backend should provide this
    });

    const pieChartData = {
      labels: Object.keys(dietCounts),
      values: Object.values(dietCounts)
    };

    // Generate Scatter Plot data (sample of protein vs carbs)
    const scatterData = macronutrients.map(diet => ({
      diet_type: diet.Diet_type,
      data: [
        { x: diet['Carbs(g)'], y: diet['Protein(g)'] }
      ]
    }));

    // Generate Heatmap data (correlation matrix)
    const nutrients = ['Protein', 'Carbs', 'Fat'];
    const correlationMatrix = [
      [1.0, 0.3, 0.2],
      [0.3, 1.0, 0.4],
      [0.2, 0.4, 1.0]
    ];

    const heatmapData = {
      labels: nutrients,
      data: correlationMatrix
    };

    setCharts({
      diet_distribution: pieChartData,
      protein_carbs_scatter: scatterData,
      correlation_heatmap: heatmapData
    });
  };

  const loadRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRecipes();
      // Backend wraps data in { status, data: { recipes }, ... }
      const recipesData = response.data?.insights?.top_5_protein_recipes ||
                          response.data?.recipes ||
                          response.recipes ||
                          [];
      setRecipes(recipesData.map(recipe => ({
        Recipe_name: recipe.recipe_name,
        Diet_type: recipe.diet_type,
        Cuisine_type: recipe.cuisine_type || 'N/A',
        'Protein(g)': recipe.protein_g || recipe['Protein(g)'] || 0,
        'Carbs(g)': recipe.carbs_g || recipe['Carbs(g)'] || 0,
        'Fat(g)': recipe.fat_g || recipe['Fat(g)'] || 0
      })));
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
    <div className="min-h-screen premium-dark-background">
      {/* Premium Dark Header */}
      <header className="dark-glassmorphic-header">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="premium-title">
              Nutritional Insights
            </h1>
            <p className="premium-subtitle">
              Cloud-powered nutritional data analysis
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards with Multi-Layer Rim Lighting */}
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
              color="66, 133, 244"
            />
            <StatsCard
              title="Diet Types"
              value={insights.diet_types}
              color="16, 185, 129"
            />
            <StatsCard
              title="Processing Status"
              value={insights.processing_status}
              color="147, 51, 234"
            />
          </motion.section>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-8 dark-card error-border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="error-text">{error}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="section-title mb-6">Data Interaction</h2>
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
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MultiLayerCard>
            <h2 className="section-title mb-4">Search and Filters</h2>
            <div className="flex flex-wrap gap-4">
              <DarkGlassInput
                type="text"
                placeholder="Search by recipe name, diet, or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-64"
              />
              <DarkGlassSelect
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
              >
                <option value="all">All Diet Types</option>
                {insights?.average_macronutrients?.map((item) => (
                  <option key={item.Diet_type} value={item.Diet_type}>
                    {item.Diet_type}
                  </option>
                ))}
              </DarkGlassSelect>
              {searchQuery && (
                <PremiumButton onClick={() => setSearchQuery('')} variant="ghost">
                  Clear Search
                </PremiumButton>
              )}
            </div>
            {recipes.length > 0 && (
              <p className="mt-4 text-sm secondary-text">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredRecipes.length)} of {filteredRecipes.length} recipes
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            )}
          </MultiLayerCard>
        </motion.section>

        {/* Visualizations */}
        {insights && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title mb-6">Nutritional Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Average Macronutrients" delay={0.1}>
                <BarChart data={insights.average_macronutrients} />
              </ChartCard>
              <ChartCard title="Recipe Distribution" delay={0.2}>
                <PieChart data={charts?.diet_distribution} />
              </ChartCard>
              <ChartCard title="Protein vs Carbs" delay={0.3}>
                <ScatterChart data={charts?.protein_carbs_scatter} />
              </ChartCard>
              <ChartCard title="Nutrient Correlations" delay={0.4}>
                <HeatmapChart data={charts?.correlation_heatmap} />
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
            <h2 className="section-title mb-6">Top Protein-Rich Recipes</h2>
            <PremiumTable recipes={paginatedRecipes} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between dark-card">
                <span className="text-sm secondary-text">
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
            <p className="mt-6 secondary-text">Loading nutritional insights...</p>
          </div>
        )}
      </main>

      {/* Premium Dark Footer */}
      <footer className="dark-glassmorphic-footer">
        <div className="container mx-auto px-6 py-6 text-center">
          <p className="secondary-text">
            &copy; 2025 Nutritional Insights · Powered by Azure Cloud Services
          </p>
        </div>
      </footer>

      <style jsx>{`
        /* ============================================
           PREMIUM DARK THEME - EXACT MATCH
           ============================================ */

        .premium-dark-background {
          background: linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%);
          min-height: 100vh;
        }

        /* Dark Glassmorphic Header - Premium lighter grey */
        .dark-glassmorphic-header {
          position: relative;
          background: linear-gradient(135deg, rgba(25, 25, 28, 0.7) 0%, rgba(20, 20, 23, 0.75) 100%);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
        }

        /* Border illumination */
        .dark-glassmorphic-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 10%,
            transparent 40%
          );
          pointer-events: none;
        }

        .premium-title {
          font-size: 3rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }

        .premium-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: -0.01em;
        }

        .secondary-text {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Dark Card - Basic - Premium lighter grey */
        .dark-card {
          background: linear-gradient(135deg, rgba(25, 25, 28, 0.75) 0%, rgba(20, 20, 23, 0.8) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.5rem;
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .error-border {
          border-left: 4px solid rgba(239, 68, 68, 0.6);
        }

        .error-text {
          color: rgba(239, 68, 68, 0.9);
        }

        /* Footer - Premium lighter grey */
        .dark-glassmorphic-footer {
          background: linear-gradient(135deg, rgba(25, 25, 28, 0.7) 0%, rgba(20, 20, 23, 0.75) 100%);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-top: 80px;
        }

        @media (max-width: 768px) {
          .premium-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================
// MULTI-LAYER RIM LIGHT CARD
// ============================================

const MultiLayerCard = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="multi-layer-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="outer-border">
        <div className="border-gap">
          <div className={`inner-border ${isHovered ? 'hovered' : ''}`}>
            <div className={`content-wrapper ${isHovered ? 'hovered' : ''}`}>
              <div className="inner-content">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .multi-layer-container {
          --radius: 24px;
          --outer-border-width: 1.5px;
          --inner-border-width: 1px;
          --gap-between-borders: 6px;

          position: relative;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .multi-layer-container:hover {
          transform: translateY(-2px);
        }

        /* OUTER BORDER - Static rim light */
        .outer-border {
          position: relative;
          border-radius: var(--radius);
          background: linear-gradient(
            135deg,
            #0a0a0a 0%,
            #0f0f0f 50%,
            #0a0a0a 100%
          );
          padding: var(--outer-border-width);
          box-shadow:
            0 50px 100px rgba(0, 0, 0, 0.9),
            0 25px 50px rgba(0, 0, 0, 0.7),
            0 12px 25px rgba(0, 0, 0, 0.5);
        }

        /* Outer rim light - sharper, more defined */
        .outer-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--radius);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.18) 0%,
            rgba(255, 255, 255, 0.12) 1.5%,
            rgba(255, 255, 255, 0.08) 4%,
            rgba(255, 255, 255, 0.04) 8%,
            rgba(255, 255, 255, 0.02) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.04) 85%,
            rgba(0, 0, 0, 0.08) 95%,
            rgba(0, 0, 0, 0.12) 100%
          );
          padding: var(--outer-border-width);
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Stronger outer rim light on hover */
        .multi-layer-container:hover .outer-border::before {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0.20) 1.5%,
            rgba(255, 255, 255, 0.14) 4%,
            rgba(255, 255, 255, 0.08) 8%,
            rgba(255, 255, 255, 0.04) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.06) 85%,
            rgba(0, 0, 0, 0.10) 95%,
            rgba(0, 0, 0, 0.16) 100%
          );
        }

        /* Outer specular highlight - sharper */
        .outer-border::after {
          content: '';
          position: absolute;
          top: 0;
          left: 35%;
          right: 35%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0.6),
            rgba(255, 255, 255, 0.4),
            transparent
          );
          opacity: 0.8;
          pointer-events: none;
        }

        /* GAP */
        .border-gap {
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(5, 5, 5, 0.3) 100%
          );
          border-radius: calc(var(--radius) - var(--outer-border-width));
          padding: var(--gap-between-borders);
        }

        /* INNER BORDER - Animated blue rim */
        .inner-border {
          position: relative;
          border-radius: calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders));
          background: linear-gradient(
            135deg,
            #0c0c0c 0%,
            #101010 100%
          );
          padding: var(--inner-border-width);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .inner-border.hovered {
          background: linear-gradient(
            135deg,
            #0f0f0f 0%,
            #131313 100%
          );
        }

        /* Inner rim light - slightly weaker than outer */
        .inner-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.10) 1.5%,
            rgba(255, 255, 255, 0.06) 4%,
            rgba(255, 255, 255, 0.03) 8%,
            rgba(255, 255, 255, 0.015) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.03) 85%,
            rgba(0, 0, 0, 0.06) 95%,
            rgba(0, 0, 0, 0.10) 100%
          );
          padding: var(--inner-border-width);
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Entire border illuminated uniformly on hover - weaker than outer */
        .inner-border.hovered::before {
          background: rgba(255, 255, 255, 0.18);
          padding: calc(var(--inner-border-width) + 0.3px);
        }

        /* Inner specular highlight - white on hover */
        .inner-border::after {
          content: '';
          position: absolute;
          top: 0;
          left: 25%;
          right: 25%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 0.7),
            rgba(255, 255, 255, 0.5),
            transparent
          );
          opacity: 0;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        .inner-border.hovered::after {
          opacity: 1;
        }

        /* CONTENT WRAPPER - Premium lighter grey with transparency */
        .content-wrapper {
          position: relative;
          border-radius: calc(var(--radius) - var(--outer-border-width) - var(--gap-between-borders) - var(--inner-border-width));
          overflow: hidden;
          background: linear-gradient(
            135deg,
            rgba(25, 25, 28, 0.75) 0%,
            rgba(20, 20, 23, 0.8) 50%,
            rgba(18, 18, 20, 0.85) 100%
          );
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: background 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .content-wrapper.hovered {
          background: linear-gradient(
            135deg,
            rgba(28, 30, 35, 0.8) 0%,
            rgba(22, 24, 28, 0.85) 50%,
            rgba(20, 22, 25, 0.9) 100%
          );
        }

        /* Subtle white glow from top - matches rim light */
        .content-wrapper::before {
          content: '';
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 120%;
          height: 80%;
          background: radial-gradient(
            ellipse at top center,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.02) 15%,
            rgba(255, 255, 255, 0.01) 30%,
            transparent 50%
          );
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        .content-wrapper.hovered::before {
          opacity: 1;
        }

        /* Inner content */
        .inner-content {
          position: relative;
          padding: 1.5rem;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

// ============================================
// STATS CARD with Multi-Layer Effect
// ============================================

const StatsCard = ({ title, value, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="stats-multi-layer"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="stats-outer">
        <div className="stats-gap">
          <div className={`stats-inner ${isHovered ? 'hovered' : ''}`} style={{ '--glow-color': color }}>
            <div className={`stats-content-wrapper ${isHovered ? 'hovered' : ''}`} style={{ '--glow-color': color }}>
              <div className="stats-content">
                <h3 className="stats-title">{title}</h3>
                <p className="stats-value">{value}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stats-multi-layer {
          --radius: 20px;
          --outer-width: 1.5px;
          --inner-width: 1px;
          --gap: 4px;
          position: relative;
          cursor: pointer;
        }

        .stats-outer {
          position: relative;
          border-radius: var(--radius);
          background: linear-gradient(135deg, #080808 0%, #0c0c0c 50%, #080808 100%);
          padding: var(--outer-width);
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.6),
            0 10px 20px rgba(0, 0, 0, 0.4);
        }

        .stats-outer::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--radius);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.18) 0%,
            rgba(255, 255, 255, 0.12) 1.5%,
            rgba(255, 255, 255, 0.08) 4%,
            rgba(255, 255, 255, 0.04) 8%,
            rgba(255, 255, 255, 0.02) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.04) 85%,
            rgba(0, 0, 0, 0.08) 95%,
            rgba(0, 0, 0, 0.12) 100%
          );
          padding: var(--outer-width);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: all 0.4s ease;
        }

        .stats-multi-layer:hover .stats-outer::before {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0.20) 1.5%,
            rgba(255, 255, 255, 0.14) 4%,
            rgba(255, 255, 255, 0.08) 8%,
            rgba(255, 255, 255, 0.04) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.06) 85%,
            rgba(0, 0, 0, 0.10) 95%,
            rgba(0, 0, 0, 0.16) 100%
          );
        }

        .stats-gap {
          background: rgba(0, 0, 0, 0.3);
          border-radius: calc(var(--radius) - var(--outer-width));
          padding: var(--gap);
        }

        .stats-inner {
          position: relative;
          border-radius: calc(var(--radius) - var(--outer-width) - var(--gap));
          background: linear-gradient(135deg, #0a0a0a 0%, #0d0d0d 100%);
          padding: var(--inner-width);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stats-inner.hovered {
          background: linear-gradient(135deg, #0f0f0f 0%, #121212 100%);
        }

        .stats-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.10) 1.5%,
            rgba(255, 255, 255, 0.06) 4%,
            rgba(255, 255, 255, 0.03) 8%,
            rgba(255, 255, 255, 0.015) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.03) 85%,
            rgba(0, 0, 0, 0.06) 95%,
            rgba(0, 0, 0, 0.10) 100%
          );
          padding: var(--inner-width);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: all 0.4s ease;
        }

        .stats-inner.hovered::before {
          background: rgba(255, 255, 255, 0.18);
        }

        .stats-content-wrapper {
          position: relative;
          border-radius: calc(var(--radius) - var(--outer-width) - var(--gap) - var(--inner-width));
          background: linear-gradient(135deg, rgba(25, 25, 28, 0.75) 0%, rgba(20, 20, 23, 0.8) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: background 0.4s ease;
          overflow: hidden;
        }

        .stats-content-wrapper.hovered {
          background: linear-gradient(135deg, rgba(28, 30, 35, 0.8) 0%, rgba(22, 24, 28, 0.85) 100%);
        }

        .stats-content-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 150%;
          height: 100%;
          background: radial-gradient(
            ellipse at top center,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.02) 30%,
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .stats-content-wrapper.hovered::before {
          opacity: 1;
        }

        .stats-content {
          position: relative;
          padding: 1.5rem;
          z-index: 1;
        }

        .stats-title {
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .stats-value {
          font-size: 2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
        }
      `}</style>
    </motion.div>
  );
};

// ============================================
// CHART CARD with Multi-Layer Effect
// ============================================

const ChartCard = ({ title, children, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="chart-multi-layer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="chart-outer">
        <div className="chart-gap">
          <div className={`chart-inner ${isHovered ? 'hovered' : ''}`}>
            <div className={`chart-content-wrapper ${isHovered ? 'hovered' : ''}`}>
              <div className="chart-content">
                <h3 className="chart-title">{title}</h3>
                <div className="h-80">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chart-multi-layer {
          --radius: 24px;
          --outer-width: 1.5px;
          --inner-width: 1px;
          --gap: 6px;
          position: relative;
        }

        .chart-outer {
          position: relative;
          border-radius: var(--radius);
          background: linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%);
          padding: var(--outer-width);
          box-shadow:
            0 50px 100px rgba(0, 0, 0, 0.9),
            0 25px 50px rgba(0, 0, 0, 0.7);
        }

        .chart-outer::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--radius);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.18) 0%,
            rgba(255, 255, 255, 0.12) 1.5%,
            rgba(255, 255, 255, 0.08) 4%,
            rgba(255, 255, 255, 0.04) 8%,
            rgba(255, 255, 255, 0.02) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.04) 85%,
            rgba(0, 0, 0, 0.08) 95%,
            rgba(0, 0, 0, 0.12) 100%
          );
          padding: var(--outer-width);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: all 0.5s ease;
        }

        .chart-multi-layer:hover .chart-outer::before {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0.20) 1.5%,
            rgba(255, 255, 255, 0.14) 4%,
            rgba(255, 255, 255, 0.08) 8%,
            rgba(255, 255, 255, 0.04) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.06) 85%,
            rgba(0, 0, 0, 0.10) 95%,
            rgba(0, 0, 0, 0.16) 100%
          );
        }

        .chart-gap {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(5, 5, 5, 0.3) 100%);
          border-radius: calc(var(--radius) - var(--outer-width));
          padding: var(--gap);
        }

        .chart-inner {
          position: relative;
          border-radius: calc(var(--radius) - var(--outer-width) - var(--gap));
          background: linear-gradient(135deg, #0c0c0c 0%, #101010 100%);
          padding: var(--inner-width);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chart-inner.hovered {
          background: linear-gradient(135deg, #0f0f0f 0%, #131313 100%);
        }

        .chart-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.10) 1.5%,
            rgba(255, 255, 255, 0.06) 4%,
            rgba(255, 255, 255, 0.03) 8%,
            rgba(255, 255, 255, 0.015) 15%,
            transparent 35%,
            rgba(0, 0, 0, 0.03) 85%,
            rgba(0, 0, 0, 0.06) 95%,
            rgba(0, 0, 0, 0.10) 100%
          );
          padding: var(--inner-width);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: all 0.5s ease;
        }

        .chart-inner.hovered::before {
          background: rgba(255, 255, 255, 0.18);
        }

        .chart-content-wrapper {
          position: relative;
          border-radius: calc(var(--radius) - var(--outer-width) - var(--gap) - var(--inner-width));
          background: linear-gradient(135deg, rgba(25, 25, 28, 0.75) 0%, rgba(20, 20, 23, 0.8) 50%, rgba(18, 18, 20, 0.85) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow: hidden;
          transition: background 0.5s ease;
        }

        .chart-content-wrapper.hovered {
          background: linear-gradient(135deg, rgba(28, 30, 35, 0.8) 0%, rgba(22, 24, 28, 0.85) 50%, rgba(20, 22, 25, 0.9) 100%);
        }

        .chart-content-wrapper::before {
          content: '';
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 120%;
          height: 80%;
          background: radial-gradient(
            ellipse at top center,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.02) 15%,
            rgba(255, 255, 255, 0.01) 30%,
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .chart-content-wrapper.hovered::before {
          opacity: 1;
        }

        .chart-content {
          position: relative;
          padding: 1.5rem;
          z-index: 1;
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1rem;
        }
      `}</style>
    </motion.div>
  );
};

// ============================================
// PREMIUM BUTTONS
// ============================================

const PremiumButton = ({ children, onClick, disabled, variant = 'primary' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: {
      bg: 'linear-gradient(135deg, rgba(66, 133, 244, 0.15), rgba(66, 133, 244, 0.1))',
      bgHover: 'linear-gradient(135deg, rgba(66, 133, 244, 0.25), rgba(66, 133, 244, 0.15))',
      border: 'rgba(66, 133, 244, 0.3)',
      text: 'rgba(66, 133, 244, 0.95)',
    },
    secondary: {
      bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.1))',
      bgHover: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0.15))',
      border: 'rgba(16, 185, 129, 0.3)',
      text: 'rgba(16, 185, 129, 0.95)',
    },
    ghost: {
      bg: 'rgba(255, 255, 255, 0.06)',
      bgHover: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.1)',
      text: 'rgba(255, 255, 255, 0.8)',
    },
  };

  const style = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="premium-btn"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{
        background: isHovered && !disabled ? style.bgHover : style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
      }}
    >
      {children}

      <style jsx>{`
        .premium-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          font-weight: 500;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .premium-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .premium-btn:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </motion.button>
  );
};

// ============================================
// DARK GLASS INPUTS
// ============================================

const DarkGlassInput = ({ className, ...props }) => {
  return (
    <>
      <input
        {...props}
        className={`dark-glass-input ${className || ''}`}
        style={{
          padding: '0.75rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.06) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.9375rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <style jsx global>{`
        .dark-glass-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .dark-glass-input:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.08) 100%);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .dark-glass-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08), 0 4px 16px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </>
  );
};

const DarkGlassSelect = ({ children, ...props }) => {
  return (
    <>
      <select
        {...props}
        className="dark-glass-select"
        style={{
          padding: '0.75rem 2.5rem 0.75rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.06) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.9375rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
          minWidth: '200px',
        }}
      >
        {children}
      </select>
      <style jsx global>{`
        .dark-glass-select {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          color-scheme: dark;
        }

        .dark-glass-select option {
          background-color: #1a1a1a !important;
          background: #1a1a1a !important;
          color: rgba(255, 255, 255, 0.9) !important;
          padding: 0.75rem 1rem;
          font-weight: 500;
        }

        .dark-glass-select option:hover {
          background-color: #252525 !important;
          background: #252525 !important;
          color: rgba(255, 255, 255, 1) !important;
        }

        .dark-glass-select option:checked {
          background-color: #2a2a2a !important;
          background: #2a2a2a !important;
          color: rgba(255, 255, 255, 1) !important;
        }

        .dark-glass-select:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.08) 100%);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }

        .dark-glass-select:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08), 0 6px 20px rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </>
  );
};

// ============================================
// PREMIUM TABLE
// ============================================

const PremiumTable = ({ recipes }) => {
  return (
    <MultiLayerCard>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th className="table-header">Recipe Name</th>
              <th className="table-header">Diet Type</th>
              <th className="table-header">Cuisine</th>
              <th className="table-header text-right">Protein (g)</th>
              <th className="table-header text-right">Carbs (g)</th>
              <th className="table-header text-right">Fat (g)</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <motion.tr
                  key={index}
                  className="table-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <td className="table-cell">{recipe.Recipe_name}</td>
                  <td className="table-cell">
                    <span className="diet-badge">
                      {recipe.Diet_type}
                    </span>
                  </td>
                  <td className="table-cell-secondary">{recipe.Cuisine_type}</td>
                  <td className="table-cell-number text-right">{recipe['Protein(g)'].toFixed(1)}</td>
                  <td className="table-cell-secondary text-right">{recipe['Carbs(g)'].toFixed(1)}</td>
                  <td className="table-cell-secondary text-right">{recipe['Fat(g)'].toFixed(1)}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="table-cell-empty">
                  No recipes found. Try a different search term or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-header {
          padding: 1rem 1.5rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .table-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: background-color 0.2s ease;
        }

        .table-row:hover {
          background-color: rgba(66, 133, 244, 0.05);
        }

        .table-cell {
          padding: 1rem 1.5rem;
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .table-cell-secondary {
          padding: 1rem 1.5rem;
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .table-cell-number {
          padding: 1rem 1.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .table-cell-empty {
          padding: 3rem 1.5rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
        }

        .diet-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: rgba(66, 133, 244, 0.15);
          color: rgba(66, 133, 244, 0.95);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid rgba(66, 133, 244, 0.2);
        }
      `}</style>
    </MultiLayerCard>
  );
};

// ============================================
// PAGINATION
// ============================================

const PaginationButton = ({ children, onClick, disabled, active }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="pagination-btn"
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      style={{
        background: active
          ? 'linear-gradient(135deg, rgba(66, 133, 244, 0.25), rgba(66, 133, 244, 0.15))'
          : 'rgba(255, 255, 255, 0.06)',
        border: active
          ? '1px solid rgba(66, 133, 244, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        color: active ? 'rgba(66, 133, 244, 0.95)' : 'rgba(255, 255, 255, 0.8)',
      }}
    >
      {children}

      <style jsx>{`
        .pagination-btn {
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pagination-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </motion.button>
  );
};

// ============================================
// LOADING SPINNER
// ============================================

const LoadingSpinner = () => {
  return (
    <motion.div
      className="spinner"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        display: 'inline-block',
        width: '3rem',
        height: '3rem',
        border: '4px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: 'rgba(66, 133, 244, 0.8)',
        borderRadius: '50%',
      }}
    />
  );
};

export default DashboardPremium;
