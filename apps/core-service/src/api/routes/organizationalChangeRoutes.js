/**
 * Organizational Change Routes
 * API routes for tracking organizational changes
 */

const express = require('express');
const { organizationalChangeController } = require('../controllers');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validator');
const { organizationalChangeValidation } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /api/organizational-changes/entity/{entityType}/{entityId}:
 *   get:
 *     summary: Get changes for a specific entity
 *     tags: [OrganizationalChanges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [DIVISION, POSITION]
 *         description: Entity type
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Entity ID
 *       - in: query
 *         name: changeType
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE, TRANSFER, RESTRUCTURE]
 *         description: Filter by change type
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
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of changes for the entity
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/entity/:entityType/:entityId',
  authenticate,
  validateRequest(organizationalChangeValidation.getChangesByEntity),
  organizationalChangeController.getChangesByEntity
);

/**
 * @swagger
 * /api/organizational-changes/type/{changeType}:
 *   get:
 *     summary: Get changes by type
 *     tags: [OrganizationalChanges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: changeType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE, TRANSFER, RESTRUCTURE]
 *         description: Change type
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *           enum: [DIVISION, POSITION]
 *         description: Filter by entity type
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
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of changes by type
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/type/:changeType',
  authenticate,
  validateRequest(organizationalChangeValidation.getChangesByType),
  organizationalChangeController.getChangesByType
);

/**
 * @swagger
 * /api/organizational-changes/date-range/{startDate}/{endDate}:
 *   get:
 *     summary: Get changes in a date range
 *     tags: [OrganizationalChanges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *           enum: [DIVISION, POSITION]
 *         description: Filter by entity type
 *       - in: query
 *         name: changeType
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE, TRANSFER, RESTRUCTURE]
 *         description: Filter by change type
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
 *     responses:
 *       200:
 *         description: List of changes in the date range
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/date-range/:startDate/:endDate',
  authenticate,
  validateRequest(organizationalChangeValidation.getChangesByDateRange),
  organizationalChangeController.getChangesByDateRange
);

/**
 * @swagger
 * /api/organizational-changes/recent:
 *   get:
 *     summary: Get recent changes
 *     tags: [OrganizationalChanges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of changes to retrieve
 *     responses:
 *       200:
 *         description: List of recent changes
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/recent',
  authenticate,
  organizationalChangeController.getRecentChanges
);

/**
 * @swagger
 * /api/organizational-changes/{id}:
 *   get:
 *     summary: Get change by ID
 *     tags: [OrganizationalChanges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Change ID
 *     responses:
 *       200:
 *         description: Change details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Change not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticate,
  organizationalChangeController.getChangeById
);

/**
 * @swagger
 * /api/organizational-changes/search/{query}:
 *   get:
 *     summary: Search changes
 *     tags: [OrganizationalChanges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *           enum: [DIVISION, POSITION]
 *         description: Filter by entity type
 *       - in: query
 *         name: changeType
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE, TRANSFER, RESTRUCTURE]
 *         description: Filter by change type
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
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of matching changes
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/search/:query',
  authenticate,
  validateRequest(organizationalChangeValidation.searchChanges),
  organizationalChangeController.searchChanges
);

module.exports = router;
