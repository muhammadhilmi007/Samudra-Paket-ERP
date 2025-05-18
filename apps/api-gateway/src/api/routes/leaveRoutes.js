/**
 * Leave Routes
 * API Gateway routes for the Leave Management Service
 */

const express = require('express');
const router = express.Router();
const { authenticateJWT, checkRole, cacheMiddleware } = require('../middlewares');
const attendanceServiceConfig = require('../../config/services/attendanceService');
const { createServiceProxy } = require('../../utils/proxyUtils');

// Create a proxy for the leave service (part of the attendance service)
const leaveProxy = createServiceProxy(
  attendanceServiceConfig.baseUrl,
  attendanceServiceConfig.circuitBreaker
);

// Leave routes
router.post('/request', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.requestLeave),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.requestLeave)
);

router.post('/:leaveId/approve-reject', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.approveOrRejectLeave),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.approveOrRejectLeave)
);

router.post('/:leaveId/cancel', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.cancelLeave),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.cancelLeave)
);

router.get('/employee/:employeeId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getEmployeeLeaves),
  cacheMiddleware(attendanceServiceConfig.cache.getEmployeeLeaves),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.getEmployeeLeaves)
);

router.get('/balance/:employeeId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getLeaveBalance),
  cacheMiddleware(attendanceServiceConfig.cache.getLeaveBalance),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.getLeaveBalance)
);

router.post('/balance/initialize', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.initializeLeaveBalance),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.initializeLeaveBalance)
);

router.post('/balance/:employeeId/adjust', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.adjustLeaveBalance),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.adjustLeaveBalance)
);

router.post('/accruals/calculate', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.calculateLeaveAccruals),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.calculateLeaveAccruals)
);

router.post('/carryover', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.processLeaveCarryover),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.processLeaveCarryover)
);

module.exports = router;
