/**
 * Rate Limit Middleware
 * Implements rate limiting for security
 */

const rateLimit = require('express-rate-limit');
const { securityLogRepository } = require('../../infrastructure/repositories');

/**
 * Create a rate limiter for login attempts
 * @returns {Function} - Express middleware
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
  handler: async (req, res, next, options) => {
    // Log rate limit exceeded
    try {
      await securityLogRepository.createLog({
        eventType: 'LOGIN_FAILURE',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { reason: 'Rate limit exceeded' },
        status: 'FAILURE'
      });
    } catch (error) {
      console.error('Error logging rate limit:', error);
    }
    
    res.status(429).json({
      status: 'error',
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many login attempts. Please try again later.'
    });
  }
});

/**
 * Create a rate limiter for password reset requests
 * @returns {Function} - Express middleware
 */
const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(429).json({
      status: 'error',
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many password reset requests. Please try again later.'
    });
  }
});

/**
 * Create a rate limiter for registration
 * @returns {Function} - Express middleware
 */
const registrationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(429).json({
      status: 'error',
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many registration attempts. Please try again later.'
    });
  }
});

/**
 * Create a general API rate limiter
 * @returns {Function} - Express middleware
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(429).json({
      status: 'error',
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests. Please try again later.'
    });
  }
});

module.exports = {
  loginRateLimiter,
  passwordResetRateLimiter,
  registrationRateLimiter,
  apiRateLimiter
};
