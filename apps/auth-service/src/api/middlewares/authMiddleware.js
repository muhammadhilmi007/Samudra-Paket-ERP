/**
 * Authentication Middleware
 * Protects routes with JWT authentication
 */

const { tokenService } = require('../../application/services');
const { userRepository } = require('../../infrastructure/repositories');
const { redisClient } = require('../../infrastructure/database');

/**
 * Authenticate JWT token
 * @returns {Function} - Express middleware
 */
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.isTokenBlacklisted(token);
    
    if (isBlacklisted) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Token has been revoked'
      });
    }
    
    // Verify token
    const decoded = tokenService.verifyAccessToken(token);
    
    // Get user
    const user = await userRepository.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'User not found or inactive'
      });
    }
    
    // Attach user to request
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Token expired'
      });
    }
    
    next(error);
  }
};

/**
 * Check if user has required role
 * @param {string|Array} roles - Required role(s)
 * @returns {Function} - Express middleware
 */
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }
    
    const userRole = req.user.role;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!requiredRoles.includes(userRole) && userRole !== 'admin') {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

/**
 * Check if user has required permission
 * @param {string|Array} permissions - Required permission(s)
 * @returns {Function} - Express middleware
 */
const hasPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }
    
    const userPermissions = req.user.permissions || [];
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    
    // Admin role has all permissions
    if (req.user.role === 'admin') {
      return next();
    }
    
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasAllPermissions) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateJWT,
  hasRole,
  hasPermission
};
