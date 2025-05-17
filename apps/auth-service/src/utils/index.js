/**
 * Utils Index
 * Exports all utility modules
 */

const { logger, requestLogger } = require('./logger');
const { successResponse, errorResponse, responseTypes } = require('./apiResponse');
const {
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
} = require('./errorHandler');
const {
  generateRandomToken,
  generateVerificationToken,
  isTokenExpired,
  maskSensitiveData,
  parsePagination,
  formatPaginatedResponse,
  sanitizeObject,
  toObjectId,
  isValidObjectId
} = require('./helpers');

module.exports = {
  // Logger
  logger,
  requestLogger,
  
  // API Response
  successResponse,
  errorResponse,
  responseTypes,
  
  // Error Handler
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
  handleJwtError,
  
  // Helpers
  generateRandomToken,
  generateVerificationToken,
  isTokenExpired,
  maskSensitiveData,
  parsePagination,
  formatPaginatedResponse,
  sanitizeObject,
  toObjectId,
  isValidObjectId
};
