/**
 * Middleware Index
 * Exports all middleware for easy import
 */

const { authenticateJWT } = require('./authMiddleware');
const { checkRole } = require('./authorizationMiddleware');
const { cacheMiddleware, redisClient } = require('./cacheMiddleware');
const { createCircuitBreakerProxy } = require('./circuitBreakerMiddleware');
const { notFoundHandler, errorHandler } = require('./errorMiddleware');
const { 
  logger, 
  requestTracingMiddleware, 
  requestLoggingMiddleware,
  errorLoggingMiddleware 
} = require('./loggingMiddleware');
const { validateRequest } = require('./validationMiddleware');
const { 
  securityHeadersMiddleware, 
  rateLimitMiddleware, 
  corsMiddleware 
} = require('./securityMiddleware');

module.exports = {
  // Authentication
  authenticateJWT,
  checkRole,
  
  // Caching
  cacheMiddleware,
  redisClient,
  
  // Circuit Breaker
  createCircuitBreakerProxy,
  
  // Error Handling
  notFoundHandler,
  errorHandler,
  
  // Logging
  logger,
  requestTracingMiddleware,
  requestLoggingMiddleware,
  errorLoggingMiddleware,
  
  // Validation
  validateRequest,
  
  // Security
  securityHeadersMiddleware,
  rateLimitMiddleware,
  corsMiddleware
};
