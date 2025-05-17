/**
 * Redis Configuration
 * Configures Redis client for caching
 */

const Redis = require('ioredis');
const config = require('./index');

// Simple console logger to avoid circular dependency
const consoleLogger = {
  info: (message) => console.info(`[Redis] ${message}`),
  error: (message) => console.error(`[Redis] ${message}`),
  warn: (message) => console.warn(`[Redis] ${message}`),
  debug: (message) => console.debug(`[Redis] ${message}`)
};

let redisClient = null;

/**
 * Initialize Redis client
 * @returns {Object} Redis client instance
 */
const initRedisClient = () => {
  try {
    const client = new Redis({
      host: config.redis.host || 'localhost',
      port: config.redis.port || 6379,
      password: config.redis.password || '',
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    client.on('connect', () => {
      consoleLogger.info('Redis client connected successfully');
    });

    client.on('error', (err) => {
      consoleLogger.error(`Redis client error: ${err.message}`);
    });

    return client;
  } catch (error) {
    consoleLogger.error(`Failed to initialize Redis client: ${error.message}`);
    return null;
  }
};

/**
 * Get Redis client instance
 * @returns {Object} Redis client instance
 */
const getRedisClient = () => {
  if (!redisClient) {
    redisClient = initRedisClient();
  }
  return redisClient;
};

module.exports = {
  getRedisClient
};
