/**
 * Helper Utilities
 * Common helper functions used throughout the application
 */

const crypto = require('crypto');
const moment = require('moment');

/**
 * Generate a random token
 * @param {number} bytes - Number of bytes for token
 * @returns {string} - Random token
 */
const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Generate a verification token with expiry
 * @param {string} expiresIn - Duration string (e.g., '24h')
 * @returns {Object} - Token and expiry date
 */
const generateVerificationToken = (expiresIn = '24h') => {
  const token = generateRandomToken();
  const expiresAt = moment().add(
    parseInt(expiresIn),
    expiresIn.includes('h') ? 'hours' : 'days'
  ).toDate();
  
  return {
    token,
    expiresAt
  };
};

/**
 * Check if a token has expired
 * @param {Date} expiryDate - Token expiry date
 * @returns {boolean} - True if token has expired
 */
const isTokenExpired = (expiryDate) => {
  return moment().isAfter(moment(expiryDate));
};

/**
 * Mask sensitive data for logging
 * @param {Object} data - Data to mask
 * @param {Array} fieldsToMask - Fields to mask
 * @returns {Object} - Masked data
 */
const maskSensitiveData = (data, fieldsToMask = ['password', 'token', 'refreshToken']) => {
  const maskedData = { ...data };
  
  fieldsToMask.forEach(field => {
    if (maskedData[field]) {
      maskedData[field] = '********';
    }
  });
  
  return maskedData;
};

/**
 * Parse pagination parameters from request query
 * @param {Object} query - Request query object
 * @returns {Object} - Pagination parameters
 */
const parsePagination = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = query.sort || '-createdAt';
  
  return {
    page,
    limit,
    skip,
    sort
  };
};

/**
 * Format pagination response
 * @param {Array} data - Data array
 * @param {number} total - Total count
 * @param {Object} pagination - Pagination parameters
 * @returns {Object} - Formatted response with pagination
 */
const formatPaginatedResponse = (data, total, pagination) => {
  return {
    data,
    pagination: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(total / pagination.limit)
    }
  };
};

/**
 * Sanitize object by removing specified fields
 * @param {Object} obj - Object to sanitize
 * @param {Array} fieldsToRemove - Fields to remove
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj, fieldsToRemove = []) => {
  const sanitized = { ...obj };
  
  fieldsToRemove.forEach(field => {
    delete sanitized[field];
  });
  
  return sanitized;
};

/**
 * Convert string ID to ObjectId
 * @param {string} id - String ID
 * @returns {Object} - ObjectId
 */
const toObjectId = (id) => {
  const mongoose = require('mongoose');
  
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    return null;
  }
};

/**
 * Check if string is valid ObjectId
 * @param {string} id - String to check
 * @returns {boolean} - True if valid ObjectId
 */
const isValidObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
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
