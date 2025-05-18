/**
 * Employee Routes
 * Routes for employee management
 */

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const employeeHistoryController = require('../controllers/employeeHistoryController');
const { validateRequest } = require('../middlewares/validator');
const { employeeValidation } = require('../validators/employeeValidation');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management endpoints
 */

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authorize(['admin', 'manager']),
  validateRequest(employeeValidation.createEmployeeSchema),
  employeeController.createEmployee
);

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees with pagination and filtering
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by employee name
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by employee ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, ON_LEAVE, TERMINATED]
 *         description: Filter by status
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Filter by branch ID
 *       - in: query
 *         name: division
 *         schema:
 *           type: string
 *         description: Filter by division ID
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Filter by position ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/', authorize(['admin', 'manager', 'hr']), employeeController.getEmployees);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authorize(['admin', 'manager', 'hr']), employeeController.getEmployeeById);

/**
 * @swagger
 * /employees/employee-id/{employeeId}:
 *   get:
 *     summary: Get employee by employee ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID (not MongoDB ID)
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.get(
  '/employee-id/:employeeId',
  authorize(['admin', 'manager', 'hr']),
  employeeController.getEmployeeByEmployeeId
);

/**
 * @swagger
 * /employees/user/{userId}:
 *   get:
 *     summary: Get employee by user ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.get(
  '/user/:userId',
  authorize(['admin', 'manager', 'hr']),
  employeeController.getEmployeeByUserId
);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authorize(['admin', 'manager', 'hr']),
  validateRequest(employeeValidation.updateEmployeeSchema),
  employeeController.updateEmployee
);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authorize(['admin']), employeeController.deleteEmployee);

/**
 * @swagger
 * /employees/{id}/documents:
 *   post:
 *     summary: Add a document to an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       200:
 *         description: Document added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/documents',
  authorize(['admin', 'manager', 'hr']),
  validateRequest(employeeValidation.documentSchema),
  employeeController.addEmployeeDocument
);

/**
 * @swagger
 * /employees/{id}/documents/{documentId}:
 *   put:
 *     summary: Update a document for an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       200:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee or document not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id/documents/:documentId',
  authorize(['admin', 'manager', 'hr']),
  validateRequest(employeeValidation.documentSchema),
  employeeController.updateEmployeeDocument
);

/**
 * @swagger
 * /employees/{id}/documents/{documentId}/verify:
 *   patch:
 *     summary: Verify a document for an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       200:
 *         description: Document verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee or document not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/documents/:documentId/verify',
  authorize(['admin', 'manager', 'hr']),
  validateRequest(employeeValidation.documentVerificationSchema),
  employeeController.verifyEmployeeDocument
);

/**
 * @swagger
 * /employees/{id}/assignments:
 *   post:
 *     summary: Add an assignment to an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       200:
 *         description: Assignment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/assignments',
  authorize(['admin', 'manager']),
  validateRequest(employeeValidation.assignmentSchema),
  employeeController.addEmployeeAssignment
);


/**
 * @swagger
 * /employees/{id}/status:
 *   patch:
 *     summary: Update an employee's status
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *     responses:
 *       200:
 *         description: Employee status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/status',
  authorize(['admin', 'manager']),
  validateRequest(employeeValidation.statusUpdateSchema),
  employeeController.updateEmployeeStatus
);


/*
 * @swagger
 * /employees/{id}/link-user:
 *   patch:
 *     summary: Link an employee to a user account
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLink'
 *     responses:
 *       200:
 *         description: Employee linked to user account successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/link-user',
  authorize(['admin']),
  validateRequest(employeeValidation.userLinkSchema),
  employeeController.linkEmployeeToUser
);


/*
 * @swagger
 * /employees/{id}/skills:
 *   post:
 *     summary: Add a skill to an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Skill'
 *     responses:
 *       200:
 *         description: Skill added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/skills',
  authorize(['admin', 'manager', 'hr']),
  validateRequest(employeeValidation.skillSchema),
  employeeController.addEmployeeSkill
);


/*
 * @swagger
 * /employees/{id}/trainings:
 *   post:
 *     summary: Add a training to an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Training'
 *     responses:
 *       200:
 *         description: Training added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/trainings',
  authorize(['admin', 'manager', 'hr']),
  validateRequest(employeeValidation.trainingSchema),
  employeeController.addEmployeeTraining
);


/*
 * @swagger
 * /employees/{id}/performance-evaluations:
 *   post:
 *     summary: Add a performance evaluation to an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PerformanceEvaluation'
 *     responses:
 *       200:
 *         description: Performance evaluation added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/performance-evaluations',
  authorize(['admin', 'manager']),
  validateRequest(employeeValidation.performanceEvaluationSchema),
  employeeController.addEmployeePerformanceEvaluation
);


/*
 * @swagger
 * /employees/{id}/career-development:
 *   post:
 *     summary: Add career development to an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CareerDevelopment'
 *     responses:
 *       200:
 *         description: Career development added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/career-development',
  authorize(['admin', 'manager', 'hr']),
  validateRequest(employeeValidation.careerDevelopmentSchema),
  employeeController.addEmployeeCareerDevelopment
);


/*
 * @swagger
 * /employees/{id}/contracts:
 *   post:
 *     summary: Add a contract to an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contract'
 *     responses:
 *       200:
 *         description: Contract added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/contracts',
  authorize(['admin', 'manager', 'hr']),
  validateRequest(employeeValidation.contractSchema),
  employeeController.addEmployeeContract
);


/*
 * @swagger
 * /employees/{id}/history:
 *   get:
 *     summary: Get employee history
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeHistory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/history',
  authorize(['admin', 'manager', 'hr']),
  employeeController.getEmployeeHistory
);


/*
 * @swagger
 * /employees/history/employee/{employeeId}:
 *   get:
 *     summary: Get employee history by employee ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeHistory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.get(
  '/history/employee/:employeeId',
  authorize(['admin', 'manager', 'hr']),
  employeeHistoryController.getHistoryByEmployeeId
);

/*
 * @swagger
 * /employees/history/{id}:
 *   get:
 *     summary: Get employee history by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee history ID
 *     responses:
 *       200:
 *         description: Employee history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeHistory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee history not found
 *       500:
 *         description: Server error
 */
