/**
 * Division Controller
 * Handles HTTP requests for division management
 */

const { divisionUseCases } = require('../../application/use-cases');
const { logger } = require('../../utils');
const { handleError } = require('../middlewares/errorHandler');

/**
 * Create a new division
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createDivision = async (req, res) => {
  try {
    const divisionData = req.body;
    const userId = req.user.id;
    
    const division = await divisionUseCases.createDivision(divisionData, userId);
    
    res.status(201).json({
      success: true,
      message: 'Division created successfully',
      data: division
    });
  } catch (error) {
    logger.error('Error in createDivision controller:', error);
    handleError(error, req, res);
  }
};

/**
 * Get a division by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDivisionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const division = await divisionUseCases.getDivisionById(id);
    
    res.status(200).json({
      success: true,
      data: division
    });
  } catch (error) {
    logger.error(`Error in getDivisionById controller for ID ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Get a division by code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDivisionByCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    const division = await divisionUseCases.getDivisionByCode(code);
    
    res.status(200).json({
      success: true,
      data: division
    });
  } catch (error) {
    logger.error(`Error in getDivisionByCode controller for code ${req.params.code}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Update a division
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    
    const division = await divisionUseCases.updateDivision(id, updateData, userId);
    
    res.status(200).json({
      success: true,
      message: 'Division updated successfully',
      data: division
    });
  } catch (error) {
    logger.error(`Error in updateDivision controller for ID ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Delete a division
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const division = await divisionUseCases.deleteDivision(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Division deleted successfully',
      data: division
    });
  } catch (error) {
    logger.error(`Error in deleteDivision controller for ID ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * List divisions with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const listDivisions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, parent, branch, level, search } = req.query;
    
    const filters = {
      status,
      parent,
      branch,
      level: level !== undefined ? parseInt(level) : undefined,
      search
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
    const result = await divisionUseCases.listDivisions(
      filters,
      parseInt(page),
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      data: result.divisions,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Error in listDivisions controller:', error);
    handleError(error, req, res);
  }
};

/**
 * Get division hierarchy
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDivisionHierarchy = async (req, res) => {
  try {
    const hierarchy = await divisionUseCases.getDivisionHierarchy();
    
    res.status(200).json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    logger.error('Error in getDivisionHierarchy controller:', error);
    handleError(error, req, res);
  }
};

/**
 * Get divisions by branch
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDivisionsByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    
    const divisions = await divisionUseCases.getDivisionsByBranch(branchId);
    
    res.status(200).json({
      success: true,
      data: divisions
    });
  } catch (error) {
    logger.error(`Error in getDivisionsByBranch controller for branch ${req.params.branchId}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Get child divisions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChildDivisions = async (req, res) => {
  try {
    const { id } = req.params;
    
    const divisions = await divisionUseCases.getChildDivisions(id);
    
    res.status(200).json({
      success: true,
      data: divisions
    });
  } catch (error) {
    logger.error(`Error in getChildDivisions controller for division ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Get all descendant divisions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDescendantDivisions = async (req, res) => {
  try {
    const { id } = req.params;
    
    const divisions = await divisionUseCases.getDescendantDivisions(id);
    
    res.status(200).json({
      success: true,
      data: divisions
    });
  } catch (error) {
    logger.error(`Error in getDescendantDivisions controller for division ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Change division status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changeDivisionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    const division = await divisionUseCases.changeDivisionStatus(id, status, userId);
    
    res.status(200).json({
      success: true,
      message: `Division status changed to ${status} successfully`,
      data: division
    });
  } catch (error) {
    logger.error(`Error in changeDivisionStatus controller for division ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Update division budget
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDivisionBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budgetData = req.body;
    const userId = req.user.id;
    
    const division = await divisionUseCases.updateDivisionBudget(id, budgetData, userId);
    
    res.status(200).json({
      success: true,
      message: 'Division budget updated successfully',
      data: division
    });
  } catch (error) {
    logger.error(`Error in updateDivisionBudget controller for division ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Update division metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDivisionMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const metrics = req.body;
    const userId = req.user.id;
    
    const division = await divisionUseCases.updateDivisionMetrics(id, metrics, userId);
    
    res.status(200).json({
      success: true,
      message: 'Division metrics updated successfully',
      data: division
    });
  } catch (error) {
    logger.error(`Error in updateDivisionMetrics controller for division ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

/**
 * Transfer division to another branch
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const transferDivisionToBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchId } = req.body;
    const userId = req.user.id;
    
    const division = await divisionUseCases.transferDivisionToBranch(id, branchId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Division transferred to new branch successfully',
      data: division
    });
  } catch (error) {
    logger.error(`Error in transferDivisionToBranch controller for division ${req.params.id}:`, error);
    handleError(error, req, res);
  }
};

module.exports = {
  createDivision,
  getDivisionById,
  getDivisionByCode,
  updateDivision,
  deleteDivision,
  listDivisions,
  getDivisionHierarchy,
  getDivisionsByBranch,
  getChildDivisions,
  getDescendantDivisions,
  changeDivisionStatus,
  updateDivisionBudget,
  updateDivisionMetrics,
  transferDivisionToBranch
};
