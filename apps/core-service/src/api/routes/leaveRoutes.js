/**
 * Leave Routes
 * API routes for leave management
 */

const express = require('express');
const router = express.Router();
const { leaveController } = require('../controllers');
const { authenticate, authorize } = require('../middlewares');

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Leave management endpoints
 */

/**
 * @swagger
 * /leave/request:
 *   post:
 *     summary: Request leave
 *     tags: [Leave]
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
 *               - type
 *               - startDate
 *               - endDate
 *               - reason
 *             properties:
 *               employeeId:
 *                 type: string
 *                 description: Employee ID
 *               type:
 *                 type: string
 *                 enum: [ANNUAL, SICK, MATERNITY, PATERNITY, BEREAVEMENT, UNPAID, RELIGIOUS, MARRIAGE, EMERGENCY, OTHER]
 *                 description: Leave type
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Start date of leave
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date of leave
 *               reason:
 *                 type: string
 *                 description: Reason for leave
 *               isHalfDay:
 *                 type: boolean
 *                 description: Whether it's a half-day leave
 *               halfDayPortion:
 *                 type: string
 *                 enum: [MORNING, AFTERNOON]
 *                 description: Which portion of the day for half-day leave
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fileUrl:
 *                       type: string
 *                     fileName:
 *                       type: string
 *                     fileType:
 *                       type: string
 *                 description: Supporting documents
 *     responses:
 *       201:
 *         description: Leave request submitted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/request', 
  authenticate, 
  leaveController.requestLeave
);

/**
 * @swagger
 * /leave/{leaveId}/approve-reject:
 *   post:
 *     summary: Approve or reject leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaveId
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - approverRole
 *               - approverName
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *                 description: Approval status
 *               notes:
 *                 type: string
 *                 description: Approval notes
 *               approverRole:
 *                 type: string
 *                 description: Role of the approver
 *               approverName:
 *                 type: string
 *                 description: Name of the approver
 *     responses:
 *       200:
 *         description: Leave request processed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/:leaveId/approve-reject', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER', 'MANAGER']), 
  leaveController.approveOrRejectLeave
);

/**
 * @swagger
 * /leave/{leaveId}/cancel:
 *   post:
 *     summary: Cancel leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaveId
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *     responses:
 *       200:
 *         description: Leave request cancelled successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/:leaveId/cancel', 
  authenticate, 
  leaveController.cancelLeave
);

/**
 * @swagger
 * /leave/employee/{employeeId}:
 *   get:
 *     summary: Get leave requests for an employee
 *     tags: [Leave]
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
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED]
 *         description: Status for filtering
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ANNUAL, SICK, MATERNITY, PATERNITY, BEREAVEMENT, UNPAID, RELIGIOUS, MARRIAGE, EMERGENCY, OTHER]
 *         description: Leave type for filtering
 *     responses:
 *       200:
 *         description: Leave requests retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/employee/:employeeId', 
  authenticate, 
  leaveController.getEmployeeLeaves
);

/**
 * @swagger
 * /leave/balance/{employeeId}:
 *   get:
 *     summary: Get leave balance for an employee
 *     tags: [Leave]
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
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year for balance (defaults to current year)
 *     responses:
 *       200:
 *         description: Leave balance retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/balance/:employeeId', 
  authenticate, 
  leaveController.getLeaveBalance
);

/**
 * @swagger
 * /leave/balance/initialize:
 *   post:
 *     summary: Initialize leave balance for an employee
 *     tags: [Leave]
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
 *               - balances
 *             properties:
 *               employeeId:
 *                 type: string
 *                 description: Employee ID
 *               year:
 *                 type: integer
 *                 description: Year for the balance
 *               balances:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - type
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [ANNUAL, SICK, MATERNITY, PATERNITY, BEREAVEMENT, UNPAID, RELIGIOUS, MARRIAGE, EMERGENCY, OTHER]
 *                     allocated:
 *                       type: number
 *                     additional:
 *                       type: number
 *                     carriedOver:
 *                       type: number
 *                     maxCarryOver:
 *                       type: number
 *               accrualSettings:
 *                 type: object
 *                 properties:
 *                   isMonthlyAccrual:
 *                     type: boolean
 *                   monthlyAccrualAmount:
 *                     type: number
 *                   maxAccrualLimit:
 *                     type: number
 *                   isProratedFirstYear:
 *                     type: boolean
 *     responses:
 *       201:
 *         description: Leave balance initialized successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/balance/initialize', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER', 'HR_STAFF']), 
  leaveController.initializeLeaveBalance
);

/**
 * @swagger
 * /leave/balance/{employeeId}/adjust:
 *   post:
 *     summary: Adjust leave balance
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - type
 *               - amount
 *               - reason
 *             properties:
 *               year:
 *                 type: integer
 *                 description: Year for the balance
 *               type:
 *                 type: string
 *                 enum: [ANNUAL, SICK, MATERNITY, PATERNITY, BEREAVEMENT, UNPAID, RELIGIOUS, MARRIAGE, EMERGENCY, OTHER]
 *                 description: Leave type
 *               amount:
 *                 type: number
 *                 description: Adjustment amount (positive or negative)
 *               reason:
 *                 type: string
 *                 description: Reason for adjustment
 *     responses:
 *       200:
 *         description: Leave balance adjusted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/balance/:employeeId/adjust', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER']), 
  leaveController.adjustLeaveBalance
);

/**
 * @swagger
 * /leave/accruals/calculate:
 *   post:
 *     summary: Calculate leave accruals
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Employee IDs (optional, all employees if not provided)
 *               calculateDate:
 *                 type: string
 *                 format: date
 *                 description: Date for calculation (defaults to current date)
 *     responses:
 *       200:
 *         description: Leave accruals calculated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/accruals/calculate', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER']), 
  leaveController.calculateLeaveAccruals
);

/**
 * @swagger
 * /leave/carryover:
 *   post:
 *     summary: Process year-end leave carryover
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromYear
 *               - toYear
 *             properties:
 *               fromYear:
 *                 type: integer
 *                 description: Source year
 *               toYear:
 *                 type: integer
 *                 description: Target year
 *               employeeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Employee IDs (optional, all employees if not provided)
 *     responses:
 *       200:
 *         description: Leave carryover processed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/carryover', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER']), 
  leaveController.processLeaveCarryover
);

module.exports = router;
