/**
 * Error Handling Middleware
 * Implements centralized error handling with standardized error responses
 */

const winston = require('winston');

/**
 * 404 Not Found handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: 'The requested resource was not found'
  });
};

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  winston.error(`Error: ${err.message}\nStack: ${err.stack}`);
  
  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Standardized error response
  const errorResponse = {
    status: 'error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: statusCode === 500 ? 'Internal Server Error' : err.message,
    requestId: req.id
  };
  
  // Add validation errors if available
  if (err.errors) {
    errorResponse.errors = err.errors;
  }
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
