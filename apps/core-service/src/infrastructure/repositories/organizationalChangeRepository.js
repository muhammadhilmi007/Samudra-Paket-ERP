/**
 * Organizational Change Repository
 * Handles data access operations for organizational changes
 */

const { OrganizationalChange } = require('../../domain/models');
const { logger } = require('../../utils');

/**
 * Get changes for a specific entity
 * @param {string} entityType - The entity type (DIVISION or POSITION)
 * @param {string} entityId - The entity ID
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Array>} The organizational changes
 */
const getChangesByEntity = async (entityType, entityId, options = {}) => {
  try {
    const query = { entityType, entityId };
    
    // Apply additional filters
    if (options.changeType) query.changeType = options.changeType;
    if (options.startDate && options.endDate) {
      query.effectiveDate = {
        $gte: options.startDate,
        $lte: options.endDate
      };
    } else if (options.startDate) {
      query.effectiveDate = { $gte: options.startDate };
    } else if (options.endDate) {
      query.effectiveDate = { $lte: options.endDate };
    }
    
    // Apply pagination
    const limit = options.limit || 10;
    const skip = options.page ? (options.page - 1) * limit : 0;
    
    const changes = await OrganizationalChange.find(query)
      .sort({ effectiveDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await OrganizationalChange.countDocuments(query);
    
    return {
      changes,
      pagination: {
        total,
        page: options.page || 1,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error getting changes for ${entityType} with ID ${entityId}:`, error);
    throw error;
  }
};

/**
 * Get changes by type
 * @param {string} changeType - The change type
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Array>} The organizational changes
 */
const getChangesByType = async (changeType, options = {}) => {
  try {
    const query = { changeType };
    
    // Apply additional filters
    if (options.entityType) query.entityType = options.entityType;
    if (options.startDate && options.endDate) {
      query.effectiveDate = {
        $gte: options.startDate,
        $lte: options.endDate
      };
    } else if (options.startDate) {
      query.effectiveDate = { $gte: options.startDate };
    } else if (options.endDate) {
      query.effectiveDate = { $lte: options.endDate };
    }
    
    // Apply pagination
    const limit = options.limit || 10;
    const skip = options.page ? (options.page - 1) * limit : 0;
    
    const changes = await OrganizationalChange.find(query)
      .sort({ effectiveDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await OrganizationalChange.countDocuments(query);
    
    return {
      changes,
      pagination: {
        total,
        page: options.page || 1,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error getting changes of type ${changeType}:`, error);
    throw error;
  }
};

/**
 * Get changes in a date range
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Array>} The organizational changes
 */
const getChangesByDateRange = async (startDate, endDate, options = {}) => {
  try {
    const query = {
      effectiveDate: {
        $gte: startDate,
        $lte: endDate
      }
    };
    
    // Apply additional filters
    if (options.entityType) query.entityType = options.entityType;
    if (options.changeType) query.changeType = options.changeType;
    
    // Apply pagination
    const limit = options.limit || 10;
    const skip = options.page ? (options.page - 1) * limit : 0;
    
    const changes = await OrganizationalChange.find(query)
      .sort({ effectiveDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await OrganizationalChange.countDocuments(query);
    
    return {
      changes,
      pagination: {
        total,
        page: options.page || 1,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error getting changes between ${startDate} and ${endDate}:`, error);
    throw error;
  }
};

/**
 * Get recent changes
 * @param {number} limit - The number of changes to retrieve
 * @returns {Promise<Array>} The recent organizational changes
 */
const getRecentChanges = async (limit = 10) => {
  try {
    return await OrganizationalChange.findRecentChanges(limit);
  } catch (error) {
    logger.error(`Error getting recent changes:`, error);
    throw error;
  }
};

/**
 * Get change by ID
 * @param {string} id - The change ID
 * @returns {Promise<Object>} The organizational change
 */
const getChangeById = async (id) => {
  try {
    return await OrganizationalChange.findById(id);
  } catch (error) {
    logger.error(`Error getting change with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search changes
 * @param {string} query - The search query
 * @param {Object} options - Additional options for filtering
 * @returns {Promise<Array>} The matching organizational changes
 */
const searchChanges = async (query, options = {}) => {
  try {
    const searchQuery = {
      $or: [
        { description: new RegExp(query, 'i') },
        { 'changedFields': new RegExp(query, 'i') }
      ]
    };
    
    // Apply additional filters
    if (options.entityType) searchQuery.entityType = options.entityType;
    if (options.changeType) searchQuery.changeType = options.changeType;
    if (options.startDate && options.endDate) {
      searchQuery.effectiveDate = {
        $gte: options.startDate,
        $lte: options.endDate
      };
    } else if (options.startDate) {
      searchQuery.effectiveDate = { $gte: options.startDate };
    } else if (options.endDate) {
      searchQuery.effectiveDate = { $lte: options.endDate };
    }
    
    // Apply pagination
    const limit = options.limit || 10;
    const skip = options.page ? (options.page - 1) * limit : 0;
    
    const changes = await OrganizationalChange.find(searchQuery)
      .sort({ effectiveDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await OrganizationalChange.countDocuments(searchQuery);
    
    return {
      changes,
      pagination: {
        total,
        page: options.page || 1,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error searching changes with query "${query}":`, error);
    throw error;
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
