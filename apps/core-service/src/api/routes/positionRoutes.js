/**
 * Position Routes
 * API routes for position management
 */

const express = require('express');
const { positionController } = require('../controllers');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validator');
const { positionValidation } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /positions:
 *   post:
 *     summary: Create a new position
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PositionInput'
 *     responses:
 *       201:
 *         description: Position created successfully
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
  authorize(['admin', 'manager', 'hr']),
  validateRequest(positionValidation.createPosition),
  positionController.createPosition
);

/**
 * @swagger
 * /positions:
 *   get:
 *     summary: List positions with pagination and filtering
 *     tags: [Positions]
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
 *         name: division
 *         schema:
 *           type: string
 *         description: Filter by division
 *       - in: query
 *         name: reportTo
 *         schema:
 *           type: string
 *         description: Filter by reporting position
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
 *         description: List of positions
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticate,
  positionController.listPositions
);

/**
 * @swagger
 * /positions/organization-chart:
 *   get:
 *     summary: Get organization chart
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organization chart
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/organization-chart',
  authenticate,
  positionController.getOrganizationChart
);

/**
 * @swagger
 * /api/positions/division/{divisionId}:
 *   get:
 *     summary: Get positions by division
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: divisionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Division ID
 *     responses:
 *       200:
 *         description: Positions in the division
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Division not found
 *       500:
 *         description: Server error
 */
router.get(
  '/division/:divisionId',
  authenticate,
  positionController.getPositionsByDivision
);

/**
 * @swagger
 * /api/positions/{id}:
 *   get:
 *     summary: Get a position by ID
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Position ID
 *     responses:
 *       200:
 *         description: Position details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticate,
  positionController.getPositionById
);

/**
 * @swagger
 * /api/positions/code/{code}:
 *   get:
 *     summary: Get a position by code
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Position code
 *     responses:
 *       200:
 *         description: Position details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.get(
  '/code/:code',
  authenticate,
  positionController.getPositionByCode
);

/**
 * @swagger
 * /api/positions/{id}/reporting:
 *   get:
 *     summary: Get positions reporting to a position
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Position ID
 *     responses:
 *       200:
 *         description: Reporting positions
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/reporting',
  authenticate,
  positionController.getReportingPositions
);

/**
 * @swagger
 * /api/positions/{id}/reporting-chain:
 *   get:
 *     summary: Get reporting chain for a position
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Position ID
 *     responses:
 *       200:
 *         description: Reporting chain
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/reporting-chain',
  authenticate,
  positionController.getReportingChain
);

/**
 * @swagger
 * /api/positions/{id}:
 *   put:
 *     summary: Update a position
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Position ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PositionUpdate'
 *     responses:
 *       200:
 *         description: Position updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'manager', 'hr']),
  validateRequest(positionValidation.updatePosition),
  positionController.updatePosition
);

/**
 * @swagger
 * /api/positions/{id}:
 *   delete:
 *     summary: Delete a position
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Position ID
 *     responses:
 *       200:
 *         description: Position deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticate,
  authorize(['admin', 'hr']),
  positionController.deletePosition
);

/**
 * @swagger
 * /api/positions/{id}/status:
 *   patch:
 *     summary: Change position status
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Position ID
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
 *         description: Position status changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize(['admin', 'manager', 'hr']),
  validateRequest(positionValidation.changePositionStatus),
  positionController.changePositionStatus
);

/**
 * @swagger
 * /api/positions/{id}/requirements:
 *   patch:
 *     summary: Update position requirements
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Position ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PositionRequirements'
 *     responses:
 *       200:
 *         description: Position requirements updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/requirements',
  authenticate,
  authorize(['admin', 'manager', 'hr']),
  validateRequest(positionValidation.updatePositionRequirements),
  positionController.updatePositionRequirements
);

/**
 * @swagger
 * /api/positions/{id}/compensation:
 *   patch:
 *     summary: Update position compensation
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Position ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PositionCompensation'
 *     responses:
 *       200:
 *         description: Position compensation updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/compensation',
  authenticate,
  authorize(['admin', 'hr', 'finance']),
  validateRequest(positionValidation.updatePositionCompensation),
  positionController.updatePositionCompensation
);

/**
 * @swagger
 * /api/positions/{id}/responsibilities:
 *   patch:
 *     summary: Update position responsibilities
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Position ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - responsibilities
 *             properties:
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Position responsibilities updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/responsibilities',
  authenticate,
  authorize(['admin', 'manager', 'hr']),
  validateRequest(positionValidation.updatePositionResponsibilities),
  positionController.updatePositionResponsibilities
);

/**
 * @swagger
 * /api/positions/{id}/transfer:
 *   patch:
 *     summary: Transfer position to another division
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Position ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - divisionId
 *             properties:
 *               divisionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Position transferred successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/transfer',
  authenticate,
  authorize(['admin', 'hr']),
  validateRequest(positionValidation.transferPositionToDivision),
  positionController.transferPositionToDivision
);

module.exports = router;
