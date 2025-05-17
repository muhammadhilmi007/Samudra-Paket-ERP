/**
 * Middlewares Index
 * Exports all middlewares
 */

const { validate } = require('./validationMiddleware');
const { authenticateJWT, hasRole } = require('./authMiddleware');
const { loginRateLimiter, passwordResetRateLimiter, registrationRateLimiter, apiRateLimiter } = require('./rateLimitMiddleware');
const { notFoundHandler, errorHandler } = require('./errorMiddleware');
const requestTracing = require('./requestTracingMiddleware');
const { 
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireResourceOwnership,
  requirePermissionOrOwnership
} = require('./permissionMiddleware');

module.exports = {
  validate,
  authenticateJWT,
  hasRole,
  loginRateLimiter,
  passwordResetRateLimiter,
  registrationRateLimiter,
  apiRateLimiter,
  notFoundHandler,
  errorHandler,
  requestTracing,
  // Permission middleware
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireResourceOwnership,
  requirePermissionOrOwnership
};
