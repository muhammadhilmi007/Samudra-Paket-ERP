/**
 * Attendance Routes
 * API routes for attendance management
 */

const express = require('express');
const router = express.Router();
const { attendanceController } = require('../controllers');
const { authenticate, authorize } = require('../middlewares');

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management endpoints
 */

/**
 * @swagger
 * /attendance/check-in:
 *   post:
 *     summary: Record employee check-in
 *     tags: [Attendance]
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
 *               - location
 *             properties:
 *               employeeId:
 *                 type: string
 *                 description: Employee ID
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: [longitude, latitude]
 *               device:
 *                 type: string
 *                 description: Device information
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *     responses:
 *       200:
 *         description: Check-in recorded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/check-in', 
  authenticate, 
  attendanceController.recordCheckIn
);

/**
 * @swagger
 * /attendance/check-out:
 *   post:
 *     summary: Record employee check-out
 *     tags: [Attendance]
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
 *               - location
 *             properties:
 *               employeeId:
 *                 type: string
 *                 description: Employee ID
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: [longitude, latitude]
 *               device:
 *                 type: string
 *                 description: Device information
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *     responses:
 *       200:
 *         description: Check-out recorded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/check-out', 
  authenticate, 
  attendanceController.recordCheckOut
);

/**
 * @swagger
 * /attendance/employee/{employeeId}:
 *   get:
 *     summary: Get attendance records for an employee
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PRESENT, ABSENT, LATE, HALF_DAY, EARLY_DEPARTURE, ON_LEAVE, HOLIDAY, WEEKEND]
 *         description: Attendance status for filtering
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/employee/:employeeId', 
  authenticate, 
  attendanceController.getEmployeeAttendance
);

/**
 * @swagger
 * /attendance/summary/{employeeId}:
 *   get:
 *     summary: Get attendance summary for an employee
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Attendance summary retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/summary/:employeeId', 
  authenticate, 
  attendanceController.getAttendanceSummary
);

/**
 * @swagger
 * /attendance/correction/{attendanceId}:
 *   post:
 *     summary: Request attendance correction
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for correction request
 *     responses:
 *       200:
 *         description: Attendance correction requested successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/correction/:attendanceId', 
  authenticate, 
  attendanceController.requestAttendanceCorrection
);

/**
 * @swagger
 * /attendance/correction/{attendanceId}/review:
 *   post:
 *     summary: Review attendance correction request
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *                 description: Review status
 *               reviewNotes:
 *                 type: string
 *                 description: Review notes
 *               correctedData:
 *                 type: object
 *                 description: Corrected attendance data (if approved)
 *     responses:
 *       200:
 *         description: Attendance correction reviewed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/correction/:attendanceId/review', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER', 'HR_STAFF']), 
  attendanceController.reviewAttendanceCorrection
);

/**
 * @swagger
 * /attendance/anomalies:
 *   get:
 *     summary: Get attendance anomalies
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *         description: Branch ID for filtering
 *       - in: query
 *         name: divisionId
 *         schema:
 *           type: string
 *         description: Division ID for filtering
 *       - in: query
 *         name: anomalyType
 *         schema:
 *           type: string
 *           enum: [isLate, isEarlyDeparture, isIncomplete, isOutsideGeofence]
 *         description: Anomaly type for filtering
 *     responses:
 *       200:
 *         description: Attendance anomalies retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/anomalies', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER', 'HR_STAFF', 'MANAGER']), 
  attendanceController.getAttendanceAnomalies
);

module.exports = router;
