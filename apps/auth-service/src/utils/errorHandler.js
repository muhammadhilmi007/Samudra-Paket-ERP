/**
 * Error Handler Utility
 * Defines custom error classes and error handling utilities
 */

/**
 * Base application error
 * @extends Error
 */
class AppError extends Error {
  /**
   * Create a new application error
   * @param {string} message - Error message
   * @param {string} code - Error code
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, code, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error
 * @extends AppError
 */
class ValidationError extends AppError {
  /**
   * Create a new validation error
   * @param {string} message - Error message
   * @param {Array} errors - Validation errors
   */
  constructor(message = 'Validation failed', errors = []) {
    super(message, 'VALIDATION_ERROR', 400);
    this.errors = errors;
  }
}

/**
 * Authentication error
 * @extends AppError
 */
class AuthenticationError extends AppError {
  /**
   * Create a new authentication error
   * @param {string} message - Error message
   */
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

/**
 * Authorization error
 * @extends AppError
 */
class AuthorizationError extends AppError {
  /**
   * Create a new authorization error
   * @param {string} message - Error message
   */
  constructor(message = 'Insufficient permissions') {
    super(message, 'FORBIDDEN', 403);
  }
}

/**
 * Not found error
 * @extends AppError
 */
class NotFoundError extends AppError {
  /**
   * Create a new not found error
   * @param {string} message - Error message
   */
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
  }
}

/**
 * Conflict error
 * @extends AppError
 */
class ConflictError extends AppError {
  /**
   * Create a new conflict error
   * @param {string} message - Error message
   */
  constructor(message = 'Resource already exists') {
    super(message, 'CONFLICT', 409);
  }
}

/**
 * Rate limit error
 * @extends AppError
 */
class RateLimitError extends AppError {
  /**
   * Create a new rate limit error
   * @param {string} message - Error message
   */
  constructor(message = 'Too many requests') {
    super(message, 'TOO_MANY_REQUESTS', 429);
  }
}

/**
 * Internal server error
 * @extends AppError
 */
class InternalServerError extends AppError {
  /**
   * Create a new internal server error
   * @param {string} message - Error message
   */
  constructor(message = 'Internal server error') {
    super(message, 'INTERNAL_SERVER_ERROR', 500);
  }
}

/**
 * Convert Mongoose validation error to ValidationError
 * @param {Error} err - Mongoose error
 * @returns {ValidationError} - Formatted validation error
 */
const handleMongooseValidationError = (err) => {
  const errors = Object.keys(err.errors).map(field => ({
    field,
    message: err.errors[field].message
  }));
  
  return new ValidationError('Validation failed', errors);
};

/**
 * Convert Mongoose duplicate key error to ConflictError
 * @param {Error} err - Mongoose error
 * @returns {ConflictError} - Formatted conflict error
 */
const handleMongooseDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  
  return new ConflictError(`${field} '${value}' already exists`);
};

/**
 * Convert Joi validation error to ValidationError
 * @param {Error} err - Joi error
 * @returns {ValidationError} - Formatted validation error
 */
const handleJoiValidationError = (err) => {
  const errors = err.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message
  }));
  
  return new ValidationError('Validation failed', errors);
};

/**
 * Convert JWT error to AuthenticationError
 * @param {Error} err - JWT error
 * @returns {AuthenticationError} - Formatted authentication error
 */
const handleJwtError = (err) => {
  let message = 'Invalid token';
  
  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
  }
  
  return new AuthenticationError(message);
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  handleMongooseValidationError,
  handleMongooseDuplicateKeyError,
  handleJoiValidationError,
  handleJwtError
};
