/**
 * Custom error classes for the Core Service
 * These error classes help standardize error handling across the application
 */

/**
 * Base error class for application errors
 */
class ApplicationError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for validation failures
 */
class ValidationError extends ApplicationError {
  constructor(message = 'Validation failed') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

/**
 * Error for resource not found
 */
class NotFoundError extends ApplicationError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Error for unauthorized access
 */
class UnauthorizedError extends ApplicationError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Error for forbidden access (authenticated but not allowed)
 */
class ForbiddenError extends ApplicationError {
  constructor(message = 'Forbidden access') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Error for duplicate or conflicting resources
 */
class ConflictError extends ApplicationError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * Error for service unavailability
 */
class ServiceUnavailableError extends ApplicationError {
  constructor(message = 'Service unavailable') {
    super(message, 503);
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * Error for bad gateway or external service failures
 */
class BadGatewayError extends ApplicationError {
  constructor(message = 'Bad gateway') {
    super(message, 502);
    this.name = 'BadGatewayError';
  }
}

/**
 * Error handler middleware for Express
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Log the error
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = {
  ApplicationError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ServiceUnavailableError,
  BadGatewayError,
  errorHandler
};
