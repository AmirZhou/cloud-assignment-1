import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@clerk/clerk-react';
import { fetchInsights, fetchRecipes, fetchCharts } from '../services/api';
import BarChart from './BarChart';
import InsightCard from './InsightCard';
import StatsCard from './StatsCard';
import MultiLayerCard from './MultiLayerCard';
import ChartCard from './ChartCard';
import PremiumTable from './PremiumTable';
import DarkGlassInput from './DarkGlassInput';
import DarkGlassSelect from './DarkGlassSelect';
import PremiumButton from './PremiumButton';
import PaginationButton from './PaginationButton';
import PerformanceMetric from './PerformanceMetric';
import LoadingSpinner from './LoadingSpinner';

const ALL_CUISINES = [
  "american", "asian", "british", "caribbean", "central europe",
  "chinese", "eastern europe", "french", "indian", "italian",
  "japanese", "kosher", "mediterranean", "mexican", "middle eastern",
  "nordic", "south american", "south east asian", "world"
];

const DashboardPremium = () => {
  const [insights, setInsights] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [recipeMeta, setRecipeMeta] = useState(null);
  const [pagination, setPagination] = useState(null); // Set pagination using backend data
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all'); // Set cuisine filter
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Set performance and enhanced insights data
  const [performanceData, setPerformanceData] = useState(null);
  const [enhancedInsights, setEnhancedInsights] = useState(null);

  // Track scroll position for sticky header animation
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchInsights();
      const insightsData = response.data?.insights || response;
      const dataStats = response.data?.data_stats || {};
      
      // Performance that will be displayed in the Performance Comparison section
      setPerformanceData({
        api_time: response.api_performance?.api_response_time_sec,
        blob_total_time: response.blob_trigger_performance?.step_times?.total_processing_sec,
        step_times: response.blob_trigger_performance?.step_times,
        last_processed: response.blob_trigger_performance?.last_processed,
        speedup: response.performance_comparison?.api_vs_blob_speedup,
        total_recipes_processed: response.blob_trigger_performance?.total_recipes_processed
      });
      
      // Set enhanced insights
      const highestProteinDiet = insightsData.highest_protein_diet;
      setEnhancedInsights({
        diet_with_highest_protein: highestProteinDiet ? {
          diet_type: highestProteinDiet,
          avg_protein_g: insightsData.average_macronutrients?.[highestProteinDiet]?.['Protein(g)']
        } : null,
        most_common_cuisines: insightsData.most_common_cuisines,
        ratios: highestProteinDiet ? insightsData.average_ratios?.[highestProteinDiet] : null
      });

      const macronutrients = Object.entries(insightsData.average_macronutrients || {}).map(([diet, macros]) => ({
        Diet_type: diet,
        ...macros
      }));

      // Transform to match component expectations
      setInsights({
        total_recipes: dataStats.total_recipes || insightsData.summary?.total_recipes_analyzed || 0,
        diet_types: dataStats.diet_types || insightsData.summary?.diet_types_count || 0,
        cuisine_types: dataStats.cuisines || 0, 
        processing_status: response.status || 'unknown',
        average_macronutrients: macronutrients,
        execution_time: response.api_performance?.api_response_time_sec, 
        timestamp: response.api_performance?.timestamp
      });

      loadChartImages();
    } catch (err) {
      setError('Failed to load nutritional insights. Make sure the backend API is accessible.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadChartImages = async () => {
    try {
      const response = await fetchCharts();
      
      // Set performance data when chart generation returns
      if (response.blob_trigger_performance) {
        setPerformanceData(prev => ({
          ...prev,
          chart_generation_time: response.blob_trigger_performance.step_times?.chart_generation_sec,
          last_processed: response.blob_trigger_performance.last_processed
        }));
      }
      
      if (response.data) {
        setCharts({
          processing_status: response.status || 'unknown',
          execution_time: response.api_performance?.api_response_time_sec,
          timestamp: response.api_performance?.timestamp,
          bar_chart: response.data.bar_chart,
          heatmap: response.data.heatmap,
          scatter_plot: response.data.scatter_plot,
        });
      }
    } catch (err) {
      console.error('Failed to load charts:', err);
    }
  };

  // Set recipes using backend filtering & pagination
  const loadRecipes = async (resetPage = false) => {
    setLoading(true);
    setError(null);
    
    const pageToLoad = resetPage ? 1 : currentPage;
    
    try {
      const response = await fetchRecipes({
        diet_type: selectedDiet !== 'all' ? selectedDiet : undefined,
        cuisine_type: selectedCuisine !== 'all' ? selectedCuisine : undefined,
        keyword: searchQuery || undefined,
        page: pageToLoad,
        page_size: itemsPerPage
      });
      
      // Set recipes using backend results
      const recipesData = response.data?.recipes || [];
      setRecipes(recipesData.map(recipe => ({
        Recipe_name: recipe.recipe_name,
        Diet_type: recipe.diet_type,
        Cuisine_type: recipe.cuisine_type || 'N/A',
        'Protein(g)': recipe.protein_g || recipe['Protein(g)'] || 0,
        'Carbs(g)': recipe.carbs_g || recipe['Carbs(g)'] || 0,
        'Fat(g)': recipe.fat_g || recipe['Fat(g)'] || 0
      })));
      
      // Set pagination using backend data
      setPagination(response.data?.pagination);
      
      setRecipeMeta({
        execution_time: response.api_performance?.api_response_time_sec || 0,
        timestamp: response.api_performance?.timestamp || new Date().toLocalString()
      });
      
      // Set performance data When api call returns
      if (response.api_performance) {
        setPerformanceData(prev => ({
          ...prev,
          api_time: response.api_performance.api_response_time_sec
        }));
      }
      
      if (resetPage) {
        setCurrentPage(1);
      }
    } catch (err) {
      setError('Failed to load recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
    loadRecipes();
  }, []);

  //  When filters or search change, reset to page 1 and reload
  useEffect(() => {
    if (insights) {
      loadRecipes(true);
    }
  }, [selectedDiet, selectedCuisine, searchQuery]);

  //  When page changes, reload
  useEffect(() => {
    if (insights && currentPage > 1) {
      loadRecipes(false);
    }
  }, [currentPage]);

  // === Pagination Logic ===
  const filteredRecipes = recipes; // Recipes are already filtered by backend
  const totalPages = pagination?.total_pages || Math.ceil(filteredRecipes.length / itemsPerPage);
  const totalRecipes = pagination?.total || filteredRecipes.length;
  const startIndex = pagination ? ((pagination.page - 1) * pagination.page_size) : ((currentPage - 1) * itemsPerPage);
  const endIndex = pagination ? Math.min(startIndex + recipes.length, totalRecipes) : Math.min(startIndex + itemsPerPage, filteredRecipes.length);
  const paginatedRecipes = pagination ? recipes : filteredRecipes.slice(startIndex, endIndex);

  const goToPage = (page) => setCurrentPage(page);
  const goToPrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="min-h-screen premium-dark-background">
      {/* Premium Dark Header - Sticky with shrink animation */}
      <header className={`dark-glassmorphic-header sticky-header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className={`container mx-auto px-6 header-content ${isScrolled ? 'py-3' : 'py-8'}`}>
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="header-title-container"
            >
              <h1 className={`premium-title ${isScrolled ? 'title-scrolled' : ''}`}>
                Nutritional Insights
              </h1>
              <p className={`premium-subtitle ${isScrolled ? 'subtitle-scrolled' : ''}`}>
                Cloud-powered nutritional data analysis
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center"
            >
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: `transition-all duration-300 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}`,
                    userButtonTrigger: 'focus:shadow-none focus:ring-2 focus:ring-white/20 rounded-full',
                    userButtonPopoverCard: 'clerk-popover-card',
                    userButtonPopoverActions: 'clerk-popover-actions',
                    userButtonPopoverActionButton: 'clerk-popover-action',
                    userButtonPopoverActionButtonText: 'clerk-popover-action-text',
                    userButtonPopoverActionButtonIcon: 'clerk-popover-action-icon',
                    userButtonPopoverFooter: 'hidden',
                    userPreviewMainIdentifier: 'clerk-user-name',
                    userPreviewSecondaryIdentifier: 'clerk-user-email',
                    userButtonPopoverMain: 'clerk-popover-main',
                  },
                  variables: {
                    colorBackground: 'rgba(20, 20, 22, 0.98)',
                    colorText: 'rgba(255, 255, 255, 0.9)',
                    colorTextSecondary: 'rgba(255, 255, 255, 0.5)',
                    colorPrimary: 'rgba(255, 255, 255, 0.9)',
                    colorDanger: 'rgba(239, 68, 68, 0.9)',
                    borderRadius: '16px',
                  }
                }}
              />
            </motion.div>
          </div>
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
              subtitle={insights.cuisine_types ? `${insights.cuisine_types} Cuisine Types` : undefined} 
              color="16, 185, 129"
            />
            <StatsCard
              title="Insight Generation Time"
              value={performanceData?.blob_total_time ? `${performanceData.blob_total_time}s` : (insights.execution_time || 'Loading...')}
              subtitle={performanceData?.last_processed ? 
                `Processed: ${new Date(performanceData.last_processed).toLocaleString()}` : undefined}
              color="147, 51, 234"
            />
          </motion.section>
        )}

        {/* Performance Comparison Section (using consistent style) */}
        {performanceData && performanceData.step_times && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <MultiLayerCard>
              <h2 className="section-title mb-6">⚡ Performance Optimization</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BlobTrigger Processing */}
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    color: 'rgba(66, 133, 244, 0.9)',
                    marginBottom: '1rem'
                  }}>
                    BlobTrigger Processing (One-time)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <PerformanceMetric 
                      label="Data Cleaning" 
                      value={`${performanceData.step_times.data_cleaning_sec}s`}
                      color="16, 185, 129"
                    />
                    <PerformanceMetric 
                      label="Chart Generation" 
                      value={`${performanceData.step_times.chart_generation_sec}s`}
                      color="147, 51, 234"
                    />
                    <PerformanceMetric 
                      label="Insights Calculation" 
                      value={`${performanceData.step_times.insights_calculation_sec}s`}
                      color="245, 158, 11"
                    />
                    <PerformanceMetric 
                      label="Recipe Caching" 
                      value={`${performanceData.step_times.recipe_caching_sec}s`}
                      color="236, 72, 153"
                    />
                    <div style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingTop: '0.75rem',
                      marginTop: '0.5rem'
                    }}>
                      <PerformanceMetric 
                        label="Total Processing" 
                        value={`${performanceData.blob_total_time}s`}
                        color="66, 133, 244"
                        bold
                      />
                    </div>
                    {performanceData.total_recipes_processed && (
                      <p className="text-sm secondary-text mt-2">
                        Processed {performanceData.total_recipes_processed.toLocaleString()} recipes
                      </p>
                    )}
                  </div>
                </div>

                {/* API Response Time */}
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    color: 'rgba(16, 185, 129, 0.9)',
                    marginBottom: '1rem'
                  }}>
                    API Response Time (Every Request)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <PerformanceMetric 
                      label="Current API Call" 
                      value={`${performanceData.api_time}s`}
                      color="16, 185, 129"
                    />
                    <div style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingTop: '0.75rem',
                      marginTop: '0.5rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          fontWeight: 600 
                        }}>
                          Speed Improvement:
                        </span>
                        <span style={{ 
                          color: 'rgba(147, 51, 234, 0.95)', 
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          fontFamily: 'monospace'
                        }}>
                          {performanceData.speedup || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Explanation */}
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.08), rgba(147, 51, 234, 0.08))',
                    borderRadius: '12px',
                    border: '1px solid rgba(66, 133, 244, 0.15)'
                  }}>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: '1.6'
                    }}>
                      <span style={{ fontWeight: 600, color: 'rgba(66, 133, 244, 0.95)' }}>
                        ✨ Redis Cache Magic:
                      </span>
                      {' '}Data processing happens once. API calls read pre-computed results, making responses{' '}
                      <span style={{ fontWeight: 600, color: 'rgba(147, 51, 234, 0.95)' }}>
                        {performanceData.speedup}
                      </span>
                      {' '}faster!
                    </p>
                  </div>
                </div>
              </div>
            </MultiLayerCard>
          </motion.section>
        )}

        {/* Enhanced Insights Section */}
        {enhancedInsights && (enhancedInsights.diet_with_highest_protein || enhancedInsights.most_common_cuisines || enhancedInsights.ratios) && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            <h2 className="section-title mb-6">📊 Key Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {enhancedInsights.diet_with_highest_protein && (
                <InsightCard
                  icon="🥩"
                  title="Highest Protein Diet"
                  value={enhancedInsights.diet_with_highest_protein.diet_type}
                  subtitle={`${enhancedInsights.diet_with_highest_protein.avg_protein_g?.toFixed(1)}g average`}
                  color="245, 158, 11"
                />
              )}
              
              {enhancedInsights.most_common_cuisines &&
                Object.keys(enhancedInsights.most_common_cuisines).length > 0 && (
                  <InsightCard
                    icon="🌍"
                    title="Most Common Cuisines"
                    value={
                        Object.entries(enhancedInsights.most_common_cuisines)
                          .map(([diet, cuisine], index) => {
                            const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

                            return (
                              <div key={index}>
                                {cap(diet)} : {cap(cuisine)}
                              </div>
                            );
                          })
                      }
                    subtitle="Per diet type"
                    color="16, 185, 129"
                  />
              )}
              
              {enhancedInsights.ratios && (
                <InsightCard
                  icon="⚖️"
                  title="Avg Macro Ratios"
                  value={`P:C = ${enhancedInsights.ratios.Protein_to_Carbs_ratio?.toFixed(1)}:1, C:F = ${enhancedInsights.ratios.Carbs_to_Fat_ratio?.toFixed(1)}:1`}
                  subtitle="Protein as baseline"
                  color="147, 51, 234"
                />
              )}
            </div>
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
              <PremiumButton onClick={() => loadRecipes(true)} disabled={loading} variant="primary">
                Search Recipes
              </PremiumButton>

              <PremiumButton
                onClick={async() => {
                  setCurrentPage(1);
                  await loadRecipes(true);
                }}
                disabled={loading}
                variant="secondary"
              >
                {loading ? 'Loading...' : 'Refresh Recipes'}
              </PremiumButton>

              <PremiumButton onClick={loadInsights} disabled={loading} variant="secondary">
                Refresh Insights
              </PremiumButton>

              <PremiumButton onClick={loadChartImages} disabled={loading} variant="secondary">
                Refresh Chart
              </PremiumButton>
            </div>
        </motion.section>

        {/* Search and Filters - with Cuisine filter added */}
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
              
              {/* Cuisine Type Filter */}
              <DarkGlassSelect
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                <option value="all">All Cuisines</option>
                {ALL_CUISINES.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </option>
                ))}
              </DarkGlassSelect>
              
              {searchQuery && (
                <PremiumButton onClick={() => setSearchQuery('')} variant="primary">
                  Clear Search
                </PremiumButton>
              )}
            </div>
            {recipes.length > 0 && (
              <p className="mt-4 text-sm secondary-text">
                Showing {startIndex + 1}-{endIndex} of {totalRecipes.toLocaleString()} recipes
                {searchQuery && ` matching "${searchQuery}"`}
                {(selectedDiet !== 'all' || selectedCuisine !== 'all') && (
                  <span style={{ color: 'rgba(66, 133, 244, 0.8)', marginLeft: '0.5rem' }}>
                    (filtered)
                  </span>
                )}
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
            <h2 className="section-title mb-6">Nutritional Charts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Average Macronutrients by Diet Type (get by insights)" delay={0.1}>
                <BarChart data={insights.average_macronutrients} />
              </ChartCard>
              <ChartCard title="Heatmap of Macronutrient Content by Diet Type" delay={0.2}>
                {charts?.heatmap ? (
                  <img
                    src={charts.heatmap}
                    alt="Heatmap of Macronutrient Content by Diet Type"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="secondary-text">Loading heatmap...</div>
                )}
              </ChartCard>
              <ChartCard title="Average Macronutrients by Diet Type (get by base64 generated charts)" delay={0.3}>
                {charts?.bar_chart ? (
                  <img
                    src={charts.bar_chart}
                    alt="Macronutrients"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="secondary-text">Loading bar chart...</div>
                )}
              </ChartCard>
              <ChartCard title="PTop 5 Protein-Rich Recipes by Cuisine (per Diet Type)" delay={0.4}>
                {charts?.scatter_plot ? (
                  <img
                    src={charts.scatter_plot}
                    alt="Protein vs Carbs Content (Scatter Plot)"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="secondary-text">Loading scatter plot...</div>
                )}
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
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm secondary-text">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <PaginationButton onClick={goToPrevious} disabled={currentPage === 1}>
                    Previous
                  </PaginationButton>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      const showPage =
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(pageNumber - currentPage) <= 1;

                      if (!showPage && pageNumber === currentPage - 2) {
                        return <span key={pageNumber} className="px-2 py-1 secondary-text">...</span>;
                      }

                      if (!showPage && pageNumber === currentPage + 2) {
                        return <span key={pageNumber} className="px-2 py-1 secondary-text">...</span>;
                      }

                      if (!showPage) return null;

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
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="mt-4 secondary-text">Loading nutritional insights...</p>
          </div>
        )}

        {recipes.length === 0 && insights && !loading && (
          <motion.div
            className="text-center py-12 dark-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="secondary-text">No recipes found. Try adjusting your search or filters.</p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="dark-glassmorphic-footer">
        <div className="container mx-auto px-6 py-6 text-center">
          <p className="secondary-text">&copy; 2025 Nutritional Insights Dashboard. Powered by Azure Cloud Services.</p>
        </div>
      </footer>

      <style>{`
        .premium-dark-background {
          background: linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%);
          min-height: 100vh;
        }

        /* Dark Glassmorphic Header - Premium lighter grey */
        .dark-glassmorphic-header {
          background: linear-gradient(135deg, rgba(25, 25, 28, 0.7) 0%, rgba(20, 20, 23, 0.75) 100%);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
        }

        /* Sticky Header Styles */
        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-scrolled {
          background: linear-gradient(135deg, rgba(20, 20, 23, 0.95) 0%, rgba(15, 15, 18, 0.98) 100%);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            inset 0 -1px 0 rgba(0, 0, 0, 0.4);
        }

        .header-content {
          transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-title-container {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-title.title-scrolled {
          font-size: 1.5rem;
          margin-bottom: 0;
        }

        .premium-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          max-height: 30px;
          overflow: hidden;
        }

        .premium-subtitle.subtitle-scrolled {
          opacity: 0;
          max-height: 0;
          margin: 0;
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

          .premium-title.title-scrolled {
            font-size: 1.25rem;
          }
        }

        /* Clerk UserButton Popover Styles */
        .clerk-popover-card {
          background: rgba(20, 20, 22, 0.98) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5) !important;
        }

        .clerk-popover-main {
          background: transparent !important;
        }

        .clerk-popover-actions {
          background: transparent !important;
          padding: 8px !important;
        }

        .clerk-popover-action {
          background: transparent !important;
          border-radius: 10px !important;
          transition: all 0.15s ease !important;
          padding: 10px 12px !important;
          color: rgba(255, 255, 255, 0.85) !important;
        }

        .clerk-popover-action * {
          color: rgba(255, 255, 255, 0.85) !important;
        }

        .clerk-popover-action:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          color: rgba(255, 255, 255, 1) !important;
        }

        .clerk-popover-action:hover * {
          color: rgba(255, 255, 255, 1) !important;
        }

        .clerk-popover-action-text {
          color: rgba(255, 255, 255, 0.85) !important;
        }

        .clerk-popover-action-icon {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        .clerk-popover-action-icon svg {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        .clerk-user-name {
          color: rgba(255, 255, 255, 0.95) !important;
          font-weight: 500 !important;
        }

        .clerk-user-email {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default DashboardPremium;