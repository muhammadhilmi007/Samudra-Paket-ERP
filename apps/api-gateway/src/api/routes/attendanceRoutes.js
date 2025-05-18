/**
 * Attendance Routes
 * API Gateway routes for the Attendance Service
 */

const express = require('express');
const router = express.Router();
const { authenticateJWT, checkRole, cacheMiddleware } = require('../middlewares');
const attendanceServiceConfig = require('../../config/services/attendanceService');
const { createServiceProxy } = require('../../utils/proxyUtils');

// Create a proxy for the attendance service
const attendanceProxy = createServiceProxy(
  attendanceServiceConfig.baseUrl,
  attendanceServiceConfig.circuitBreaker
);

// Attendance routes
router.post('/check-in', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.checkIn),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.checkIn)
);

router.post('/check-out', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.checkOut),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.checkOut)
);

router.get('/employee/:employeeId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getEmployeeAttendance),
  cacheMiddleware(attendanceServiceConfig.cache.getEmployeeAttendance),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.getEmployeeAttendance)
);

router.get('/summary/:employeeId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getAttendanceSummary),
  cacheMiddleware(attendanceServiceConfig.cache.getAttendanceSummary),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.getAttendanceSummary)
);

router.post('/correction/:attendanceId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.requestAttendanceCorrection),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.requestAttendanceCorrection)
);

router.post('/correction/:attendanceId/review', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.reviewAttendanceCorrection),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.reviewAttendanceCorrection)
);

router.get('/anomalies', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getAttendanceAnomalies),
  cacheMiddleware(attendanceServiceConfig.cache.getAttendanceAnomalies),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.getAttendanceAnomalies)
);

module.exports = router;
