/**
 * Position Controller
 * Handles HTTP requests for position management
 */

const { positionUseCases } = require('../../application/use-cases');
const { logger } = require('../../utils');
const { handleError } = require('../middlewares/errorHandler');

/**
 * Create a new position
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPosition = async (req, res) => {
  try {
    const positionData = req.body;
    const userId = req.user.id;
    
    const position = await positionUseCases.createPosition(positionData, userId);
    
    res.status(201).json({
      success: true,
      message: 'Position created successfully',
      data: position
    });
  } catch (error) {
    logger.error('Error in createPosition controller:', error);
    handleError(error, req, res);
  }
};

/**
 * Get a position by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPositionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const position = await positionUseCases.getPositionById(id);
    
    res.status(200).json({
      success: true,
      data: position
    });
  } catch (error) {
    logger.error(`Error in getPositionById controller for ID ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Get a position by code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPositionByCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    const position = await positionUseCases.getPositionByCode(code);
    
    res.status(200).json({
      success: true,
      data: position
    });
  } catch (error) {
    logger.error(`Error in getPositionByCode controller for code ${req.params.code}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Update a position
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    
    const position = await positionUseCases.updatePosition(id, updateData, userId);
    
    res.status(200).json({
      success: true,
      message: 'Position updated successfully',
      data: position
    });
  } catch (error) {
    logger.error(`Error in updatePosition controller for ID ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Delete a position
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const position = await positionUseCases.deletePosition(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Position deleted successfully',
      data: position
    });
  } catch (error) {
    logger.error(`Error in deletePosition controller for ID ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * List positions with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const listPositions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, division, reportTo, level, search } = req.query;
    
    const filters = {
      status,
      division,
      reportTo,
      level: level !== undefined ? parseInt(level) : undefined,
      search
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
    const result = await positionUseCases.listPositions(
      filters,
      parseInt(page),
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      data: result.positions,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Error in listPositions controller:', error);
    handleError(error, req, res);
  }
};

/**
 * Get positions by division
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPositionsByDivision = async (req, res) => {
  try {
    const { divisionId } = req.params;
    
    const positions = await positionUseCases.getPositionsByDivision(divisionId);
    
    res.status(200).json({
      success: true,
      data: positions
    });
  } catch (error) {
    logger.error(`Error in getPositionsByDivision controller for division ${req.params.divisionId}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Get positions reporting to a position
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getReportingPositions = async (req, res) => {
  try {
    const { id } = req.params;
    
    const positions = await positionUseCases.getReportingPositions(id);
    
    res.status(200).json({
      success: true,
      data: positions
    });
  } catch (error) {
    logger.error(`Error in getReportingPositions controller for position ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Get reporting chain for a position
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getReportingChain = async (req, res) => {
  try {
    const { id } = req.params;
    
    const chain = await positionUseCases.getReportingChain(id);
    
    res.status(200).json({
      success: true,
      data: chain
    });
  } catch (error) {
    logger.error(`Error in getReportingChain controller for position ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Get organization chart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getOrganizationChart = async (req, res) => {
  try {
    const chart = await positionUseCases.getOrganizationChart();
    
    res.status(200).json({
      success: true,
      data: chart
    });
  } catch (error) {
    logger.error('Error in getOrganizationChart controller:', error);
    handleError(error, req, res);
  }
};

/**
 * Change position status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changePositionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    const position = await positionUseCases.changePositionStatus(id, status, userId);
    
    res.status(200).json({
      success: true,
      message: `Position status changed to ${status} successfully`,
      data: position
    });
  } catch (error) {
    logger.error(`Error in changePositionStatus controller for position ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Update position requirements
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePositionRequirements = async (req, res) => {
  try {
    const { id } = req.params;
    const requirements = req.body;
    const userId = req.user.id;
    
    const position = await positionUseCases.updatePositionRequirements(id, requirements, userId);
    
    res.status(200).json({
      success: true,
      message: 'Position requirements updated successfully',
      data: position
    });
  } catch (error) {
    logger.error(`Error in updatePositionRequirements controller for position ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Update position compensation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePositionCompensation = async (req, res) => {
  try {
    const { id } = req.params;
    const compensation = req.body;
    const userId = req.user.id;
    
    const position = await positionUseCases.updatePositionCompensation(id, compensation, userId);
    
    res.status(200).json({
      success: true,
      message: 'Position compensation updated successfully',
      data: position
    });
  } catch (error) {
    logger.error(`Error in updatePositionCompensation controller for position ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Update position responsibilities
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePositionResponsibilities = async (req, res) => {
  try {
    const { id } = req.params;
    const responsibilities = req.body;
    const userId = req.user.id;
    
    const position = await positionUseCases.updatePositionResponsibilities(id, responsibilities, userId);
    
    res.status(200).json({
      success: true,
      message: 'Position responsibilities updated successfully',
      data: position
    });
  } catch (error) {
    logger.error(`Error in updatePositionResponsibilities controller for position ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Transfer position to another division
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const transferPositionToDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const { divisionId } = req.body;
    const userId = req.user.id;
    
    const position = await positionUseCases.transferPositionToDivision(id, divisionId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Position transferred to new division successfully',
      data: position
    });
  } catch (error) {
    logger.error(`Error in transferPositionToDivision controller for position ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

module.exports = {
  createPosition,
  getPositionById,
  getPositionByCode,
  updatePosition,
  deletePosition,
  listPositions,
  getPositionsByDivision,
  getReportingPositions,
  getReportingChain,
  getOrganizationChart,
  changePositionStatus,
  updatePositionRequirements,
  updatePositionCompensation,
  updatePositionResponsibilities,
  transferPositionToDivision
};
