/**
 * API Routes
 * Configures all routes for the API Gateway
 */

const express = require('express');
const { 
  authenticateJWT, 
  cacheMiddleware, 
  createCircuitBreakerProxy 
} = require('../middlewares');
const authRoutes = require('./authRoutes');
const roleRoutes = require('./roleRoutes');
const permissionRoutes = require('./permissionRoutes');
const userRoleRoutes = require('./userRoleRoutes');

/**
 * Configure API routes for the gateway
 * @param {Object} app - Express application instance
 */
const configureRoutes = (app) => {
  // API versioning with URL-based approach
  // v1 API routes
  const v1Router = express.Router();

  // Auth Service - Direct proxy
  v1Router.use('/auth', cacheMiddleware, createCircuitBreakerProxy(
    process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    { '^/auth': '/api' }
  ));
  
  // Auth Service - Specific routes
  v1Router.use('/auth/roles', roleRoutes);
  v1Router.use('/auth/permissions', permissionRoutes);
  v1Router.use('/auth/user-roles', userRoleRoutes);

  // Core Service
  v1Router.use('/core', authenticateJWT, cacheMiddleware, createCircuitBreakerProxy(
    process.env.CORE_SERVICE_URL || 'http://localhost:3002',
    { '^/core': '/api' }
  ));

  // Operations Service
  v1Router.use('/operations', authenticateJWT, cacheMiddleware, createCircuitBreakerProxy(
    process.env.OPERATIONS_SERVICE_URL || 'http://localhost:3003',
    { '^/operations': '/api' }
  ));

  // Finance Service
  v1Router.use('/finance', authenticateJWT, cacheMiddleware, createCircuitBreakerProxy(
    process.env.FINANCE_SERVICE_URL || 'http://localhost:3004',
    { '^/finance': '/api' }
  ));

  // Notification Service
  v1Router.use('/notifications', authenticateJWT, cacheMiddleware, createCircuitBreakerProxy(
    process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
    { '^/notifications': '/api' }
  ));

  // Reporting Service
  v1Router.use('/reports', authenticateJWT, cacheMiddleware, createCircuitBreakerProxy(
    process.env.REPORTING_SERVICE_URL || 'http://localhost:3006',
    { '^/reports': '/api' }
  ));

  // Mount v1 API routes
  app.use('/api/v1', v1Router);

  // For backward compatibility, also mount routes at /api
  // Auth Service
  app.use('/api/auth', cacheMiddleware, createCircuitBreakerProxy(
    process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    { '^/api/auth': '/api' }
  ));

  // Core Service
  app.use('/api/core', authenticateJWT, cacheMiddleware, createCircuitBreakerProxy(
    process.env.CORE_SERVICE_URL || 'http://localhost:3002',
    { '^/api/core': '/api' }
  ));

  // Operations Service
  app.use('/api/operations', authenticateJWT, cacheMiddleware, createCircuitBreakerProxy(
    process.env.OPERATIONS_SERVICE_URL || 'http://localhost:3003',
    { '^/api/operations': '/api' }
  ));

  // Finance Service
  app.use('/api/finance', authenticateJWT, cacheMiddleware, createCircuitBreakerProxy(
    process.env.FINANCE_SERVICE_URL || 'http://localhost:3004',
    { '^/api/finance': '/api' }
  ));

  // Notification Service
  app.use('/api/notifications', authenticateJWT, cacheMiddleware, createCircuitBreakerProxy(
    process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
    { '^/api/notifications': '/api' }
  ));

  // Reporting Service
  app.use('/api/reports', authenticateJWT, cacheMiddleware, createCircuitBreakerProxy(
    process.env.REPORTING_SERVICE_URL || 'http://localhost:3006',
    { '^/api/reports': '/api' }
  ));
};

module.exports = {
  configureRoutes
};
