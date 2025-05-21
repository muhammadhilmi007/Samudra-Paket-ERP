/**
 * Cache Middleware
 * Implements Redis-based caching for API responses
 */

const redis = require('redis');
const winston = require('winston');

// Initialize Redis client for caching
let redisClient;
let redisConnected = false;

// Create Redis client with connection handling
try {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://default:KpJvwiHgufgzaiZEYCyNAgSRjiJJXgQE@yamabiko.proxy.rlwy.net:59026'
  });
  
  redisClient.on('error', (err) => {
    winston.error('Redis client error:', err);
    redisConnected = false;
  });
  
  redisClient.on('connect', () => {
    winston.info('Redis client connected');
    redisConnected = true;
  });
  
  // Connect in the background but don't block startup
  redisClient.connect().catch(err => {
    winston.error('Redis connection error:', err);
    // Continue without Redis if connection fails
  });
} catch (error) {
  winston.error('Redis client initialization error:', error);
  // Create a dummy client to avoid null references
  redisClient = {
    get: async () => null,
    set: async () => {},
    isReady: false
  };
}

/**
 * Middleware factory to cache API responses in Redis
 * @param {Object} options - Cache options
 * @returns {Function} Express middleware function
 */
const cacheMiddleware = (options = {}) => {
  return async (req, res, next) => {
  // Skip caching for non-GET requests
  if (req.method !== 'GET') {
    return next();
  }
  
  try {
    // Skip if Redis is not connected
    if (!redisConnected || !redisClient.isReady) {
      return next();
    }
    
    // Create cache key from request URL and any query parameters
    const cacheKey = `api:${req.originalUrl}`;
    
    // Try to get cached response
    const cachedResponse = await redisClient.get(cacheKey);
    
    if (cachedResponse) {
      // Parse cached response
      const response = JSON.parse(cachedResponse);
      
      // Send cached response
      return res.status(200).json(response);
    }
    
    // Store the original send method
    const originalSend = res.send;
    
    // Override the send method to cache the response
    res.send = function (body) {
      // Only cache JSON responses and if Redis is connected
      if (redisConnected && redisClient.isReady && res.getHeader('content-type')?.includes('application/json')) {
        try {
          // Get cache TTL from options or use default
          const cacheTTL = options.ttl || 300; // Default: 5 minutes
          
          // Store the response in Redis
          redisClient.set(
            cacheKey,
            typeof body === 'string' ? body : JSON.stringify(body),
            {
              EX: cacheTTL
            }
          ).catch(err => {
            winston.error('Error storing cache:', err);
          });
        } catch (error) {
          winston.error('Error caching response:', error);
          // Continue without caching if there's an error
        }
      }
      
      // Call the original send method
      originalSend.call(this, body);
    };
    
    next();
  } catch (error) {
    winston.error('Cache middleware error:', error);
    next();
  }
  };
};

module.exports = {
  cacheMiddleware,
  redisClient
};
