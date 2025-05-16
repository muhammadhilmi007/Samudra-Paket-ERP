/**
 * Cache Middleware
 * Implements Redis-based caching for API responses
 */

const redis = require('redis');
const winston = require('winston');

// Initialize Redis client for caching
let redisClient;
(async () => {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  redisClient.on('error', (err) => {
    winston.error('Redis client error:', err);
  });
  
  await redisClient.connect().catch(err => {
    winston.error('Redis connection error:', err);
  });
})();

/**
 * Middleware to cache API responses in Redis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const cacheMiddleware = async (req, res, next) => {
  // Skip caching for non-GET requests
  if (req.method !== 'GET') {
    return next();
  }
  
  const cacheKey = `cache:${req.originalUrl}`;
  
  try {
    const cachedResponse = await redisClient.get(cacheKey);
    
    if (cachedResponse) {
      const data = JSON.parse(cachedResponse);
      return res.status(200).json(data);
    }
    
    // Store the original send method
    const originalSend = res.send;
    
    // Override the send method to cache the response
    res.send = function(body) {
      // Only cache successful responses
      if (res.statusCode === 200) {
        // Cache for 5 minutes (300 seconds)
        redisClient.set(cacheKey, body, { EX: 300 }).catch(err => {
          winston.error('Redis cache error:', err);
        });
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

module.exports = {
  cacheMiddleware,
  redisClient
};
