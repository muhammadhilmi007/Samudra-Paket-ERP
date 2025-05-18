/**
 * Schedule Routes
 * API routes for work schedule and holiday management
 */

const express = require('express');
const router = express.Router();
const { scheduleController } = require('../controllers');
const { authenticate, authorize } = require('../middlewares');

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: Work schedule and holiday management endpoints
 */

/**
 * @swagger
 * /schedule/work-schedule:
 *   post:
 *     summary: Create work schedule
 *     tags: [Schedule]
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
 *               - code
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Schedule name
 *               code:
 *                 type: string
 *                 description: Schedule code
 *               description:
 *                 type: string
 *                 description: Schedule description
 *               type:
 *                 type: string
 *                 enum: [REGULAR, SHIFT, FLEXIBLE, CUSTOM]
 *                 description: Schedule type
 *               workingDays:
 *                 type: object
 *                 description: Working days configuration
 *               workingHours:
 *                 type: object
 *                 description: Working hours configuration
 *               overtimeSettings:
 *                 type: object
 *                 description: Overtime settings
 *               flexibleSettings:
 *                 type: object
 *                 description: Flexible time settings
 *               geofencing:
 *                 type: object
 *                 description: Geofencing settings
 *               branches:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Applicable branch IDs
 *               divisions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Applicable division IDs
 *               positions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Applicable position IDs
 *               effectiveStartDate:
 *                 type: string
 *                 format: date
 *                 description: Effective start date
 *               effectiveEndDate:
 *                 type: string
 *                 format: date
 *                 description: Effective end date
 *     responses:
 *       201:
 *         description: Work schedule created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/work-schedule', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER']), 
  scheduleController.createWorkSchedule
);

/**
 * @swagger
 * /schedule/work-schedule/{scheduleId}:
 *   put:
 *     summary: Update work schedule
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Work schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [REGULAR, SHIFT, FLEXIBLE, CUSTOM]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *               workingDays:
 *                 type: object
 *               workingHours:
 *                 type: object
 *               overtimeSettings:
 *                 type: object
 *               flexibleSettings:
 *                 type: object
 *               geofencing:
 *                 type: object
 *               branches:
 *                 type: array
 *                 items:
 *                   type: string
 *               divisions:
 *                 type: array
 *                 items:
 *                   type: string
 *               positions:
 *                 type: array
 *                 items:
 *                   type: string
 *               effectiveStartDate:
 *                 type: string
 *                 format: date
 *               effectiveEndDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Work schedule updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/work-schedule/:scheduleId', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER']), 
  scheduleController.updateWorkSchedule
);

/**
 * @swagger
 * /schedule/work-schedule:
 *   get:
 *     summary: Get work schedules
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Status for filtering
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [REGULAR, SHIFT, FLEXIBLE, CUSTOM]
 *         description: Type for filtering
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
 *         name: positionId
 *         schema:
 *           type: string
 *         description: Position ID for filtering
 *       - in: query
 *         name: effectiveDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for filtering effective schedules
 *     responses:
 *       200:
 *         description: Work schedules retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/work-schedule', 
  authenticate, 
  scheduleController.getWorkSchedules
);

/**
 * @swagger
 * /schedule/employee-schedule:
 *   post:
 *     summary: Assign work schedule to employee
 *     tags: [Schedule]
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
 *               - scheduleId
 *               - effectiveStartDate
 *             properties:
 *               employeeId:
 *                 type: string
 *                 description: Employee ID
 *               scheduleId:
 *                 type: string
 *                 description: Work schedule ID
 *               effectiveStartDate:
 *                 type: string
 *                 format: date
 *                 description: Effective start date
 *               effectiveEndDate:
 *                 type: string
 *                 format: date
 *                 description: Effective end date
 *               shiftAssignments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     shiftCode:
 *                       type: string
 *                     notes:
 *                       type: string
 *                 description: Shift assignments for shift workers
 *               overrides:
 *                 type: object
 *                 description: Schedule overrides
 *     responses:
 *       201:
 *         description: Work schedule assigned to employee successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/employee-schedule', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER', 'HR_STAFF']), 
  scheduleController.assignEmployeeSchedule
);

/**
 * @swagger
 * /schedule/employee-schedule/{scheduleId}:
 *   put:
 *     summary: Update employee schedule
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               effectiveStartDate:
 *                 type: string
 *                 format: date
 *               effectiveEndDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *               shiftAssignments:
 *                 type: array
 *                 items:
 *                   type: object
 *               overrides:
 *                 type: object
 *               dateOverrides:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Employee schedule updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/employee-schedule/:scheduleId', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER', 'HR_STAFF']), 
  scheduleController.updateEmployeeSchedule
);

/**
 * @swagger
 * /schedule/employee-schedule:
 *   get:
 *     summary: Get employee schedules
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Employee ID for filtering
 *       - in: query
 *         name: scheduleId
 *         schema:
 *           type: string
 *         description: Work schedule ID for filtering
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Status for filtering
 *       - in: query
 *         name: effectiveDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for filtering effective schedules
 *     responses:
 *       200:
 *         description: Employee schedules retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/employee-schedule', 
  authenticate, 
  scheduleController.getEmployeeSchedules
);

/**
 * @swagger
 * /schedule/holiday:
 *   post:
 *     summary: Create holiday
 *     tags: [Schedule]
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Holiday name
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Holiday date
 *               type:
 *                 type: string
 *                 enum: [NATIONAL, RELIGIOUS, COMPANY, LOCAL, OTHER]
 *                 description: Holiday type
 *               description:
 *                 type: string
 *                 description: Holiday description
 *               isRecurring:
 *                 type: boolean
 *                 description: Whether the holiday recurs yearly
 *               isHalfDay:
 *                 type: boolean
 *                 description: Whether it's a half-day holiday
 *               halfDayPortion:
 *                 type: string
 *                 enum: [MORNING, AFTERNOON]
 *                 description: Which portion of the day for half-day holiday
 *               applicableBranches:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Applicable branch IDs
 *               applicableDivisions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Applicable division IDs
 *     responses:
 *       201:
 *         description: Holiday created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/holiday', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER']), 
  scheduleController.createHoliday
);

/**
 * @swagger
 * /schedule/holiday/{holidayId}:
 *   put:
 *     summary: Update holiday
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: holidayId
 *         required: true
 *         schema:
 *           type: string
 *         description: Holiday ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *                 enum: [NATIONAL, RELIGIOUS, COMPANY, LOCAL, OTHER]
 *               description:
 *                 type: string
 *               isRecurring:
 *                 type: boolean
 *               isHalfDay:
 *                 type: boolean
 *               halfDayPortion:
 *                 type: string
 *                 enum: [MORNING, AFTERNOON]
 *               applicableBranches:
 *                 type: array
 *                 items:
 *                   type: string
 *               applicableDivisions:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Holiday updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/holiday/:holidayId', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER']), 
  scheduleController.updateHoliday
);

/**
 * @swagger
 * /schedule/holiday:
 *   get:
 *     summary: Get holidays
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [NATIONAL, RELIGIOUS, COMPANY, LOCAL, OTHER]
 *         description: Holiday type for filtering
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Status for filtering
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
 *     responses:
 *       200:
 *         description: Holidays retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/holiday', 
  authenticate, 
  scheduleController.getHolidays
);

/**
 * @swagger
 * /schedule/holiday/generate-recurring:
 *   post:
 *     summary: Generate recurring holidays for a year
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *             properties:
 *               year:
 *                 type: integer
 *                 description: Year to generate holidays for
 *     responses:
 *       201:
 *         description: Recurring holidays generated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/holiday/generate-recurring', 
  authenticate, 
  authorize(['ADMIN', 'HR_MANAGER']), 
  scheduleController.generateRecurringHolidays
);

module.exports = router;
