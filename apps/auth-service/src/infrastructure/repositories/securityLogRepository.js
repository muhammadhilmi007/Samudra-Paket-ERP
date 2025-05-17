/**
 * Security Log Repository
 * Implements data access methods for the SecurityLog model
 */

const { SecurityLog } = require('../../domain/models');

/**
 * Create a new security log entry
 * @param {Object} logData - Log data
 * @returns {Promise<SecurityLog>} - Returns created log
 */
const createLog = async (logData) => {
  return SecurityLog.createLog(logData);
};

/**
 * Find logs by user ID
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array<SecurityLog>>} - Returns array of logs
 */
const findByUserId = async (userId, options = {}) => {
  return SecurityLog.findByUserId(userId, options);
};

/**
 * Find logs by event type
 * @param {string} eventType - Event type
 * @param {Object} options - Query options
 * @returns {Promise<Array<SecurityLog>>} - Returns array of logs
 */
const findByEventType = async (eventType, options = {}) => {
  return SecurityLog.findByEventType(eventType, options);
};

/**
 * Find logs by time range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Object} options - Query options
 * @returns {Promise<Array<SecurityLog>>} - Returns array of logs
 */
const findByTimeRange = async (startDate, endDate, options = {}) => {
  const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
  
  return SecurityLog.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

/**
 * Find logs by status
 * @param {string} status - Log status (SUCCESS or FAILURE)
 * @param {Object} options - Query options
 * @returns {Promise<Array<SecurityLog>>} - Returns array of logs
 */
const findByStatus = async (status, options = {}) => {
  const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
  
  return SecurityLog.find({ status })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

/**
 * Count failed login attempts for a user
 * @param {string} userId - User ID
 * @param {number} minutes - Time window in minutes
 * @returns {Promise<number>} - Returns count of failed attempts
 */
const countFailedLoginAttempts = async (userId, minutes = 30) => {
  return SecurityLog.countFailedLoginAttempts(userId, minutes);
};

/**
 * Find all logs
 * @param {Object} options - Query options
 * @returns {Promise<Array<SecurityLog>>} - Returns array of logs
 */
const findAll = async (options = {}) => {
  const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
  
  return SecurityLog.find()
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

/**
 * Count logs
 * @param {Object} filter - Filter criteria
 * @returns {Promise<number>} - Returns count of logs
 */
const countLogs = async (filter = {}) => {
  return SecurityLog.countDocuments(filter);
};

/**
 * Delete logs older than specified date
 * @param {Date} date - Date threshold
 * @returns {Promise<Object>} - Returns delete result
 */
const deleteOlderThan = async (date) => {
  return SecurityLog.deleteMany({
    createdAt: { $lt: date }
  });
};

module.exports = {
  createLog,
  findByUserId,
  findByEventType,
  findByTimeRange,
  findByStatus,
  countFailedLoginAttempts,
  findAll,
  countLogs,
  deleteOlderThan
};
