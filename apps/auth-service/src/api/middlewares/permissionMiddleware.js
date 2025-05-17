/**
 * Permission Middleware
 * Middleware for checking permissions on API routes
 */

const { hasPermission, hasAnyPermission, hasAllPermissions, ownsResource } = require('../../application/services/permissionService');
const { errorResponse } = require('../../utils');
const logger = require('../../utils/logger');

/**
 * Middleware to check if user has a specific permission
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @returns {Function} - Express middleware
 */
const requirePermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      // User ID should be set by authenticateJWT middleware
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json(errorResponse('UNAUTHORIZED', 'Authentication required'));
      }
      
      // Build context for conditional permissions
      const context = {
        // Include request parameters that might be relevant for permission checking
        params: req.params,
        // Check if user is accessing their own resource
        ownResource: req.params.id && req.params.id === userId
      };
      
      // Check permission
      const hasAccess = await hasPermission(userId, resource, action, context);
      
      if (hasAccess) {
        return next();
      }
      
      // Log unauthorized access attempt
      logger.warn(`Permission denied: ${userId} attempted to ${action} ${resource}`, {
        userId,
        resource,
        action,
        path: req.path,
        method: req.method
      });
      
      return res.status(403).json(errorResponse('FORBIDDEN', 'Insufficient permissions'));
    } catch (error) {
      logger.error(`Error in permission middleware: ${error.message}`, { error });
      return res.status(500).json(errorResponse('SERVER_ERROR', 'Internal server error'));
    }
  };
};

/**
 * Middleware to check if user has any of the specified permissions
 * @param {Array<Object>} permissions - Array of permission objects with resource and action
 * @returns {Function} - Express middleware
 */
const requireAnyPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      // User ID should be set by authenticateJWT middleware
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json(errorResponse('UNAUTHORIZED', 'Authentication required'));
      }
      
      // Build context for conditional permissions
      const context = {
        params: req.params,
        ownResource: req.params.id && req.params.id === userId
      };
      
      // Check if user has any of the permissions
      const hasAccess = await hasAnyPermission(userId, permissions, context);
      
      if (hasAccess) {
        return next();
      }
      
      // Log unauthorized access attempt
      logger.warn(`Permission denied: ${userId} attempted to access restricted resource`, {
        userId,
        permissions,
        path: req.path,
        method: req.method
      });
      
      return res.status(403).json(errorResponse('FORBIDDEN', 'Insufficient permissions'));
    } catch (error) {
      logger.error(`Error in permission middleware: ${error.message}`, { error });
      return res.status(500).json(errorResponse('SERVER_ERROR', 'Internal server error'));
    }
  };
};

/**
 * Middleware to check if user has all of the specified permissions
 * @param {Array<Object>} permissions - Array of permission objects with resource and action
 * @returns {Function} - Express middleware
 */
const requireAllPermissions = (permissions) => {
  return async (req, res, next) => {
    try {
      // User ID should be set by authenticateJWT middleware
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json(errorResponse('UNAUTHORIZED', 'Authentication required'));
      }
      
      // Build context for conditional permissions
      const context = {
        params: req.params,
        ownResource: req.params.id && req.params.id === userId
      };
      
      // Check if user has all of the permissions
      const hasAccess = await hasAllPermissions(userId, permissions, context);
      
      if (hasAccess) {
        return next();
      }
      
      // Log unauthorized access attempt
      logger.warn(`Permission denied: ${userId} attempted to access restricted resource`, {
        userId,
        permissions,
        path: req.path,
        method: req.method
      });
      
      return res.status(403).json(errorResponse('FORBIDDEN', 'Insufficient permissions'));
    } catch (error) {
      logger.error(`Error in permission middleware: ${error.message}`, { error });
      return res.status(500).json(errorResponse('SERVER_ERROR', 'Internal server error'));
    }
  };
};

/**
 * Middleware to check if user owns the resource
 * @param {string} resourceType - Resource type
 * @param {string} paramName - Parameter name containing resource ID (default: 'id')
 * @returns {Function} - Express middleware
 */
const requireResourceOwnership = (resourceType, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      // User ID should be set by authenticateJWT middleware
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json(errorResponse('UNAUTHORIZED', 'Authentication required'));
      }
      
      // Get resource ID from request parameters
      const resourceId = req.params[paramName];
      
      if (!resourceId) {
        return res.status(400).json(errorResponse('BAD_REQUEST', `Resource ID parameter '${paramName}' is required`));
      }
      
      // Check if user owns the resource
      const isOwner = await ownsResource(userId, resourceType, resourceId);
      
      if (isOwner) {
        return next();
      }
      
      // Log unauthorized access attempt
      logger.warn(`Ownership check failed: ${userId} attempted to access ${resourceType} ${resourceId}`, {
        userId,
        resourceType,
        resourceId,
        path: req.path,
        method: req.method
      });
      
      return res.status(403).json(errorResponse('FORBIDDEN', 'You do not have access to this resource'));
    } catch (error) {
      logger.error(`Error in ownership middleware: ${error.message}`, { error });
      return res.status(500).json(errorResponse('SERVER_ERROR', 'Internal server error'));
    }
  };
};

/**
 * Middleware to allow access if user has permission or owns the resource
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @param {string} resourceType - Resource type for ownership check
 * @param {string} paramName - Parameter name containing resource ID (default: 'id')
 * @returns {Function} - Express middleware
 */
const requirePermissionOrOwnership = (resource, action, resourceType, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      // User ID should be set by authenticateJWT middleware
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json(errorResponse('UNAUTHORIZED', 'Authentication required'));
      }
      
      // Get resource ID from request parameters
      const resourceId = req.params[paramName];
      
      if (!resourceId) {
        return res.status(400).json(errorResponse('BAD_REQUEST', `Resource ID parameter '${paramName}' is required`));
      }
      
      // Build context for conditional permissions
      const context = {
        params: req.params,
        ownResource: req.params.id && req.params.id === userId
      };
      
      // Check if user has permission
      const hasAccess = await hasPermission(userId, resource, action, context);
      
      // If user has permission, allow access
      if (hasAccess) {
        return next();
      }
      
      // If not, check if user owns the resource
      const isOwner = await ownsResource(userId, resourceType, resourceId);
      
      if (isOwner) {
        return next();
      }
      
      // Log unauthorized access attempt
      logger.warn(`Access denied: ${userId} attempted to access ${resourceType} ${resourceId}`, {
        userId,
        resource,
        action,
        resourceType,
        resourceId,
        path: req.path,
        method: req.method
      });
      
      return res.status(403).json(errorResponse('FORBIDDEN', 'Insufficient permissions'));
    } catch (error) {
      logger.error(`Error in permission middleware: ${error.message}`, { error });
      return res.status(500).json(errorResponse('SERVER_ERROR', 'Internal server error'));
    }
  };
};

module.exports = {
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireResourceOwnership,
  requirePermissionOrOwnership
};