router.get(
  '/history/:id',
  authorize(['admin', 'manager', 'hr']),
  employeeHistoryController.getHistoryById
);

/*
 * @swagger
 * /employees/history/change-type/{changeType}:
 *   get:
 *     summary: Get employee history by change type
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: changeType
 *         required: true
 *         schema:
 *           type: string
 *         description: Change type
 *     responses:
 *       200:
 *         description: Employee history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeHistory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee history not found
 *       500:
 *         description: Server error
 */
router.get(
  '/history/change-type/:changeType',
  authorize(['admin', 'manager', 'hr']),
  employeeHistoryController.getHistoryByChangeType
);

/*
 * @swagger
 * /employees/history/date-range/{startDate}/{endDate}:
 *   get:
 *     summary: Get employee history by date range
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *         description: End date
 *     responses:
 *       200:
 *         description: Employee history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeHistory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee history not found
 *       500:
 *         description: Server error
 */
router.get(
  '/history/date-range/:startDate/:endDate',
  authorize(['admin', 'manager', 'hr']),
  employeeHistoryController.getHistoryByDateRange
);

/*
 * @swagger
 * /employees/history/user/{userId}:
 *   get:
 *     summary: Get employee history by user ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Employee history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeHistory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee history not found
 *       500:
 *         description: Server error
 */
router.get(
  '/history/user/:userId',
  authorize(['admin', 'manager', 'hr']),
  employeeHistoryController.getHistoryByUser
);

module.exports = router;
