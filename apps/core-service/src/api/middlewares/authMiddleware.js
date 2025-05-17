/**
 * Authentication Middleware
 * Handles JWT authentication and permission-based authorization
 */

const jwt = require('jsonwebtoken');
const axios = require('axios');
const { logger } = require('../../utils');

/**
 * JWT Authentication Middleware
 * Verifies JWT token and sets user in request
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Skip authentication for development if ENABLE_AUTH is not set to 'true'
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_AUTH !== 'true') {
      // Create a mock user for development
      req.user = {
        id: 'dev-user-id',
        username: 'devuser',
        role: 'admin',
        permissions: ['*']
      };
      return next();
    }

    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        code: 'MISSING_TOKEN',
        message: 'Authentication required. Please provide a valid token.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Basic token validation
    if (!token || token.split('.').length !== 3) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN_FORMAT',
        message: 'Invalid token format. Token must be a valid JWT.'
      });
    }
    
    // First try local JWT verification
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (jwtError) {
      logger.warn('Local JWT verification failed:', {
        error: jwtError.message,
        name: jwtError.name
      });
      
      // If it's a JWT error (expired, invalid, etc.), return specific error
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired. Please log in again.'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          code: 'INVALID_TOKEN',
          message: 'Invalid token. Please provide a valid token.'
        });
      }
    }
    
    // If local verification fails, try the auth service if URL is configured
    if (process.env.AUTH_SERVICE_URL) {
      try {
        logger.info(`Attempting to verify token with auth service: ${process.env.AUTH_SERVICE_URL}`);
        const response = await axios.post(
          `${process.env.AUTH_SERVICE_URL}/api/auth/verify-token`,
          { token },
          { 
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 5000, // 5 second timeout
            validateStatus: (status) => status < 500 // Don't throw for 4xx errors
          }
        );
        
        if (response.data && response.data.success) {
          // Set user in request
          req.user = response.data.user;
          return next();
        } else {
          logger.warn('Auth service verification failed:', {
            status: response.status,
            data: response.data
          });
        }
      } catch (error) {
        // Log the error but continue to return unauthorized
        logger.warn('Error contacting auth service:', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
          code: error.code
        });
      }
    }
    
    // If we get here, all verification methods failed
    return res.status(401).json({
      success: false,
      code: 'AUTHENTICATION_FAILED',
      message: 'Authentication failed. Please log in again.',
      details: process.env.NODE_ENV === 'development' 
        ? 'All authentication methods failed (local JWT and auth service)' 
        : undefined
    });
  } catch (error) {
    // Create a clean error object to avoid circular references
    const errorInfo = {
      name: error.name,
      message: error.message,
      code: error.code
    };
    
    logger.error('Unexpected error in authentication middleware:', errorInfo);
    return res.status(500).json({
      success: false,
      code: 'AUTH_ERROR',
      message: 'An unexpected authentication error occurred',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

/**
 * Local permission check helper
 * Checks if user has required permission locally
 * @param {Object} user - User object from JWT
 * @param {string} permission - Required permission
 * @returns {boolean} - Whether user has permission
 */
const checkLocalPermission = (user, permission) => {
  // If user has wildcard permission, allow access
  if (user.permissions && Array.isArray(user.permissions)) {
    if (user.permissions.includes('*')) {
      return true;
    }
    
    // Check for exact permission match
    if (user.permissions.includes(permission)) {
      return true;
    }
    
    // Check for category wildcard (e.g., 'branch:*' matches 'branch:create')
    const category = permission.split(':')[0];
    if (category && user.permissions.includes(`${category}:*`)) {
      return true;
    }
  }
  
  // Admin role has all permissions by default
  if (user.role === 'admin') {
    return true;
  }
  
  return false;
};

/**
 * Permission-based Authorization Middleware
 * Checks if user has required permission
 * @param {string} requiredPermission - Required permission
 */
const authorizePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Skip if no permission required
      if (!requiredPermission) {
        return next();
      }
      
      // Skip auth in development mode if ENABLE_AUTH is not 'true'
      if (process.env.NODE_ENV === 'development' && process.env.ENABLE_AUTH !== 'true') {
        return next();
      }
      
      // Check if user exists in request
      if (!req.user) {
        return res.status(401).json({
          success: false,
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required'
        });
      }
      
      // First try local permission check
      if (checkLocalPermission(req.user, requiredPermission)) {
        return next();
      }
      
      // If local check fails and auth service URL is configured, try remote check
      if (process.env.AUTH_SERVICE_URL) {
        try {
          logger.debug(`Checking permission with auth service: ${requiredPermission}`);
          const response = await axios.post(
            `${process.env.AUTH_SERVICE_URL}/api/auth/check-permission`,
            { 
              userId: req.user.id,
              permission: requiredPermission
            },
            { 
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              },
              timeout: 5000, // 5 second timeout
              validateStatus: (status) => status < 500 // Don't throw for 4xx errors
            }
          );
          
          if (response.data && response.data.success && response.data.hasPermission) {
            return next();
          }
        } catch (error) {
          // Log the error but continue with local permission check result
          logger.warn('Error contacting auth service for permission check:', {
            permission: requiredPermission,
            userId: req.user.id,
            error: error.message,
            code: error.code
          });
          
          // If we're in development mode, log more details
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Auth service error details:', {
              status: error.response?.status,
              data: error.response?.data,
              url: error.config?.url
            });
          }
        }
      }
      
      // If we get here, permission is denied
      return res.status(403).json({
        success: false,
        code: 'PERMISSION_DENIED',
        message: 'You do not have permission to perform this action',
        requiredPermission: process.env.NODE_ENV === 'development' ? requiredPermission : undefined
      });
    } catch (error) {
      // Create a clean error object to avoid circular references
      const errorInfo = {
        name: error.name,
        message: error.message,
        code: error.code
      };
      
      logger.error('Unexpected error in authorization middleware:', errorInfo);
      return res.status(500).json({
        success: false,
        code: 'AUTHORIZATION_ERROR',
        message: 'An unexpected authorization error occurred',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  };
};

module.exports = {
  authenticateJWT,
  authorizePermission
};
