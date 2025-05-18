/**
 * Authentication Middleware
 * Handles authentication and authorization for API endpoints
 */

const jwt = require('jsonwebtoken');
const { logger } = require('../../utils');
const { ApplicationError } = require('../../utils/errors');

/**
 * Authenticate user based on JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApplicationError('Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApplicationError('Authentication token missing', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token expired'
      });
    }
    
    if (error instanceof ApplicationError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Authorize user based on roles
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
const authorize = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApplicationError('User not authenticated', 401);
      }

      if (!roles.includes(req.user.role)) {
        throw new ApplicationError('You do not have permission to access this resource', 403);
      }

      next();
    } catch (error) {
      logger.error('Authorization error:', error);
      
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};

module.exports = {
  authenticate,
  authorize
};
