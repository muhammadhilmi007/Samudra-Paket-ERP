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

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: Work schedule and holiday management endpoints
 */

/**
 * @swagger
 * /v1/schedule/work-schedule:
 *   post:
 *     summary: Create a new work schedule
 *     tags: [Schedule]
 *     description: Create a new work schedule template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - scheduleType
 *               - workDays
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Standard Office Hours"
 *               description:
 *                 type: string
 *                 example: "Regular 9-5 office schedule"
 *               scheduleType:
 *                 type: string
 *                 enum: [fixed, shift, flexible]
 *                 example: "fixed"
 *               workDays:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *                       example: "monday"
 *                     isWorkDay:
 *                       type: boolean
 *                       example: true
 *                     startTime:
 *                       type: string
 *                       format: time
 *                       example: "09:00"
 *                     endTime:
 *                       type: string
 *                       format: time
 *                       example: "17:00"
 *                     breakDuration:
 *                       type: integer
 *                       example: 60
 *                       description: Break duration in minutes
 *               flexibleHours:
 *                 type: object
 *                 properties:
 *                   minHoursPerDay:
 *                     type: number
 *                     example: 7.5
 *                   minStartTime:
 *                     type: string
 *                     format: time
 *                     example: "07:00"
 *                   maxEndTime:
 *                     type: string
 *                     format: time
 *                     example: "19:00"
 *               effectiveFrom:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               effectiveTo:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *     responses:
 *       201:
 *         description: Work schedule created successfully
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
 *                       example: "sched-001"
 *                     name:
 *                       type: string
 *                       example: "Standard Office Hours"
 *                     scheduleType:
 *                       type: string
 *                       example: "fixed"
 *                     createdAt:
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
router.post('/work-schedule', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.createWorkSchedule),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.createWorkSchedule)
);

/**
 * @swagger
 * /v1/schedule/work-schedule/{scheduleId}:
 *   put:
 *     summary: Update a work schedule
 *     tags: [Schedule]
 *     description: Update an existing work schedule template
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Work schedule ID
 *         example: sched-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Office Hours"
 *               description:
 *                 type: string
 *                 example: "Updated 8-4 office schedule"
 *               scheduleType:
 *                 type: string
 *                 enum: [fixed, shift, flexible]
 *                 example: "fixed"
 *               workDays:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *                       example: "monday"
 *                     isWorkDay:
 *                       type: boolean
 *                       example: true
 *                     startTime:
 *                       type: string
 *                       format: time
 *                       example: "08:00"
 *                     endTime:
 *                       type: string
 *                       format: time
 *                       example: "16:00"
 *                     breakDuration:
 *                       type: integer
 *                       example: 60
 *                       description: Break duration in minutes
 *               flexibleHours:
 *                 type: object
 *                 properties:
 *                   minHoursPerDay:
 *                     type: number
 *                     example: 7.5
 *                   minStartTime:
 *                     type: string
 *                     format: time
 *                     example: "07:00"
 *                   maxEndTime:
 *                     type: string
 *                     format: time
 *                     example: "19:00"
 *               effectiveFrom:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               effectiveTo:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Work schedule updated successfully
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
 *                       example: "sched-001"
 *                     name:
 *                       type: string
 *                       example: "Updated Office Hours"
 *                     scheduleType:
 *                       type: string
 *                       example: "fixed"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T14:00:00Z"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Work schedule not found
 *       500:
 *         description: Internal server error
 */
router.put('/work-schedule/:scheduleId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.updateWorkSchedule),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.updateWorkSchedule)
);

/**
 * @swagger
 * /v1/schedule/work-schedule:
 *   get:
 *     summary: Get work schedules
 *     tags: [Schedule]
 *     description: Retrieve a list of work schedule templates with pagination and filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by schedule name
 *         example: Office
 *       - in: query
 *         name: scheduleType
 *         schema:
 *           type: string
 *           enum: [fixed, shift, flexible, all]
 *         description: Filter by schedule type
 *         example: fixed
 *       - in: query
 *         name: effectiveDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by schedules effective on this date
 *         example: 2025-06-15
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
 *         description: Work schedules retrieved successfully
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
 *                         example: "sched-001"
 *                       name:
 *                         type: string
 *                         example: "Standard Office Hours"
 *                       description:
 *                         type: string
 *                         example: "Regular 9-5 office schedule"
 *                       scheduleType:
 *                         type: string
 *                         enum: [fixed, shift, flexible]
 *                         example: "fixed"
 *                       effectiveFrom:
 *                         type: string
 *                         format: date
 *                         example: "2025-06-01"
 *                       effectiveTo:
 *                         type: string
 *                         format: date
 *                         example: "2025-12-31"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-22T10:00:00Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
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
 *       500:
 *         description: Internal server error
 */
