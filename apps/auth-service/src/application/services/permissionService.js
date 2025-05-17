/**
 * Permission Service
 * Handles permission checking and authorization
 */

const { Role, Permission, RolePermission, UserRole, User } = require('../../domain/models');
const { getRedisClient } = require('../../config');
const logger = require('../../utils/logger');

// Cache TTL in seconds
const CACHE_TTL = 300; // 5 minutes

/**
 * Check if a user has a specific permission
 * @param {string} userId - User ID
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @param {Object} context - Context for conditional permissions
 * @returns {Promise<boolean>} - Whether user has permission
 */
const hasPermission = async (userId, resource, action, context = {}) => {
  try {
    // Get Redis client for caching
    const redisClient = getRedisClient();
    const cacheKey = `perm:${userId}:${resource}:${action}`;
    
    // Try to get from cache first
    if (redisClient) {
      const cachedResult = await redisClient.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult === 'true';
      }
    }
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      logger.error(`User with ID ${userId} not found`);
      return false;
    }
    
    // Check if user is admin (has all permissions)
    if (user.role === 'admin') {
      // Cache result
      if (redisClient) {
        await redisClient.setex(cacheKey, CACHE_TTL, 'true');
      }
      return true;
    }
    
    // Get all active roles for the user
    const userRoles = await UserRole.getActiveRolesForUser(userId);
    if (!userRoles.length) {
      // Cache result
      if (redisClient) {
        await redisClient.setex(cacheKey, CACHE_TTL, 'false');
      }
      return false;
    }
    
    // Find the permission
    const permission = await Permission.findOne({ resource, action });
    if (!permission) {
      logger.error(`Permission ${resource}:${action} not found`);
      return false;
    }
    
    // Check each role for the permission
    for (const userRole of userRoles) {
      const roleId = userRole.role._id;
      
      // Get all permissions for this role (including from parent roles)
      const rolePermissions = await RolePermission.getPermissionsForRole(roleId, true);
      
      // Check if any of the role permissions match the requested permission
      const hasPermission = rolePermissions.some(rp => {
        // Check if permission IDs match and permission is granted
        if (rp.permission._id.toString() === permission._id.toString() && rp.granted) {
          // Check if permission constraints match the context
          return permission.matchesContext({
            ...context,
            ...rp.constraints
          });
        }
        return false;
      });
      
      if (hasPermission) {
        // Cache result
        if (redisClient) {
          await redisClient.setex(cacheKey, CACHE_TTL, 'true');
        }
        return true;
      }
    }
    
    // If we get here, user doesn't have permission
    // Cache result
    if (redisClient) {
      await redisClient.setex(cacheKey, CACHE_TTL, 'false');
    }
    return false;
  } catch (error) {
    logger.error(`Error checking permission: ${error.message}`, { error });
    return false;
  }
};

/**
 * Check if user has any of the specified permissions
 * @param {string} userId - User ID
 * @param {Array<Object>} permissions - Array of permission objects with resource and action
 * @param {Object} context - Context for conditional permissions
 * @returns {Promise<boolean>} - Whether user has any of the permissions
 */
const hasAnyPermission = async (userId, permissions, context = {}) => {
  for (const { resource, action } of permissions) {
    const result = await hasPermission(userId, resource, action, context);
    if (result) {
      return true;
    }
  }
  return false;
};

/**
 * Check if user has all of the specified permissions
 * @param {string} userId - User ID
 * @param {Array<Object>} permissions - Array of permission objects with resource and action
 * @param {Object} context - Context for conditional permissions
 * @returns {Promise<boolean>} - Whether user has all of the permissions
 */
const hasAllPermissions = async (userId, permissions, context = {}) => {
  for (const { resource, action } of permissions) {
    const result = await hasPermission(userId, resource, action, context);
    if (!result) {
      return false;
    }
  }
  return true;
};

/**
 * Check if a user owns a resource
 * @param {string} userId - User ID
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @returns {Promise<boolean>} - Whether user owns the resource
 */
const ownsResource = async (userId, resourceType, resourceId) => {
  try {
    // Different logic based on resource type
    switch (resourceType) {
      case 'user':
        // User can only access their own user resource
        return userId.toString() === resourceId.toString();
        
      // Add cases for other resource types
      case 'shipment':
        // Implementation would depend on shipment model
        // const shipment = await Shipment.findById(resourceId);
        // return shipment && shipment.userId.toString() === userId.toString();
        return false;
        
      default:
        logger.error(`Unknown resource type: ${resourceType}`);
        return false;
    }
  } catch (error) {
    logger.error(`Error checking resource ownership: ${error.message}`, { error });
    return false;
  }
};

/**
 * Get all permissions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of permission objects
 */
const getUserPermissions = async (userId) => {
  try {
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      logger.error(`User with ID ${userId} not found`);
      return [];
    }
    
    // If user is admin, get all permissions
    if (user.role === 'admin') {
      return await Permission.find();
    }
    
    // Get all active roles for the user
    const userRoles = await UserRole.getActiveRolesForUser(userId);
    if (!userRoles.length) {
      return [];
    }
    
    // Get permissions for each role and combine them
    const permissionSets = await Promise.all(
      userRoles.map(ur => RolePermission.getPermissionsForRole(ur.role._id, true))
    );
    
    // Flatten and deduplicate permissions
    const permissionMap = new Map();
    permissionSets.flat().forEach(rp => {
      if (rp.granted) {
        permissionMap.set(rp.permission._id.toString(), rp.permission);
      }
    });
    
    return Array.from(permissionMap.values());
  } catch (error) {
    logger.error(`Error getting user permissions: ${error.message}`, { error });
    return [];
  }
};

/**
 * Clear permission cache for a user
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - Whether cache was cleared
 */
const clearPermissionCache = async (userId) => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) {
      return false;
    }
    
    // Delete all permission cache keys for this user
    const keys = await redisClient.keys(`perm:${userId}:*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    
    return true;
  } catch (error) {
    logger.error(`Error clearing permission cache: ${error.message}`, { error });
    return false;
  }
};

module.exports = {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  ownsResource,
  getUserPermissions,
  clearPermissionCache
};
