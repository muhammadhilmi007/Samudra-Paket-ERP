/**
 * Employee History Repository
 * Handles data access operations for the EmployeeHistory model
 */

const { EmployeeHistory } = require('../../domain/models');
const { ApplicationError } = require('../../utils/errors');
const mongoose = require('mongoose');

/**
 * Create a new employee history entry
 * @param {Object} historyData - History data
 * @returns {Promise<Object>} Created history entry
 */
const createEmployeeHistory = async (historyData) => {
  try {
    const history = new EmployeeHistory(historyData);
    return await history.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Get employee history entries with pagination and filtering
 * @param {string} employeeId - Employee ID
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Paginated history entries
 */
const getEmployeeHistory = async (employeeId, filters = {}, pagination = {}) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new ApplicationError('Invalid employee ID', 400);
  }
  
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;
  
  const query = { employeeId };
  
  // Apply filters
  if (filters.changeType) {
    query.changeType = filters.changeType;
  }
  
  if (filters.startDate) {
    query.timestamp = { ...query.timestamp, $gte: new Date(filters.startDate) };
  }
  
  if (filters.endDate) {
    query.timestamp = { ...query.timestamp, $lte: new Date(filters.endDate) };
  }
  
  if (filters.changedBy) {
    query.changedBy = filters.changedBy;
  }
  
  // Get total count
  const total = await EmployeeHistory.countDocuments(query);
  
  // Get history entries
  const history = await EmployeeHistory.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('changedBy', 'username');
  
  return {
    data: history,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get history entry by ID
 * @param {string} id - History entry ID
 * @returns {Promise<Object>} History entry
 */
const getHistoryById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApplicationError('Invalid history ID', 400);
  }
  
  const history = await EmployeeHistory.findById(id)
    .populate('employeeId', 'employeeId fullName')
    .populate('changedBy', 'username');
  
  if (!history) {
    throw new ApplicationError('History entry not found', 404);
  }
  
  return history;
};

/**
 * Get history entries by change type
 * @param {string} changeType - Change type
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Paginated history entries
 */
const getHistoryByChangeType = async (changeType, pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;
  
  const query = { changeType };
  
  // Get total count
  const total = await EmployeeHistory.countDocuments(query);
  
  // Get history entries
  const history = await EmployeeHistory.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('employeeId', 'employeeId fullName')
    .populate('changedBy', 'username');
  
  return {
    data: history,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get history entries by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Paginated history entries
 */
const getHistoryByDateRange = async (startDate, endDate, pagination = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;
  
  const query = {
    timestamp: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };
  
  // Get total count
  const total = await EmployeeHistory.countDocuments(query);
  
  // Get history entries
  const history = await EmployeeHistory.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('employeeId', 'employeeId fullName')
    .populate('changedBy', 'username');
  
  return {
    data: history,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get history entries by user
 * @param {string} userId - User ID
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Paginated history entries
 */
const getHistoryByUser = async (userId, pagination = {}) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApplicationError('Invalid user ID', 400);
  }
  
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;
  
  const query = { changedBy: userId };
  
  // Get total count
  const total = await EmployeeHistory.countDocuments(query);
  
  // Get history entries
  const history = await EmployeeHistory.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('employeeId', 'employeeId fullName')
    .populate('changedBy', 'username');
  
  return {
    data: history,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  createEmployeeHistory,
  getEmployeeHistory,
  getHistoryById,
  getHistoryByChangeType,
  getHistoryByDateRange,
  getHistoryByUser
};
