/**
 * Employee History Controller
 * Handles HTTP requests for employee history management
 */

const employeeHistoryRepository = require('../../infrastructure/repositories/employeeHistoryRepository');
const { ApplicationError } = require('../../utils/errors');

/**
 * Get history by employee ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getHistoryByEmployeeId = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { 
      page, 
      limit, 
      changeType, 
      startDate, 
      endDate, 
      changedBy 
    } = req.query;
    
    // Build filters
    const filters = {};
    if (changeType) filters.changeType = changeType;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (changedBy) filters.changedBy = changedBy;
    
    // Build pagination
    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    };
    
    const result = await employeeHistoryRepository.getEmployeeHistory(employeeId, filters, pagination);
    
    res.status(200).json({
      success: true,
      message: 'Employee history retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get history entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const history = await employeeHistoryRepository.getHistoryById(id);
    
    res.status(200).json({
      success: true,
      message: 'History entry retrieved successfully',
      data: history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get history entries by change type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getHistoryByChangeType = async (req, res, next) => {
  try {
    const { changeType } = req.params;
    const { page, limit } = req.query;
    
    // Build pagination
    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    };
    
    const result = await employeeHistoryRepository.getHistoryByChangeType(changeType, pagination);
    
    res.status(200).json({
      success: true,
      message: 'History entries retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get history entries by date range
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getHistoryByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.params;
    const { page, limit } = req.query;
    
    // Build pagination
    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    };
    
    const result = await employeeHistoryRepository.getHistoryByDateRange(startDate, endDate, pagination);
    
    res.status(200).json({
      success: true,
      message: 'History entries retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get history entries by user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getHistoryByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;
    
    // Build pagination
    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    };
    
    const result = await employeeHistoryRepository.getHistoryByUser(userId, pagination);
    
    res.status(200).json({
      success: true,
      message: 'History entries retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistoryByEmployeeId,
  getHistoryById,
  getHistoryByChangeType,
  getHistoryByDateRange,
  getHistoryByUser
};
