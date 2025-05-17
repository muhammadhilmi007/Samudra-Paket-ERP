/**
 * Service Area Routes
 * API routes for service area management
 */

const express = require('express');
const router = express.Router();
const serviceAreaController = require('../controllers/serviceAreaController');
const serviceAreaValidator = require('../validators/serviceAreaValidator');
const { authenticateJWT, authorizePermission } = require('../middlewares/authMiddleware');

// Service Area CRUD Routes
/**
 * @swagger
 * /service-areas:
 *   post:
 *     summary: Create a new service area
 *     tags: [Service Areas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - geometry
 *             properties:
 *               code:
 *                 type: string
 *                 description: Unique code for the service area
 *               name:
 *                 type: string
 *                 description: Name of the service area
 *               description:
 *                 type: string
 *                 description: Description of the service area
 *               adminCode:
 *                 type: string
 *                 description: BPS administrative code
 *               adminLevel:
 *                 type: string
 *                 enum: [PROVINCE, CITY, DISTRICT, SUBDISTRICT]
 *                 description: Administrative level
 *               geometry:
 *                 type: object
 *                 description: GeoJSON geometry
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Polygon, MultiPolygon]
 *                   coordinates:
 *                     type: array
 *               center:
 *                 type: object
 *                 description: GeoJSON point for center
 *                 properties:
 *                   type:
 *                     type: string
 *                     default: Point
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *               areaType:
 *                 type: string
 *                 enum: [INNER_CITY, OUT_OF_CITY, REMOTE_AREA]
 *                 description: Type of area
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 default: ACTIVE
 *     responses:
 *       201:
 *         description: Service area created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticateJWT,
  authorizePermission('service-area:create'),
  serviceAreaValidator.validateCreateServiceArea,
  serviceAreaController.createServiceArea
);

/**
 * @swagger
 * /service-areas:
 *   get:
 *     summary: Get all service areas with pagination and filtering
 *     tags: [Service Areas]
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
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *       - in: query
 *         name: areaType
 *         schema:
 *           type: string
 *           enum: [INNER_CITY, OUT_OF_CITY, REMOTE_AREA]
 *         description: Filter by area type
 *       - in: query
 *         name: adminLevel
 *         schema:
 *           type: string
 *           enum: [PROVINCE, CITY, DISTRICT, SUBDISTRICT]
 *         description: Filter by admin level
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field and order (e.g., name:asc, createdAt:desc)
 *     responses:
 *       200:
 *         description: List of service areas
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticateJWT,
  authorizePermission('service-area:read'),
  serviceAreaController.listServiceAreas
);

/**
 * @swagger
 * /service-areas/{id}:
 *   get:
 *     summary: Get service area by ID
 *     tags: [Service Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service area ID
 *     responses:
 *       200:
 *         description: Service area details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service area not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticateJWT,
  authorizePermission('service-area:read'),
  serviceAreaController.getServiceArea
);

/**
 * @swagger
 * /service-areas/{id}:
 *   put:
 *     summary: Update service area by ID
 *     tags: [Service Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service area ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               adminCode:
 *                 type: string
 *               adminLevel:
 *                 type: string
 *                 enum: [PROVINCE, CITY, DISTRICT, SUBDISTRICT]
 *               geometry:
 *                 type: object
 *               center:
 *                 type: object
 *               areaType:
 *                 type: string
 *                 enum: [INNER_CITY, OUT_OF_CITY, REMOTE_AREA]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *               reason:
 *                 type: string
 *                 description: Reason for the update
 *     responses:
 *       200:
 *         description: Service area updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service area not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticateJWT,
  authorizePermission('service-area:update'),
  serviceAreaValidator.validateUpdateServiceArea,
  serviceAreaController.updateServiceArea
);

/**
 * @swagger
 * /service-areas/{id}:
 *   delete:
 *     summary: Delete service area by ID
 *     tags: [Service Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service area ID
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *         description: Reason for deletion
 *       - in: query
 *         name: force
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Force deletion even if there are dependencies
 *     responses:
 *       200:
 *         description: Service area deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service area not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorizePermission('service-area:delete'),
  serviceAreaController.deleteServiceArea
);

/**
 * @swagger
 * /service-areas/{id}/history:
 *   get:
 *     summary: Get service area history
 *     tags: [Service Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service area ID
 *     responses:
 *       200:
 *         description: Service area history
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service area not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/history',
  authenticateJWT,
  authorizePermission('service-area:read'),
  serviceAreaController.getServiceAreaHistory
);

module.exports = router;
