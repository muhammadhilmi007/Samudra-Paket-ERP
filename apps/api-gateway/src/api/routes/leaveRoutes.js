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

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Employee leave management endpoints
 */

/**
 * @swagger
 * /v1/leave/request:
 *   post:
 *     summary: Submit a leave request
 *     tags: [Leave]
 *     description: Submit a new leave request for an employee
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
 *               - leaveType
 *               - startDate
 *               - endDate
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "emp-001"
 *               leaveType:
 *                 type: string
 *                 enum: [annual, sick, maternity, paternity, unpaid, bereavement]
 *                 example: "annual"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-05"
 *               reason:
 *                 type: string
 *                 example: "Family vacation"
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Supporting documents (required for sick leave)
 *     responses:
 *       201:
 *         description: Leave request submitted successfully
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
 *                       example: "leave-001"
 *                     employeeId:
 *                       type: string
 *                       example: "emp-001"
 *                     leaveType:
 *                       type: string
 *                       example: "annual"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-06-01"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-06-05"
 *                     status:
 *                       type: string
 *                       enum: [pending, approved, rejected, cancelled]
 *                       example: "pending"
 *                     totalDays:
 *                       type: number
 *                       example: 5
 *                     submittedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T10:00:00Z"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       409:
 *         description: Conflict - insufficient leave balance or overlapping leave
 *       500:
 *         description: Internal server error
 */
router.post('/request', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.requestLeave),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.requestLeave)
);

/**
 * @swagger
 * /v1/leave/{leaveId}/approve-reject:
 *   post:
 *     summary: Approve or reject a leave request
 *     tags: [Leave]
 *     description: Approve or reject a pending leave request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaveId
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave request ID
 *         example: leave-001
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
 *                 example: "Approved as per leave policy"
 *     responses:
 *       200:
 *         description: Leave request processed successfully
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
 *                       example: "leave-001"
 *                     status:
 *                       type: string
 *                       enum: [approved, rejected]
 *                       example: "approved"
 *                     processedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T14:30:00Z"
 *                     processedBy:
 *                       type: string
 *                       example: "user-001"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Leave request not found
 *       409:
 *         description: Conflict - leave request is not in pending state
 *       500:
 *         description: Internal server error
 */
router.post('/:leaveId/approve-reject', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.approveOrRejectLeave),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.approveOrRejectLeave)
);

/**
 * @swagger
 * /v1/leave/{leaveId}/cancel:
 *   post:
 *     summary: Cancel a leave request
 *     tags: [Leave]
 *     description: Cancel a previously submitted leave request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaveId
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave request ID
 *         example: leave-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Changed travel plans"
 *     responses:
 *       200:
 *         description: Leave request cancelled successfully
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
 *                       example: "leave-001"
 *                     status:
 *                       type: string
 *                       example: "cancelled"
 *                     cancelledAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T15:30:00Z"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Leave request not found
 *       409:
 *         description: Conflict - leave cannot be cancelled (e.g., already started)
 *       500:
 *         description: Internal server error
 */
router.post('/:leaveId/cancel', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.cancelLeave),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.cancelLeave)
);

/**
 * @swagger
 * /v1/leave/employee/{employeeId}:
 *   get:
 *     summary: Get employee leave records
 *     tags: [Leave]
 *     description: Retrieves leave records for a specific employee with filtering options
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, cancelled, all]
 *         description: Filter by leave status
 *         example: approved
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *         example: 2025-01-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *         example: 2025-12-31
 *       - in: query
 *         name: leaveType
 *         schema:
 *           type: string
 *           enum: [annual, sick, maternity, paternity, unpaid, bereavement, all]
 *         description: Filter by leave type
 *         example: annual
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
 *         description: Leave records retrieved successfully
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
 *                         example: "leave-001"
 *                       employeeId:
 *                         type: string
 *                         example: "emp-001"
 *                       leaveType:
 *                         type: string
 *                         example: "annual"
 *                       startDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-06-01"
 *                       endDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-06-05"
 *                       totalDays:
 *                         type: number
 *                         example: 5
 *                       status:
 *                         type: string
 *                         enum: [pending, approved, rejected, cancelled]
 *                         example: "approved"
 *                       reason:
 *                         type: string
 *                         example: "Family vacation"
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-15T10:00:00Z"
 *                       processedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-16T14:30:00Z"
 *                       processedBy:
 *                         type: string
 *                         example: "user-001"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 15
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     pages:
 *                       type: integer
 *                       example: 1
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
  checkRole(attendanceServiceConfig.roles.getEmployeeLeaves),
  cacheMiddleware(attendanceServiceConfig.cache.getEmployeeLeaves),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.getEmployeeLeaves)
);

/**
 * @swagger
 * /v1/leave/balance/{employeeId}:
 *   get:
 *     summary: Get employee leave balance
 *     tags: [Leave]
 *     description: Retrieves the current leave balance for a specific employee
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
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2020
 *         description: Year for leave balance
 *         example: 2025
 *     responses:
 *       200:
 *         description: Leave balance retrieved successfully
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
 *                     year:
 *                       type: integer
 *                       example: 2025
 *                     leaveBalances:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           leaveType:
 *                             type: string
 *                             example: "annual"
 *                           entitled:
 *                             type: number
 *                             example: 14
 *                           taken:
 *                             type: number
 *                             example: 5
 *                           pending:
 *                             type: number
 *                             example: 2
 *                           remaining:
 *                             type: number
 *                             example: 7
 *                           carryOver:
 *                             type: number
 *                             example: 0
 *                           expires:
 *                             type: string
 *                             format: date
 *                             example: "2025-12-31"
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
router.get('/balance/:employeeId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getLeaveBalance),
  cacheMiddleware(attendanceServiceConfig.cache.getLeaveBalance),
  (req, res, next) => leaveProxy(req, res, next, attendanceServiceConfig.endpoints.getLeaveBalance)
);

/**
 * @swagger
 * /v1/leave/balance/initialize:
 *   post:
 *     summary: Initialize employee leave balance
 *     tags: [Leave]
 *     description: Initialize or reset leave balance for an employee
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
 *               - year
 *               - leaveBalances
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "emp-001"
 *               year:
 *                 type: integer
 *                 minimum: 2020
 *                 example: 2025
 *               leaveBalances:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - leaveType
 *                     - entitled
 *                   properties:
 *                     leaveType:
 *                       type: string
 *                       enum: [annual, sick, maternity, paternity, unpaid, bereavement]
 *                       example: "annual"
 *                     entitled:
 *                       type: number
 *                       minimum: 0
 *                       example: 14
 *                     carryOver:
 *                       type: number
 *                       minimum: 0
 *                       example: 0
 *                     expires:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Leave balance initialized successfully
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
 *                     year:
 *                       type: integer
 *                       example: 2025
 *                     leaveBalances:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           leaveType:
 *                             type: string
 *                             example: "annual"
 *                           entitled:
 *                             type: number
 *                             example: 14
 *                           taken:
 *                             type: number
 *                             example: 0
 *                           pending:
 *                             type: number
 *                             example: 0
 *                           remaining:
 *                             type: number
 *                             example: 14
 *                           carryOver:
 *                             type: number
 *                             example: 0
 *                           expires:
 *                             type: string
 *                             format: date
 *                             example: "2025-12-31"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Employee not found
 *       409:
 *         description: Conflict - leave balance already exists
 *       500:
 *         description: Internal server error
 */
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
