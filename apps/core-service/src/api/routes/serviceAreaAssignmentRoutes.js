/**
 * Service Area Assignment Routes
 * API routes for service area assignment management
 */

const express = require('express');
const router = express.Router();
const serviceAreaController = require('../controllers/serviceAreaController');
const serviceAreaValidator = require('../validators/serviceAreaValidator');
const { authenticateJWT, authorizePermission } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /service-area-assignments:
 *   post:
 *     summary: Assign service area to branch
 *     tags: [Service Area Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceAreaId
 *               - branchId
 *               - priorityLevel
 *             properties:
 *               serviceAreaId:
 *                 type: string
 *                 description: Service area ID
 *               branchId:
 *                 type: string
 *                 description: Branch ID
 *               priorityLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Priority level (lower number = higher priority)
 *               notes:
 *                 type: string
 *                 description: Assignment notes
 *     responses:
 *       201:
 *         description: Service area assigned to branch successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service area or branch not found
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticateJWT,
  authorizePermission('service-area:assign'),
  serviceAreaValidator.validateServiceAreaAssignment,
  serviceAreaController.assignServiceAreaToBranch
);

/**
 * @swagger
 * /service-area-assignments/{id}:
 *   get:
 *     summary: Get service area assignment by ID
 *     tags: [Service Area Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Service area assignment details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticateJWT,
  authorizePermission('service-area:read'),
  serviceAreaController.getServiceAreaAssignment
);

/**
 * @swagger
 * /service-area-assignments/{id}:
 *   put:
 *     summary: Update service area assignment
 *     tags: [Service Area Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priorityLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Priority level (lower number = higher priority)
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 description: Assignment status
 *               notes:
 *                 type: string
 *                 description: Assignment notes
 *     responses:
 *       200:
 *         description: Service area assignment updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticateJWT,
  authorizePermission('service-area:update'),
  serviceAreaValidator.validateUpdateServiceAreaAssignment,
  serviceAreaController.updateServiceAreaAssignment
);

/**
 * @swagger
 * /service-area-assignments/{id}:
 *   delete:
 *     summary: Remove service area assignment
 *     tags: [Service Area Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *         description: Reason for removal
 *     responses:
 *       200:
 *         description: Service area assignment removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorizePermission('service-area:delete'),
  serviceAreaController.removeServiceAreaAssignment
);

/**
 * @swagger
 * /branches/{branchId}/service-areas:
 *   get:
 *     summary: List service areas assigned to a branch
 *     tags: [Service Area Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
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
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of service areas assigned to the branch
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.get(
  '/branches/:branchId/service-areas',
  authenticateJWT,
  authorizePermission('service-area:read'),
  serviceAreaController.listServiceAreasByBranch
);

/**
 * @swagger
 * /service-areas/{serviceAreaId}/branches:
 *   get:
 *     summary: List branches assigned to a service area
 *     tags: [Service Area Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceAreaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Service area ID
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
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of branches assigned to the service area
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service area not found
 *       500:
 *         description: Server error
 */
router.get(
  '/service-areas/:serviceAreaId/branches',
  authenticateJWT,
  authorizePermission('service-area:read'),
  serviceAreaController.listBranchesByServiceArea
);

module.exports = router;
