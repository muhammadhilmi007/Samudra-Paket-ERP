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

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Employee attendance management endpoints
 */

/**
 * @swagger
 * /v1/attendance/check-in:
 *   post:
 *     summary: Record employee check-in
 *     tags: [Attendance]
 *     description: Records an employee's check-in time with optional geolocation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "emp-001"
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: -6.2088
 *                   longitude:
 *                     type: number
 *                     example: 106.8456
 *               notes:
 *                 type: string
 *                 example: "Working from office"
 *     responses:
 *       200:
 *         description: Check-in recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "att-001"
 *                     employeeId:
 *                       type: string
 *                       example: "emp-001"
 *                     checkInTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T10:00:00Z"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.post('/check-in', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.checkIn),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.checkIn)
);

/**
 * @swagger
 * /v1/attendance/check-out:
 *   post:
 *     summary: Record employee check-out
 *     tags: [Attendance]
 *     description: Records an employee's check-out time with optional geolocation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "emp-001"
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: -6.2088
 *                   longitude:
 *                     type: number
 *                     example: 106.8456
 *               notes:
 *                 type: string
 *                 example: "Completed daily tasks"
 *     responses:
 *       200:
 *         description: Check-out recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "att-001"
 *                     employeeId:
 *                       type: string
 *                       example: "emp-001"
 *                     checkInTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T10:00:00Z"
 *                     checkOutTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T18:00:00Z"
 *                     totalHours:
 *                       type: number
 *                       example: 8
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: No active check-in found for employee
 *       500:
 *         description: Internal server error
 */
router.post('/check-out', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.checkOut),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.checkOut)
);

/**
 * @swagger
 * /v1/attendance/employee/{employeeId}:
 *   get:
 *     summary: Get employee attendance records
 *     tags: [Attendance]
 *     description: Retrieves attendance records for a specific employee with filtering options
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *         example: emp-001
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *         example: 2025-05-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *         example: 2025-05-31
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "att-001"
 *                       employeeId:
 *                         type: string
 *                         example: "emp-001"
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-05-22"
 *                       checkInTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-22T10:00:00Z"
 *                       checkOutTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-22T18:00:00Z"
 *                       totalHours:
 *                         type: number
 *                         example: 8
 *                       status:
 *                         type: string
 *                         enum: [present, absent, late, half-day, leave]
 *                         example: "present"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 22
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     pages:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.get('/employee/:employeeId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getEmployeeAttendance),
  cacheMiddleware(attendanceServiceConfig.cache.getEmployeeAttendance),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.getEmployeeAttendance)
);

/**
 * @swagger
 * /v1/attendance/summary/{employeeId}:
 *   get:
 *     summary: Get employee attendance summary
 *     tags: [Attendance]
 *     description: Retrieves attendance summary statistics for a specific employee
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *         example: emp-001
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month number (1-12)
 *         example: 5
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2020
 *         description: Year
 *         example: 2025
 *     responses:
 *       200:
 *         description: Attendance summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     employeeId:
 *                       type: string
 *                       example: "emp-001"
 *                     period:
 *                       type: string
 *                       example: "May 2025"
 *                     workingDays:
 *                       type: integer
 *                       example: 22
 *                     present:
 *                       type: integer
 *                       example: 20
 *                     absent:
 *                       type: integer
 *                       example: 0
 *                     late:
 *                       type: integer
 *                       example: 2
 *                     leave:
 *                       type: integer
 *                       example: 0
 *                     totalWorkingHours:
 *                       type: number
 *                       example: 160
 *                     averageHoursPerDay:
 *                       type: number
 *                       example: 8
 *                     overtime:
 *                       type: number
 *                       example: 5
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.get('/summary/:employeeId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getAttendanceSummary),
  cacheMiddleware(attendanceServiceConfig.cache.getAttendanceSummary),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.getAttendanceSummary)
);

/**
 * @swagger
 * /v1/attendance/correction/{attendanceId}:
 *   post:
 *     summary: Request attendance record correction
 *     tags: [Attendance]
 *     description: Submit a request to correct an attendance record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance record ID
 *         example: att-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *               - requestedChanges
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Forgot to check in through the system"
 *               requestedChanges:
 *                 type: object
 *                 properties:
 *                   checkInTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-22T09:00:00Z"
 *                   checkOutTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-22T18:00:00Z"
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Supporting documents (optional)
 *     responses:
 *       200:
 *         description: Correction request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "corr-001"
 *                     attendanceId:
 *                       type: string
 *                       example: "att-001"
 *                     status:
 *                       type: string
 *                       enum: [pending, approved, rejected]
 *                       example: "pending"
 *                     submittedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T14:30:00Z"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Attendance record not found
 *       500:
 *         description: Internal server error
 */
router.post('/correction/:attendanceId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.requestAttendanceCorrection),
  (req, res, next) => attendanceProxy(req, res, next, attendanceServiceConfig.endpoints.requestAttendanceCorrection)
);

/**
 * @swagger
 * /v1/attendance/correction/{attendanceId}/review:
 *   post:
 *     summary: Review attendance correction request
 *     tags: [Attendance]
 *     description: Approve or reject an attendance correction request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance record ID
 *         example: att-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *                 example: "approve"
 *               comments:
 *                 type: string
 *                 example: "Verified with security logs"
 *     responses:
 *       200:
 *         description: Correction request reviewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "corr-001"
 *                     attendanceId:
 *                       type: string
 *                       example: "att-001"
 *                     status:
 *                       type: string
 *                       enum: [approved, rejected]
 *                       example: "approved"
 *                     reviewedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T16:30:00Z"
 *                     reviewedBy:
 *                       type: string
 *                       example: "user-001"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Correction request not found
 *       500:
 *         description: Internal server error
 */
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