router.get('/work-schedule', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getWorkSchedules),
  cacheMiddleware(attendanceServiceConfig.cache.getWorkSchedules),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.getWorkSchedules)
);

/**
 * @swagger
 * /v1/schedule/employee-schedule:
 *   post:
 *     summary: Assign schedule to employee
 *     tags: [Schedule]
 *     description: Assign a work schedule to an employee or group of employees
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *             properties:
 *               scheduleId:
 *                 type: string
 *                 example: "sched-001"
 *               employeeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["emp-001", "emp-002", "emp-003"]
 *               departmentId:
 *                 type: string
 *                 example: "dept-001"
 *               branchId:
 *                 type: string
 *                 example: "branch-001"
 *               effectiveFrom:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               effectiveTo:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               overrideExisting:
 *                 type: boolean
 *                 example: true
 *               notes:
 *                 type: string
 *                 example: "Standard schedule assignment for Q2 2025"
 *     responses:
 *       201:
 *         description: Schedule assigned successfully
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
 *                     assignmentId:
 *                       type: string
 *                       example: "assign-001"
 *                     scheduleId:
 *                       type: string
 *                       example: "sched-001"
 *                     assignedEmployees:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["emp-001", "emp-002", "emp-003"]
 *                     effectiveFrom:
 *                       type: string
 *                       format: date
 *                       example: "2025-06-01"
 *                     effectiveTo:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-31"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T10:00:00Z"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Schedule or employees not found
 *       409:
 *         description: Conflict with existing schedule assignments
 *       500:
 *         description: Internal server error
 */
router.post('/employee-schedule', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.assignEmployeeSchedule),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.assignEmployeeSchedule)
);

/**
 * @swagger
 * /v1/schedule/employee-schedule/{scheduleId}:
 *   put:
 *     summary: Update employee schedule assignment
 *     tags: [Schedule]
 *     description: Update an existing employee schedule assignment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule assignment ID
 *         example: assign-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduleId:
 *                 type: string
 *                 example: "sched-002"
 *               effectiveFrom:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               effectiveTo:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               notes:
 *                 type: string
 *                 example: "Updated schedule assignment for Q3 2025"
 *     responses:
 *       200:
 *         description: Schedule assignment updated successfully
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
 *                     assignmentId:
 *                       type: string
 *                       example: "assign-001"
 *                     scheduleId:
 *                       type: string
 *                       example: "sched-002"
 *                     effectiveFrom:
 *                       type: string
 *                       format: date
 *                       example: "2025-07-01"
 *                     effectiveTo:
 *                       type: string
 *                       format: date
 *                       example: "2025-12-31"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T14:00:00Z"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Schedule assignment not found
 *       500:
 *         description: Internal server error
 */
router.put('/employee-schedule/:scheduleId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.updateEmployeeSchedule),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.updateEmployeeSchedule)
);

