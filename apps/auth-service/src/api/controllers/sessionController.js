/**
 * Session Controller
 * Handles session management requests
 */

const { sessionRepository, securityLogRepository } = require('../../infrastructure/repositories');

/**
 * Get all active sessions for a user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getUserSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get active sessions
    const sessions = await sessionRepository.findByUserId(userId);
    
    res.status(200).json({
      status: 'success',
      data: {
        sessions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke a specific session
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const revokeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    // Get session
    const session = await sessionRepository.findById(sessionId);
    
    // Check if session exists and belongs to user
    if (!session) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Session not found'
      });
    }
    
    // Check if session belongs to user or user is admin
    if (session.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You are not authorized to revoke this session'
      });
    }
    
    // Revoke session
    await sessionRepository.deleteSession(sessionId);
    
    // Log session revocation
    await securityLogRepository.createLog({
      userId,
      eventType: 'SESSION_REVOKED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { sessionId },
      status: 'SUCCESS'
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Session revoked successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke all sessions for a user except current
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const revokeAllSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const currentSessionId = req.sessionId;
    
    // Revoke all sessions except current
    await sessionRepository.deleteAllExcept(userId, currentSessionId);
    
    // Log session revocation
    await securityLogRepository.createLog({
      userId,
      eventType: 'ALL_SESSIONS_REVOKED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS'
    });
    
    res.status(200).json({
      status: 'success',
      message: 'All other sessions revoked successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all active sessions (admin only)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getAllSessions = async (req, res, next) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Get all active sessions
    const sessions = await sessionRepository.findAll({ skip, limit, sort });
    const total = await sessionRepository.countSessions();
    
    res.status(200).json({
      status: 'success',
      data: {
        sessions,
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
  getUserSessions,
  revokeSession,
  revokeAllSessions,
  getAllSessions
};
