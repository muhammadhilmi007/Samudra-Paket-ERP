/**
 * API Response Utilities
 * Standardizes API response format
 */

/**
 * Create a success response
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Object} - Formatted success response
 */
const successResponse = (message, data = null, statusCode = 200) => {
  const response = {
    status: 'success',
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return {
    statusCode,
    body: response
  };
};

/**
 * Create an error response
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {Array} errors - Validation errors
 * @param {number} statusCode - HTTP status code
 * @returns {Object} - Formatted error response
 */
const errorResponse = (message, code, errors = null, statusCode = 400) => {
  const response = {
    status: 'error',
    code,
    message
  };
  
  if (errors !== null) {
    response.errors = errors;
  }
  
  return {
    statusCode,
    body: response
  };
};

/**
 * Common response status codes and messages
 */
const responseTypes = {
  // Success responses
  SUCCESS: { code: 200, message: 'Operation successful' },
  CREATED: { code: 201, message: 'Resource created successfully' },
  ACCEPTED: { code: 202, message: 'Request accepted for processing' },
  NO_CONTENT: { code: 204, message: 'Operation successful, no content to return' },
  
  // Client error responses
  BAD_REQUEST: { code: 400, message: 'Bad request', errorCode: 'BAD_REQUEST' },
  UNAUTHORIZED: { code: 401, message: 'Authentication required', errorCode: 'UNAUTHORIZED' },
  FORBIDDEN: { code: 403, message: 'Insufficient permissions', errorCode: 'FORBIDDEN' },
  NOT_FOUND: { code: 404, message: 'Resource not found', errorCode: 'NOT_FOUND' },
  VALIDATION_ERROR: { code: 422, message: 'Validation failed', errorCode: 'VALIDATION_ERROR' },
  TOO_MANY_REQUESTS: { code: 429, message: 'Too many requests', errorCode: 'TOO_MANY_REQUESTS' },
  
  // Server error responses
  INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal server error', errorCode: 'INTERNAL_SERVER_ERROR' },
  SERVICE_UNAVAILABLE: { code: 503, message: 'Service temporarily unavailable', errorCode: 'SERVICE_UNAVAILABLE' }
};

module.exports = {
  successResponse,
  errorResponse,
  responseTypes
};