/**
 * @swagger
 * /v1/schedule/employee-schedule:
 *   get:
 *     summary: Get employee schedules
 *     tags: [Schedule]
 *     description: Retrieve employee schedule assignments with filtering options
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by employee ID
 *         example: emp-001
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *         example: dept-001
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *         description: Filter by branch ID
 *         example: branch-001
 *       - in: query
 *         name: scheduleId
 *         schema:
 *           type: string
 *         description: Filter by schedule ID
 *         example: sched-001
 *       - in: query
 *         name: effectiveDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by schedules effective on this date
 *         example: 2025-06-15
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
 *         description: Employee schedules retrieved successfully
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
 *                         example: "assign-001"
 *                       employeeId:
 *                         type: string
 *                         example: "emp-001"
 *                       employeeName:
 *                         type: string
 *                         example: "John Doe"
 *                       scheduleId:
 *                         type: string
 *                         example: "sched-001"
 *                       scheduleName:
 *                         type: string
 *                         example: "Standard Office Hours"
 *                       effectiveFrom:
 *                         type: string
 *                         format: date
 *                         example: "2025-06-01"
 *                       effectiveTo:
 *                         type: string
 *                         format: date
 *                         example: "2025-12-31"
 *                       departmentId:
 *                         type: string
 *                         example: "dept-001"
 *                       departmentName:
 *                         type: string
 *                         example: "Operations"
 *                       branchId:
 *                         type: string
 *                         example: "branch-001"
 *                       branchName:
 *                         type: string
 *                         example: "Jakarta HQ"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-22T10:00:00Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     pages:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get('/employee-schedule', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.getEmployeeSchedules),
  cacheMiddleware(attendanceServiceConfig.cache.getEmployeeSchedules),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.getEmployeeSchedules)
);

/**
 * @swagger
 * /v1/schedule/holiday:
 *   post:
 *     summary: Create a new holiday
 *     tags: [Schedule]
 *     description: Create a new holiday entry in the system calendar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Independence Day"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-17"
 *               type:
 *                 type: string
 *                 enum: [national, religious, company]
 *                 example: "national"
 *               description:
 *                 type: string
 *                 example: "National Independence Day celebration"
 *               isRecurringYearly:
 *                 type: boolean
 *                 example: true
 *               applicableBranches:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["all"] # or specific branch IDs
 *     responses:
 *       201:
 *         description: Holiday created successfully
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
 *                       example: "holiday-001"
 *                     name:
 *                       type: string
 *                       example: "Independence Day"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-08-17"
 *                     type:
 *                       type: string
 *                       example: "national"
 *                     createdAt:
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
 *         description: Conflict - holiday already exists for this date
 *       500:
 *         description: Internal server error
 */
router.post('/holiday', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.createHoliday),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.createHoliday)
);

/**
 * @swagger
 * /v1/schedule/holiday/{holidayId}:
 *   put:
 *     summary: Update a holiday
 *     tags: [Schedule]
 *     description: Update an existing holiday entry in the system calendar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: holidayId
 *         required: true
 *         schema:
 *           type: string
 *         description: Holiday ID
 *         example: holiday-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Independence Day"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-17"
 *               type:
 *                 type: string
 *                 enum: [national, religious, company]
 *                 example: "national"
 *               description:
 *                 type: string
 *                 example: "Updated National Independence Day celebration"
 *               isRecurringYearly:
 *                 type: boolean
 *                 example: true
 *               applicableBranches:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["all"] # or specific branch IDs
 *     responses:
 *       200:
 *         description: Holiday updated successfully
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
 *                       example: "holiday-001"
 *                     name:
 *                       type: string
 *                       example: "Updated Independence Day"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-08-17"
 *                     type:
 *                       type: string
 *                       example: "national"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-22T14:00:00Z"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Holiday not found
 *       409:
 *         description: Conflict - another holiday already exists for this date
 *       500:
 *         description: Internal server error
 */
router.put('/holiday/:holidayId', 
  authenticateJWT, 
  checkRole(attendanceServiceConfig.roles.updateHoliday),
  (req, res, next) => scheduleProxy(req, res, next, attendanceServiceConfig.endpoints.updateHoliday)
);

/**
 * @swagger
 * /v1/schedule/holiday:
 *   get:
 *     summary: Get holidays
 *     tags: [Schedule]
 *     description: Retrieve a list of holidays with filtering options
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2020
 *         description: Filter by year
 *         example: 2025
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filter by month (1-12)
 *         example: 8
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [national, religious, company, all]
 *         description: Filter by holiday type
 *         example: national
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *         description: Filter by applicable branch
 *         example: branch-001
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
 *         description: Holidays retrieved successfully
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
 *                         example: "holiday-001"
 *                       name:
 *                         type: string
 *                         example: "Independence Day"
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-08-17"
 *                       type:
 *                         type: string
 *                         enum: [national, religious, company]
 *                         example: "national"
 *                       description:
 *                         type: string
 *                         example: "National Independence Day celebration"
 *                       isRecurringYearly:
 *                         type: boolean
 *                         example: true
 *                       applicableBranches:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["all"]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-22T10:00:00Z"
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
 *       500:
 *         description: Internal server error
 */
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
