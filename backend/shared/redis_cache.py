"""
Redis Cache Helper Module
Provides connection and operations for Azure Redis Cache
"""

import os
import redis
import logging

logger = logging.getLogger(__name__)

class RedisCache:
    """
    Redis Cache wrapper for Azure Cache for Redis
    Handles connection, get/set operations with error handling
    """
    
    def __init__(self):
        """
        Initialize Redis connection using environment variables
        Required env vars: REDIS_HOST, REDIS_PASSWORD, REDIS_PORT
        """
        redis_host = os.environ.get("REDIS_HOST")
        redis_password = os.environ.get("REDIS_PASSWORD")
        redis_port = int(os.environ.get("REDIS_PORT", 6380))
        
        if not redis_host or not redis_password:
            raise ValueError("Redis connection info not configured. Set REDIS_HOST and REDIS_PASSWORD.")
        
        logger.info(f"Connecting to Redis: {redis_host}:{redis_port}")
        
        self.client = redis.Redis(
            host=redis_host,
            port=redis_port,
            password=redis_password,
            ssl=True,
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5
        )
        
        # Test connection
        try:
            self.client.ping()
            logger.info("✓ Redis connection successful")
        except Exception as e:
            logger.error(f"✗ Redis connection failed: {e}")
            raise
    
    def get(self, key):
        """
        Get value from Redis by key
        
        Args:
            key (str): Cache key
            
        Returns:
            str or None: Cached value if exists, None if not found or error
        """
        try:
            value = self.client.get(key)
            if value:
                logger.info(f"✓ Cache HIT: {key}")
            else:
                logger.warning(f"✗Cache MISS: {key}")
            return value
        except Exception as e:
            logger.error(f"Redis GET error for key '{key}': {e}")
            return None
    
    def set(self, key, value, ex=None):
        """
        Set value in Redis
        
        Args:
            key (str): Cache key
            value (str): Value to cache
            ex (int, optional): Expiration time in seconds
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            self.client.set(key, value, ex=ex)
            expiry_info = f" (expires in {ex}s)" if ex else " (no expiration)"
            logger.info(f"Cached: {key}{expiry_info}")
            return True
        except Exception as e:
            logger.error(f"Redis SET error for key '{key}': {e}")
            return False
        
     
    def keys(self, pattern="*"):
        """
        Get all keys matching pattern
        
        Args:
            pattern (str): Key pattern (default: "*" for all keys)
            
        Returns:
            list: List of matching keys
        """
        try:
            return self.client.keys(pattern)
        except Exception as e:
            logger.error(f"Redis KEYS error for pattern '{pattern}': {e}")
            return []
        
    # Note:
    # The following methods are not currently used but are provided for completeness.
    # Keep them here for potential future use.
    def delete(self, key):
        """
        Delete key from Redis
        
        Args:
            key (str): Cache key to delete
            
        Returns:
            bool: True if deleted, False otherwise
        """
        try:
            result = self.client.delete(key)
            logger.info(f"Deleted: {key} (result: {result})")
            return result > 0
        except Exception as e:
            logger.error(f"Redis DELETE error for key '{key}': {e}")
            return False
        
    def exists(self, key):
        """
        Check if key exists in Redis
        
        Args:
            key (str): Cache key
            
        Returns:
            bool: True if exists, False otherwise
        """
        try:
            return self.client.exists(key) > 0
        except Exception as e:
            logger.error(f"Redis EXISTS error for key '{key}': {e}")
            return False
   
    def flush_all(self):
        """
        Clear all keys in Redis (use with caution!)
        
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            self.client.flushall()
            logger.warning("Redis FLUSHALL executed - all cache cleared!")
            return True
        except Exception as e:
            logger.error(f"Redis FLUSHALL error: {e}")
            return False
