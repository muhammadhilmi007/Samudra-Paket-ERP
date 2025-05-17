/**
 * Middlewares Index
 * Exports all middlewares
 */

const { validate } = require('./validationMiddleware');
const { authenticateJWT, hasRole, hasPermission } = require('./authMiddleware');
const { loginRateLimiter, passwordResetRateLimiter, registrationRateLimiter, apiRateLimiter } = require('./rateLimitMiddleware');
const { notFoundHandler, errorHandler } = require('./errorMiddleware');
const requestTracing = require('./requestTracingMiddleware');

module.exports = {
  validate,
  authenticateJWT,
  hasRole,
  hasPermission,
  loginRateLimiter,
  passwordResetRateLimiter,
  registrationRateLimiter,
  apiRateLimiter,
  notFoundHandler,
  errorHandler,
  requestTracing
};
