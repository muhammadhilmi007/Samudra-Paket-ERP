/**
 * Organizational Change Use Cases
 * Business logic for tracking organizational changes
 */

const { organizationalChangeRepository } = require('../../infrastructure/repositories');
const { logger } = require('../../utils');
const { ApplicationError } = require('../../utils/errors');

/**
 * Get changes for a specific entity
 * @param {string} entityType - The entity type (DIVISION or POSITION)
 * @param {string} entityId - The entity ID
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Object>} The organizational changes with pagination
 */
const getChangesByEntity = async (entityType, entityId, options = {}) => {
  try {
    // Validate entity type
    const validEntityTypes = ['DIVISION', 'POSITION'];
    if (!validEntityTypes.includes(entityType)) {
      throw new ApplicationError(`Invalid entity type: ${entityType}. Must be one of: ${validEntityTypes.join(', ')}`, 400);
    }
    
    // Validate options
    if (options.changeType) {
      const validChangeTypes = ['CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'TRANSFER', 'RESTRUCTURE'];
      if (!validChangeTypes.includes(options.changeType)) {
        throw new ApplicationError(`Invalid change type: ${options.changeType}. Must be one of: ${validChangeTypes.join(', ')}`, 400);
      }
    }
    
    if (options.page && (isNaN(options.page) || options.page < 1)) {
      throw new ApplicationError('Page must be a positive number', 400);
    }
    
    if (options.limit && (isNaN(options.limit) || options.limit < 1 || options.limit > 100)) {
      throw new ApplicationError('Limit must be a positive number between 1 and 100', 400);
    }
    
    return await organizationalChangeRepository.getChangesByEntity(entityType, entityId, options);
  } catch (error) {
    logger.error(`Error in getChangesByEntity use case for ${entityType} with ID ${entityId}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get changes by type
 * @param {string} changeType - The change type
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Object>} The organizational changes with pagination
 */
const getChangesByType = async (changeType, options = {}) => {
  try {
    // Validate change type
    const validChangeTypes = ['CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'TRANSFER', 'RESTRUCTURE'];
    if (!validChangeTypes.includes(changeType)) {
      throw new ApplicationError(`Invalid change type: ${changeType}. Must be one of: ${validChangeTypes.join(', ')}`, 400);
    }
    
    // Validate options
    if (options.entityType) {
      const validEntityTypes = ['DIVISION', 'POSITION'];
      if (!validEntityTypes.includes(options.entityType)) {
        throw new ApplicationError(`Invalid entity type: ${options.entityType}. Must be one of: ${validEntityTypes.join(', ')}`, 400);
      }
    }
    
    if (options.page && (isNaN(options.page) || options.page < 1)) {
      throw new ApplicationError('Page must be a positive number', 400);
    }
    
    if (options.limit && (isNaN(options.limit) || options.limit < 1 || options.limit > 100)) {
      throw new ApplicationError('Limit must be a positive number between 1 and 100', 400);
    }
    
    return await organizationalChangeRepository.getChangesByType(changeType, options);
  } catch (error) {
    logger.error(`Error in getChangesByType use case for change type ${changeType}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get changes in a date range
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Object>} The organizational changes with pagination
 */
const getChangesByDateRange = async (startDate, endDate, options = {}) => {
  try {
    // Validate dates
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      throw new ApplicationError('Start date must be a valid date', 400);
    }
    
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      throw new ApplicationError('End date must be a valid date', 400);
    }
    
    if (startDate > endDate) {
      throw new ApplicationError('Start date cannot be after end date', 400);
    }
    
    // Validate options
    if (options.entityType) {
      const validEntityTypes = ['DIVISION', 'POSITION'];
      if (!validEntityTypes.includes(options.entityType)) {
        throw new ApplicationError(`Invalid entity type: ${options.entityType}. Must be one of: ${validEntityTypes.join(', ')}`, 400);
      }
    }
    
    if (options.changeType) {
      const validChangeTypes = ['CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'TRANSFER', 'RESTRUCTURE'];
      if (!validChangeTypes.includes(options.changeType)) {
        throw new ApplicationError(`Invalid change type: ${options.changeType}. Must be one of: ${validChangeTypes.join(', ')}`, 400);
      }
    }
    
    if (options.page && (isNaN(options.page) || options.page < 1)) {
      throw new ApplicationError('Page must be a positive number', 400);
    }
    
    if (options.limit && (isNaN(options.limit) || options.limit < 1 || options.limit > 100)) {
      throw new ApplicationError('Limit must be a positive number between 1 and 100', 400);
    }
    
    return await organizationalChangeRepository.getChangesByDateRange(startDate, endDate, options);
  } catch (error) {
    logger.error(`Error in getChangesByDateRange use case for date range ${startDate} to ${endDate}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get recent changes
 * @param {number} limit - The number of changes to retrieve
 * @returns {Promise<Array>} The recent organizational changes
 */
const getRecentChanges = async (limit = 10) => {
  try {
    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw new ApplicationError('Limit must be a positive number between 1 and 100', 400);
    }
    
    return await organizationalChangeRepository.getRecentChanges(limit);
  } catch (error) {
    logger.error(`Error in getRecentChanges use case:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get change by ID
 * @param {string} id - The change ID
 * @returns {Promise<Object>} The organizational change
 */
const getChangeById = async (id) => {
  try {
    const change = await organizationalChangeRepository.getChangeById(id);
    if (!change) {
      throw new ApplicationError(`Organizational change with ID ${id} not found`, 404);
    }
    
    return change;
  } catch (error) {
    logger.error(`Error in getChangeById use case for ID ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Search changes
 * @param {string} query - The search query
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Object>} The matching organizational changes with pagination
 */
const searchChanges = async (query, options = {}) => {
  try {
    // Validate query
    if (!query || typeof query !== 'string' || query.trim() === '') {
      throw new ApplicationError('Search query must be a non-empty string', 400);
    }
    
    // Validate options
    if (options.entityType) {
      const validEntityTypes = ['DIVISION', 'POSITION'];
      if (!validEntityTypes.includes(options.entityType)) {
        throw new ApplicationError(`Invalid entity type: ${options.entityType}. Must be one of: ${validEntityTypes.join(', ')}`, 400);
      }
    }
    
    if (options.changeType) {
      const validChangeTypes = ['CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'TRANSFER', 'RESTRUCTURE'];
      if (!validChangeTypes.includes(options.changeType)) {
        throw new ApplicationError(`Invalid change type: ${options.changeType}. Must be one of: ${validChangeTypes.join(', ')}`, 400);
      }
    }
    
    if (options.page && (isNaN(options.page) || options.page < 1)) {
      throw new ApplicationError('Page must be a positive number', 400);
    }
    
    if (options.limit && (isNaN(options.limit) || options.limit < 1 || options.limit > 100)) {
      throw new ApplicationError('Limit must be a positive number between 1 and 100', 400);
    }
    
    return await organizationalChangeRepository.searchChanges(query, options);
  } catch (error) {
    logger.error(`Error in searchChanges use case for query "${query}":`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

module.exports = {
  getChangesByEntity,
  getChangesByType,
  getChangesByDateRange,
  getRecentChanges,
  getChangeById,
  searchChanges
};
