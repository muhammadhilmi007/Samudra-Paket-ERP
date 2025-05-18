/**
 * Organizational Change Controller
 * Handles HTTP requests for tracking organizational changes
 */

const { organizationalChangeUseCases } = require('../../application/use-cases');
const { logger } = require('../../utils');
const { handleError } = require('../middlewares/errorHandler');

/**
 * Get changes for a specific entity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChangesByEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { changeType, startDate, endDate, page, limit } = req.query;
    
    const options = {
      changeType,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };
    
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    
    const result = await organizationalChangeUseCases.getChangesByEntity(entityType, entityId, options);
    
    res.status(200).json({
      success: true,
      data: result.changes,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in getChangesByEntity controller for ${req.params.entityType} with ID ${req.params.entityId}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Get changes by type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChangesByType = async (req, res) => {
  try {
    const { changeType } = req.params;
    const { entityType, startDate, endDate, page, limit } = req.query;
    
    const options = {
      entityType,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };
    
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    
    const result = await organizationalChangeUseCases.getChangesByType(changeType, options);
    
    res.status(200).json({
      success: true,
      data: result.changes,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in getChangesByType controller for change type ${req.params.changeType}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Get changes in a date range
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChangesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const { entityType, changeType, page, limit } = req.query;
    
    const options = {
      entityType,
      changeType,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };
    
    const result = await organizationalChangeUseCases.getChangesByDateRange(
      new Date(startDate),
      new Date(endDate),
      options
    );
    
    res.status(200).json({
      success: true,
      data: result.changes,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in getChangesByDateRange controller for date range ${req.params.startDate} to ${req.params.endDate}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Get recent changes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRecentChanges = async (req, res) => {
  try {
    const { limit } = req.query;
    
    const changes = await organizationalChangeUseCases.getRecentChanges(
      limit ? parseInt(limit) : 10
    );
    
    res.status(200).json({
      success: true,
      data: changes
    });
  } catch (error) {
    logger.error('Error in getRecentChanges controller:', error);
    handleError(error, req, res);
  }
};

/**
 * Get change by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChangeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const change = await organizationalChangeUseCases.getChangeById(id);
    
    res.status(200).json({
      success: true,
      data: change
    });
  } catch (error) {
    logger.error(`Error in getChangeById controller for ID ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Search changes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const searchChanges = async (req, res) => {
  try {
    const { query } = req.params;
    const { entityType, changeType, startDate, endDate, page, limit } = req.query;
    
    const options = {
      entityType,
      changeType,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };
    
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    
    const result = await organizationalChangeUseCases.searchChanges(query, options);
    
    res.status(200).json({
      success: true,
      data: result.changes,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in searchChanges controller for query "${req.params.query}":`, error);
    handleError(error, req, res);
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
