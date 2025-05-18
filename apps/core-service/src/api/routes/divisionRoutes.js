/**
 * Division Routes
 * API routes for division management
 */

const express = require('express');
const { divisionController } = require('../controllers');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validator');
const { divisionValidation } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /divisions:
 *   post:
 *     summary: Create a new division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DivisionInput'
 *     responses:
 *       201:
 *         description: Division created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticate,
  authorize(['admin', 'manager']),
  validateRequest(divisionValidation.createDivision),
  divisionController.createDivision
);

/**
 * @swagger
 * /divisions:
 *   get:
 *     summary: List divisions with pagination and filtering
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: parent
 *         schema:
 *           type: string
 *         description: Filter by parent division
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Filter by branch
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *         description: Filter by hierarchy level
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, code, or description
 *     responses:
 *       200:
 *         description: List of divisions
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticate,
  divisionController.listDivisions
);

/**
 * @swagger
 * /divisions/hierarchy:
 *   get:
 *     summary: Get division hierarchy
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Division hierarchy
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/hierarchy',
  authenticate,
  divisionController.getDivisionHierarchy
);

/**
 * @swagger
 * /api/divisions/branch/{branchId}:
 *   get:
 *     summary: Get divisions by branch
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Divisions in the branch
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/branch/:branchId',
  authenticate,
  divisionController.getDivisionsByBranch
);

/**
 * @swagger
 * /api/divisions/{id}:
 *   get:
 *     summary: Get a division by ID
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Division ID
 *     responses:
 *       200:
 *         description: Division details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticate,
  divisionController.getDivisionById
);

/**
 * @swagger
 * /api/divisions/code/{code}:
 *   get:
 *     summary: Get a division by code
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Division code
 *     responses:
 *       200:
 *         description: Division details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.get(
  '/code/:code',
  authenticate,
  divisionController.getDivisionByCode
);

/**
 * @swagger
 * /api/divisions/{id}/children:
 *   get:
 *     summary: Get child divisions
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent division ID
 *     responses:
 *       200:
 *         description: Child divisions
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/children',
  authenticate,
  divisionController.getChildDivisions
);

/**
 * @swagger
 * /api/divisions/{id}/descendants:
 *   get:
 *     summary: Get all descendant divisions
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ancestor division ID
 *     responses:
 *       200:
 *         description: Descendant divisions
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/descendants',
  authenticate,
  divisionController.getDescendantDivisions
);

/**
 * @swagger
 * /api/divisions/{id}:
 *   put:
 *     summary: Update a division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Division ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DivisionUpdate'
 *     responses:
 *       200:
 *         description: Division updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'manager']),
  validateRequest(divisionValidation.updateDivision),
  divisionController.updateDivision
);

/**
 * @swagger
 * /api/divisions/{id}:
 *   delete:
 *     summary: Delete a division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Division ID
 *     responses:
 *       200:
 *         description: Division deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  divisionController.deleteDivision
);

/**
 * @swagger
 * /api/divisions/{id}/status:
 *   patch:
 *     summary: Change division status
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Division ID
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
 *                 enum: [ACTIVE, INACTIVE, PENDING, ARCHIVED]
 *     responses:
 *       200:
 *         description: Division status changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize(['admin', 'manager']),
  validateRequest(divisionValidation.changeDivisionStatus),
  divisionController.changeDivisionStatus
);

/**
 * @swagger
 * /api/divisions/{id}/budget:
 *   patch:
 *     summary: Update division budget
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Division ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DivisionBudget'
 *     responses:
 *       200:
 *         description: Division budget updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/budget',
  authenticate,
  authorize(['admin', 'manager', 'finance']),
  validateRequest(divisionValidation.updateDivisionBudget),
  divisionController.updateDivisionBudget
);

/**
 * @swagger
 * /api/divisions/{id}/metrics:
 *   patch:
 *     summary: Update division metrics
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Division ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Division metrics updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/metrics',
  authenticate,
  authorize(['admin', 'manager']),
  divisionController.updateDivisionMetrics
);

/**
 * @swagger
 * /api/divisions/{id}/transfer:
 *   patch:
 *     summary: Transfer division to another branch
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Division ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - branchId
 *             properties:
 *               branchId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Division transferred successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/transfer',
  authenticate,
  authorize(['admin']),
  validateRequest(divisionValidation.transferDivisionToBranch),
  divisionController.transferDivisionToBranch
);

module.exports = router;
