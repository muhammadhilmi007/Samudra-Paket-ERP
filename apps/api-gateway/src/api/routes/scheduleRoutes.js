/**
 * Schedule Routes
 * API Gateway routes for the Work Schedule and Holiday Management Service
 */

const express = require('express');
const router = express.Router();
const { authenticateJWT, checkRole, cacheMiddleware } = require('../middlewares');
const attendanceServiceConfig = require('../../config/services/attendanceService');
const { createServiceProxy } = require('../../utils/proxyUtils');

// Create a proxy for the schedule service (part of the attendance service)
const scheduleProxy = createServiceProxy(
  attendanceServiceConfig.baseUrl,
  attendanceServiceConfig.circuitBreaker
);

// Work Schedule routes
router.post('/work-schedule', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.createWorkSchedule),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.createWorkSchedule)
);

router.put('/work-schedule/:scheduleId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.updateWorkSchedule),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.updateWorkSchedule)
);

router.get('/work-schedule', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getWorkSchedules),
  cacheMiddleware(attendanceServiceConfig.cache.getWorkSchedules),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.getWorkSchedules)
);

// Employee Schedule routes
router.post('/employee-schedule', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.assignEmployeeSchedule),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.assignEmployeeSchedule)
);

router.put('/employee-schedule/:scheduleId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.updateEmployeeSchedule),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.updateEmployeeSchedule)
);

router.get('/employee-schedule', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getEmployeeSchedules),
  cacheMiddleware(attendanceServiceConfig.cache.getEmployeeSchedules),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.getEmployeeSchedules)
);

// Holiday routes
router.post('/holiday', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.createHoliday),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.createHoliday)
);

router.put('/holiday/:holidayId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.updateHoliday),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.updateHoliday)
);

router.get('/holiday', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getHolidays),
  cacheMiddleware(attendanceServiceConfig.cache.getHolidays),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.getHolidays)
);

router.post('/holiday/generate-recurring', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.generateRecurringHolidays),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.generateRecurringHolidays)
);

module.exports = router;
