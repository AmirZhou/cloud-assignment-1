"""
Azure Function: Nutritional Insights API with Redis Caching
Four main endpoints (all using pre-computed results from Redis):
1. /api/get-charts - Get visualizations (from cache)
2. /api/get-insights - Get analysis results (from cache)
3. /api/get-recipes - Get recipes with filters and pagination (from cache)
4. /api/health - Health check endpoint

PHASE 3 OPTIMIZATION:
- Data cleaning happens ONCE in BlobTrigger function
- All calculations happen ONCE in BlobTrigger function
- API endpoints just READ from Redis cache (super fast!)
"""

import azure.functions as func
import json
import time
import logging
from datetime import datetime, timezone

# Import shared modules
from shared.redis_cache import RedisCache

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    Main entry point - routes requests to appropriate handler
    
    Supported routes:
    - GET /api/health → Health check endpoint
    - GET /api/get-charts → Returns charts from cache
    - GET /api/get-insights → Returns insights from cache
    - GET /api/get-recipes → Returns recipes from cache (with filters & pagination)
    """
    
    # Get the action from route parameters
    action = req.route_params.get('action', '').lower()
    
    logging.info(f"Request received for action: {action}")
    
    try:
        if action == 'health':
            return get_health(req)
    
        elif action == 'get-charts':
            return get_charts(req)
        
        elif action == 'get-insights':
            return get_insights(req)
        
        elif action == 'get-recipes':
            return get_recipes(req)
        
        else:
            return error_response(
                f"Unknown action: {action}. Valid actions: health, get-charts, get-insights, get-recipes",
                404
            )
    
    except Exception as e:
        logging.error(f"Error: {str(e)}", exc_info=True)
        return error_response(str(e), 500)

# ===== HANDLER 0: Health Check =====
def get_health(req: func.HttpRequest) -> func.HttpResponse:
    """
    Health check endpoint
    Checks Redis connectivity and cache status
    """
    
    start_time = time.time()
    logging.info("Health check requested")
    
    try:
        # Check Redis connectivity
        logging.info("  - Checking Redis connection...")
        try:
            redis = RedisCache()
            redis_status = "connected"
            
            # Check if data has been processed
            metadata_json = redis.get("metadata")
            if metadata_json:
                metadata = json.loads(metadata_json)
                cache_info = {
                    "last_processed": metadata.get("last_processed"),
                    "total_recipes": metadata.get("total_recipes"),
                    "diet_types": metadata.get("diet_types_count")
                }
            else:
                cache_info = "No data processed yet - upload All_Diets.csv to trigger processing"
            
            logging.info(f"    ✓ Redis connected - Cache info: {cache_info}")
        except Exception as e:
            redis_status = "error"
            cache_info = str(e)
            logging.warning(f"    ✗ Redis error: {str(e)}")
        
        # Build response
        execution_time = time.time() - start_time
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        response_data = {
            "status": "healthy" if redis_status == "connected" else "degraded",
            "service": "Nutritional Insights API",
            "version": "2.0.0-redis",
            "timestamp": timestamp,
            "checks": {
                "redis_cache": redis_status,
                "cache_data": cache_info
            },
            "execution_time": f"{execution_time:.2f}s"
        }
        
        status_code = 200 if redis_status == "connected" else 503
        logging.info(f"Health check complete. Status: {response_data['status']}")
        
        return func.HttpResponse(
            json.dumps(response_data, ensure_ascii=False),
            status_code=status_code,
            mimetype="application/json; charset=utf-8",
        )
    
    except Exception as e:
        logging.error(f"✗ Health check failed: {str(e)}", exc_info=True)
        
        error_data = {
            "status": "unhealthy",
            "service": "Nutritional Insights API",
            "version": "2.0.0-redis",
            "timestamp": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            "error": str(e)
        }
        
        return func.HttpResponse(
            json.dumps(error_data, ensure_ascii=False),
            status_code=503,
            mimetype="application/json; charset=utf-8",
        )

# ===== HANDLER 1: Get Charts (FROM CACHE) =====
def get_charts(req: func.HttpRequest) -> func.HttpResponse:
    """
    Get pre-generated charts from Redis cache
    NO data cleaning, NO calculations - just read from cache!
    
    Returns: Base64 encoded PNG images
    """
    
    start_time = time.time()
    logging.info("Getting charts from Redis cache...")
    
    try:
        redis = RedisCache()
        
        # Read pre-generated charts from Redis
        logging.info("  - Reading bar chart from cache...")
        bar_chart = redis.get("charts:bar_chart")
        
        logging.info("  - Reading heatmap from cache...")
        heatmap = redis.get("charts:heatmap")
        
        logging.info("  - Reading scatter plot from cache...")
        scatter_plot = redis.get("charts:scatter_plot")
        
        # Check if all charts are available
        if not all([bar_chart, heatmap, scatter_plot]):
            logging.warning("Charts not found in cache !")
            return error_response(
                "Charts not ready. Please wait for data processing to complete. "
                "Upload All_Diets.csv to trigger processing.",
                503
            )
        
        # Get metadata for additional info
        metadata_json = redis.get("metadata")
        metadata = json.loads(metadata_json) if metadata_json else {}
        
        execution_time = time.time() - start_time
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        response_data = {
            "status": "success",
            "data": {
                "bar_chart": f"data:image/png;base64,{bar_chart}",
                "heatmap": f"data:image/png;base64,{heatmap}",
                "scatter_plot": f"data:image/png;base64,{scatter_plot}"
            },
            "api_performance": {
                "api_response_time_sec": round(execution_time, 2),
                "timestamp": timestamp,
                "cached": True,
                "operations": "Read from Redis cache only"
            },
            "blob_trigger_performance": {
                "last_processed": metadata.get("last_processed", "Unknown"),
                "step_times": metadata.get("step_times", {}),
                "total_recipes_processed": metadata.get("total_recipes", 0)
            },
            "performance_comparison": {
                "api_vs_blob_speedup": f"{round(metadata.get('step_times', {}).get('total_processing_sec', 1) / max(execution_time, 0.01), 1)}x faster",
                "note": "API reads pre-computed results from cache, BlobTrigger does all heavy processing"
            },
            "message": "Charts retrieved from cache (NO re-processing!)"
        }
        
        
        logging.info(f"⚡ Charts ready in {execution_time:.2f}s (from cache)")
        logging.info(f"  ✓  NO data cleaning performed")
        logging.info(f"  ✓  NO calculations performed")
        logging.info(f"  ✓  All data read from Redis cache")
        
        return success_response(response_data)
        
    except Exception as e:
        logging.error(f"✗ Error retrieving charts: {str(e)}", exc_info=True)
        return error_response(f"Failed to retrieve charts: {str(e)}", 500)


# ===== HANDLER 2: Get Insights (FROM CACHE) =====
def get_insights(req: func.HttpRequest) -> func.HttpResponse:
    """
    Get pre-calculated insights from Redis cache
    NO data cleaning, NO calculations - just read from cache!
    
    Returns: Analysis data, statistics, findings
    """
    
    start_time = time.time()
    logging.info("Getting insights from Redis cache...")
    
    try:
        redis = RedisCache()
        
        # Read pre-calculated insights from Redis
        logging.info("  - Reading insights from cache...")
        insights_json = redis.get("insights:summary")
        
        logging.info("  - Reading metadata from cache...")
        metadata_json = redis.get("metadata")
        
        if not insights_json:
            logging.warning("Insights not found in cache !")
            return error_response(
                "Insights not ready. Please wait for data processing to complete. "
                "Upload All_Diets.csv to trigger processing.",
                503
            )
        
        insights = json.loads(insights_json)
        metadata = json.loads(metadata_json) if metadata_json else {}
        
        execution_time = time.time() - start_time
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        response_data = {
            "status": "success",
            "data": {
                "insights": insights,
                "data_stats": {
                    "total_recipes": metadata.get("total_recipes", 0),
                    "diet_types": metadata.get("diet_types_count", 0),
                    "cuisines": metadata.get("cuisines_count", 0)
                }
            },
            "api_performance": {
                "api_response_time_sec": round(execution_time, 2),
                "timestamp": timestamp,
                "cached": True,
                "operations": "Read from Redis cache only"
            },
            "blob_trigger_performance": {
                "last_processed": metadata.get("last_processed", "Unknown"),
                "step_times": metadata.get("step_times", {}),
                "total_recipes_processed": metadata.get("total_recipes", 0)
            },
            "performance_comparison": {
                "api_vs_blob_speedup": f"{round(metadata.get('step_times', {}).get('total_processing_sec', 1) / max(execution_time, 0.01), 1)}x faster",
                "note": "API reads pre-computed results from cache, BlobTrigger does all heavy processing"
            },
            "message": "Insights retrieved from cache (NO re-processing!)"
        }
        
        logging.info(f"Insights ready in {execution_time:.2f}s (from cache)")
        logging.info(f"  ✓  NO data cleaning performed")
        logging.info(f"  ✓  NO calculations performed")
        logging.info(f"  ✓  All data read from Redis cache")
        
        return success_response(response_data)
        
    except Exception as e:
        logging.error(f"✗ Error retrieving insights: {str(e)}", exc_info=True)
        return error_response(f"Failed to retrieve insights: {str(e)}", 500)


# ===== HANDLER 3: Get Recipes (FROM CACHE + PAGINATION + KEYWORD SEARCH) =====
def get_recipes(req: func.HttpRequest) -> func.HttpResponse:
    """
    Get recipes from Redis cache with filtering, keyword search, and pagination
    NO data cleaning - just read pre-filtered results from cache!
    
    Query parameters:
      - diet_type: Filter by diet (e.g., ?diet_type=keto)
      - cuisine_type: Filter by cuisine (e.g., ?cuisine_type=middle eastern)
      - keyword: Search in recipe names (e.g., ?keyword=chicken)
      - page: Page number (default: 1)
      - page_size: Items per page (default: 20)
    """
    
    start_time = time.time()
    logging.info("Getting recipes from Redis cache...")
    
    try:
        redis = RedisCache()
        
        # Parse query parameters
        diet_type = req.params.get('diet_type')
        cuisine_type = req.params.get('cuisine_type')
        keyword = req.params.get('keyword')
        page = int(req.params.get('page', 1))
        page_size = int(req.params.get('page_size', 20))  
        
        # Determine cache key based on filters
        if diet_type and cuisine_type:
            cache_key = f"recipes:diet:{diet_type}:cuisine:{cuisine_type}"
            filter_info = f"diet_type={diet_type}, cuisine_type={cuisine_type}"
        elif diet_type:
            cache_key = f"recipes:diet:{diet_type}"
            filter_info = f"diet_type={diet_type}"
        elif cuisine_type:
            cache_key = f"recipes:cuisine:{cuisine_type}"
            filter_info = f"cuisine_type={cuisine_type}"
        else:
            cache_key = "recipes:all"
            filter_info = "no filter (all recipes)"
        
        # Add keyword to filter info
        if keyword:
            filter_info += f", keyword='{keyword}'"
        
        logging.info(f"  - Fetching: {filter_info}")
        logging.info(f"  - Cache key: {cache_key}")
        
        # Read from Redis cache
        recipes_json = redis.get(cache_key)
        
        if not recipes_json:
            # Cache miss - check if it's because data hasn't been processed
            all_recipes = redis.get("recipes:all")
            if not all_recipes:
                logging.warning("✗ No recipes in cache - data not processed yet!")
                return error_response(
                    "Recipes not ready. Upload All_Diets.csv to trigger processing.",
                    503
                )
            
            # No recipes found for given filters
            if diet_type and cuisine_type:
                logging.warning(f"✗ No recipes found for {diet_type} + {cuisine_type}")
                return error_response(
                    f"No recipes found for the combination: {diet_type} + {cuisine_type}.",
                    404
                )
            
            # Invalid filter value
            logging.warning(f"✗ Cache miss for '{cache_key}' - invalid filter!")
            return error_response(
                f"No recipes found for {filter_info}. Check if the value is correct.",
                404
            )
        
        recipes_list = json.loads(recipes_json)
        logging.info(f"  ✓ Found {len(recipes_list)} recipes in cache")
        
        # ===== KEYWORD SEARCH (if provided) =====
        if keyword:
            keyword_lower = keyword.lower()
            original_count = len(recipes_list)
            
            # Filter recipes by keyword in recipe name
            recipes_list = [
                recipe for recipe in recipes_list
                if keyword_lower in recipe.get('recipe_name', '').lower()
            ]
            
            filtered_count = len(recipes_list)
            logging.info(f"Keyword search '{keyword}': {original_count} → {filtered_count} recipes")
            
            if filtered_count == 0:
                logging.warning(f"✗ No recipes found matching keyword '{keyword}'")
                return error_response(
                    f"No recipes found matching keyword '{keyword}' in the selected category.",
                    404
                )
        
        # Implement pagination
        total_count = len(recipes_list)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_recipes = recipes_list[start_idx:end_idx]
        
        logging.info(f"  - Pagination: page {page}, showing {len(paginated_recipes)} items")
        
        # Get metadata
        metadata_json = redis.get("metadata")
        metadata = json.loads(metadata_json) if metadata_json else {}
        
        execution_time = time.time() - start_time
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        response_data = {
            "status": "success",
            "data": {
                "recipes": paginated_recipes,
                "pagination": {
                    "page": page,
                    "page_size": page_size,
                    "total_count": total_count,
                    "total_pages": (total_count + page_size - 1) // page_size,
                    "has_next": end_idx < total_count,
                    "has_prev": page > 1
                },
                "filter_applied": {
                    "diet_type": diet_type,
                    "cuisine_type": cuisine_type,
                    "keyword": keyword
                }
            },
            "api_performance": {
                "api_response_time_sec": round(execution_time, 2),
                "timestamp": timestamp,
                "cached": True,
                "operations": "Read from cache + keyword search" if keyword else "Read from cache only"
            },
            "blob_trigger_performance": {
                "last_processed": metadata.get("last_processed", "Unknown"),
                "step_times": metadata.get("step_times", {}),
                "total_recipes_processed": metadata.get("total_recipes", 0),
                "diet_types_cached": metadata.get("diet_types_count", 0),
                "cuisines_cached": metadata.get("cuisines_count", 0)
            },
            "performance_comparison": {
                "api_vs_blob_speedup": f"{round(metadata.get('step_times', {}).get('total_processing_sec', 1) / max(execution_time, 0.01), 1)}x faster",
                "note": "API reads pre-filtered results from cache, BlobTrigger pre-processes all filters"
            },
            "message": f"Recipes retrieved from cache for {filter_info}"
        }
        
        logging.info(f"Recipes ready in {execution_time:.2f}s (from cache)")
        logging.info(f"  ✓  NO data cleaning performed")
        logging.info(f"  ✓  NO filtering performed (pre-cached)")
        if keyword:
            logging.info(f"Keyword search performed on cached data")
        logging.info(f"  ✓  All data read from Redis cache")
        
        return success_response(response_data)
        
    except Exception as e:
        logging.error(f"✗ Error retrieving recipes: {str(e)}", exc_info=True)
        return error_response(f"Failed to retrieve recipes: {str(e)}", 500)


# ===== UTILITY FUNCTIONS =====
def success_response(data):
    """Helper function to return successful HTTP response"""
    return func.HttpResponse(
        json.dumps(data, ensure_ascii=False),
        status_code=200,
        mimetype="application/json; charset=utf-8",
    )


def error_response(message, status_code):
    """Helper function to return error HTTP response"""
    return func.HttpResponse(
        json.dumps({
            "status": "error",
            "message": message,
            "timestamp": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        }, ensure_ascii=False),
        status_code=status_code,
        mimetype="application/json; charset=utf-8",
    )
