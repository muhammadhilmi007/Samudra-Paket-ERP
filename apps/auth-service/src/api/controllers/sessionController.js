/**
 * Session Controller
 * Handles session management requests
 */

const { sessionRepository, securityLogRepository } = require('../../infrastructure/repositories');
const { logger, successResponse, errorResponse } = require('../../utils');
const { Session } = require('../../domain/models');

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
    logger.error(`Error getting user sessions: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to get user sessions'));
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
    logger.error(`Error revoking session: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to revoke session'));
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
    logger.error(`Error revoking all sessions: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to revoke all sessions'));
  }
};

/**
 * Get all sessions (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
/**
 * Get all sessions with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getAllSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    
    let sessions, total;
    
    if (userId) {
      // For specific user, get all sessions first (filtered by repository)
      const allSessions = await sessionRepository.findByUserId(userId, true);
      total = allSessions.length;
      
      // Apply pagination manually
      sessions = allSessions
        .sort((a, b) => b.createdAt - a.createdAt) // Sort by newest first
        .slice(skip, skip + limitNum);
    } else {
      // For all sessions, use direct MongoDB query with pagination
      const query = {};
      [sessions, total] = await Promise.all([
        Session.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Session.countDocuments(query)
      ]);
    }
    
    return res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    logger.error('Error getting sessions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve sessions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getUserSessions,
  revokeSession,
  revokeAllSessions,
  getAllSessions
};
