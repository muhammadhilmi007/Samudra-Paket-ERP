/**
 * Security Log Controller
 * Handles security log related requests
 */

const { securityLogRepository } = require('../../infrastructure/repositories');

/**
 * Get all security logs
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getAllLogs = async (req, res, next) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Get logs
    const logs = await securityLogRepository.findAll({ skip, limit, sort });
    const total = await securityLogRepository.countLogs();
    
    res.status(200).json({
      status: 'success',
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logs by user ID
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getLogsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Get logs by user ID
    const logs = await securityLogRepository.findByUserId(userId, { skip, limit, sort });
    const total = await securityLogRepository.countLogs({ userId });
    
    res.status(200).json({
      status: 'success',
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logs by event type
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getLogsByEventType = async (req, res, next) => {
  try {
    const { eventType } = req.params;
    
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Get logs by event type
    const logs = await securityLogRepository.findByEventType(eventType, { skip, limit, sort });
    const total = await securityLogRepository.countLogs({ eventType });
    
    res.status(200).json({
      status: 'success',
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logs by date range
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getLogsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Get logs by date range
    const logs = await securityLogRepository.findByDateRange(
      new Date(startDate),
      new Date(endDate),
      { skip, limit, sort }
    );
    
    const total = await securityLogRepository.countLogs({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logs by status
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getLogsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Get logs by status
    const logs = await securityLogRepository.findByStatus(status, { skip, limit, sort });
    const total = await securityLogRepository.countLogs({ status });
    
    res.status(200).json({
      status: 'success',
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLogs,
  getLogsByUserId,
  getLogsByEventType,
  getLogsByDateRange,
  getLogsByStatus
};
