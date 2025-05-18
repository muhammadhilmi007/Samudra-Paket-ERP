/**
 * Error Handler Middleware
 * Handles errors and standardizes error responses
 */

const { logger } = require('../../utils');
const { ApplicationError } = require('../../utils/errors');

/**
 * Handle errors in a standardized way
 * @param {Error} error - The error to handle
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleError = (error, req, res) => {
  // If it's an ApplicationError, use its status code and message
  if (error instanceof ApplicationError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors || undefined
    });
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const errors = Object.keys(error.errors).map(field => ({
      field,
      message: error.errors[field].message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // Handle Mongoose duplicate key errors
  if (error.name === 'MongoError' && error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}`,
      errors: [{
        field,
        message: `The ${field} already exists`
      }]
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      errors: [{
        field: 'token',
        message: error.message
      }]
    });
  }

  // Handle token expiration
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      errors: [{
        field: 'token',
        message: 'Your session has expired, please login again'
      }]
    });
  }

  // Log the error for server-side debugging
  logger.error('Unhandled error:', error);

  // Default to 500 Internal Server Error for unhandled errors
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    errors: process.env.NODE_ENV === 'development' ? [{ message: error.message }] : undefined
  });
};

/**
 * Global error handler middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorMiddleware = (err, req, res, next) => {
  handleError(err, req, res);
};

module.exports = {
  handleError,
  errorMiddleware
};
