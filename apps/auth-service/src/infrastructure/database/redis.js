/**
 * Redis Client
 * Configures and manages Redis connection for caching and session management
 */

const Redis = require('ioredis');
const config = require('../../config');
const { logger } = require('../../utils');

// Initialize Redis client
let redisClient = null;

/**
 * Connect to Redis
 * @returns {Promise<Redis>} - Returns Redis client
 */
const connectToRedis = async () => {
  try {
    // Create Redis client
    if (config.redis.url) {
      // Connect using URL if provided
      redisClient = new Redis(config.redis.url, {
        keyPrefix: config.redis.keyPrefix
      });
    } else {
      // Connect using individual options
      redisClient = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password || undefined,
        keyPrefix: config.redis.keyPrefix
      });
    }
    
    // Make client globally available
    global.redisClient = redisClient;
    
    // Handle Redis events
    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err);
    });
    
    redisClient.on('connect', () => {
      logger.info('Connected to Redis');
    });
    
    redisClient.on('reconnecting', () => {
      logger.warn('Redis client reconnecting');
    });
    
    redisClient.on('end', () => {
      logger.warn('Redis client disconnected');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await disconnectRedis();
      logger.info('Redis connection closed due to application termination');
    });
    
    return redisClient;
  } catch (error) {
    logger.error('Redis connection error:', error);
    throw error;
  }
};

/**
 * Disconnect from Redis
 * @returns {Promise<void>}
 */
const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    global.redisClient = null;
    logger.info('Disconnected from Redis');
  }
};

/**
 * Get Redis client
 * @returns {Redis} - Returns Redis client
 */
const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  
  return redisClient;
};

/**
 * Set key-value pair in Redis with expiration
 * @param {string} key - Redis key
 * @param {string|Object} value - Redis value (will be stringified if object)
 * @param {number} expireSeconds - Expiration time in seconds
 * @returns {Promise<string>} - Returns Redis response
 */
const setCache = async (key, value, expireSeconds = 3600) => {
  try {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    return await redisClient.set(key, stringValue, 'EX', expireSeconds);
  } catch (error) {
    logger.error(`Redis set error for key ${key}:`, error);
    throw error;
  }
};

/**
 * Get value by key from Redis
 * @param {string} key - Redis key
 * @param {boolean} parseJson - Whether to parse the result as JSON
 * @returns {Promise<string|Object>} - Returns Redis value
 */
const getCache = async (key, parseJson = false) => {
  try {
    const result = await redisClient.get(key);
    
    if (result && parseJson) {
      try {
        return JSON.parse(result);
      } catch (e) {
        return result;
      }
    }
    
    return result;
  } catch (error) {
    logger.error(`Redis get error for key ${key}:`, error);
    throw error;
  }
};

/**
 * Delete key from Redis
 * @param {string} key - Redis key
 * @returns {Promise<number>} - Returns number of keys deleted
 */
const deleteCache = async (key) => {
  try {
    return await redisClient.del(key);
  } catch (error) {
    logger.error(`Redis del error for key ${key}:`, error);
    throw error;
  }
};

/**
 * Check if key exists in Redis
 * @param {string} key - Redis key
 * @returns {Promise<boolean>} - Returns true if key exists
 */
const existsInCache = async (key) => {
  try {
    const result = await redisClient.exists(key);
    return result === 1;
  } catch (error) {
    logger.error(`Redis exists error for key ${key}:`, error);
    throw error;
  }
};

/**
 * Add token to blacklist
 * @param {string} token - Token to blacklist
 * @param {number} expireSeconds - Expiration time in seconds
 * @returns {Promise<string>} - Returns Redis response
 */
const blacklistToken = async (token, expireSeconds = config.security.tokenBlacklistExpiry) => {
  return await setCache(`blacklist:${token}`, '1', expireSeconds);
};

/**
 * Check if token is blacklisted
 * @param {string} token - Token to check
 * @returns {Promise<boolean>} - Returns true if token is blacklisted
 */
const isTokenBlacklisted = async (token) => {
  return await existsInCache(`blacklist:${token}`);
};

/**
 * Store user session
 * @param {string} sessionId - Session ID
 * @param {Object} sessionData - Session data
 * @param {number} expireSeconds - Expiration time in seconds
 * @returns {Promise<string>} - Returns Redis response
 */
const storeSession = async (sessionId, sessionData, expireSeconds = 604800) => { // 7 days
  return await setCache(`session:${sessionId}`, sessionData, expireSeconds);
};

/**
 * Get user session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Returns session data
 */
const getSession = async (sessionId) => {
  return await getCache(`session:${sessionId}`, true);
};

/**
 * Delete user session
 * @param {string} sessionId - Session ID
 * @returns {Promise<number>} - Returns number of sessions deleted
 */
const deleteSession = async (sessionId) => {
  return await deleteCache(`session:${sessionId}`);
};

/**
 * Delete all sessions for a user
 * @param {string} userId - User ID
 * @param {string} excludeSessionId - Session ID to exclude
 * @returns {Promise<number>} - Returns number of sessions deleted
 */
const deleteUserSessions = async (userId, excludeSessionId = null) => {
  try {
    // Get all sessions for user
    const sessionKeys = await redisClient.keys(`session:*`);
    let deletedCount = 0;
    
    // Check each session
    for (const key of sessionKeys) {
      const sessionData = await getCache(key.replace(config.redis.keyPrefix, ''), true);
      
      if (sessionData && sessionData.userId === userId) {
        const sessionId = key.split(':')[1];
        
        // Skip excluded session
        if (excludeSessionId && sessionId === excludeSessionId) {
          continue;
        }
        
        await deleteCache(`session:${sessionId}`);
        deletedCount++;
      }
    }
    
    return deletedCount;
  } catch (error) {
    logger.error(`Redis delete user sessions error for user ${userId}:`, error);
    throw error;
  }
};

module.exports = {
  connectToRedis,
  disconnectRedis,
  getRedisClient,
  setCache,
  getCache,
  deleteCache,
  existsInCache,
  blacklistToken,
  isTokenBlacklisted,
  storeSession,
  getSession,
  deleteSession,
  deleteUserSessions
};
