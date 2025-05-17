/**
 * Security Log Routes
 * Handles security log endpoints
 */

const express = require('express');
const { securityLogController } = require('../controllers');
const { authenticateJWT, hasRole } = require('../middlewares');

const router = express.Router();

/**
 * @route GET /api/security-logs
 * @desc Get all security logs
 * @access Private (Admin only)
 */
router.get(
  '/',
  authenticateJWT,
  hasRole('admin'),
  securityLogController.getAllLogs
);

/**
 * @route GET /api/security-logs/user/:userId
 * @desc Get logs by user ID
 * @access Private (Admin, Manager, Self)
 */
router.get(
  '/user/:userId',
  authenticateJWT,
  (req, res, next) => {
    // Allow users to access their own logs
    if (req.user.id === req.params.userId || ['admin', 'manager'].includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({
      status: 'error',
      code: 'FORBIDDEN',
      message: 'Insufficient permissions'
    });
  },
  securityLogController.getLogsByUserId
);

/**
 * @route GET /api/security-logs/event/:eventType
 * @desc Get logs by event type
 * @access Private (Admin only)
 */
router.get(
  '/event/:eventType',
  authenticateJWT,
  hasRole('admin'),
  securityLogController.getLogsByEventType
);

/**
 * @route GET /api/security-logs/date-range
 * @desc Get logs by date range
 * @access Private (Admin only)
 */
router.get(
  '/date-range',
  authenticateJWT,
  hasRole('admin'),
  securityLogController.getLogsByDateRange
);

/**
 * @route GET /api/security-logs/status/:status
 * @desc Get logs by status
 * @access Private (Admin only)
 */
router.get(
  '/status/:status',
  authenticateJWT,
  hasRole('admin'),
  securityLogController.getLogsByStatus
);

module.exports = router;
