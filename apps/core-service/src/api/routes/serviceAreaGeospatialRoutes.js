/**
 * Service Area Geospatial Routes
 * API routes for service area geospatial operations
 */

const express = require('express');
const router = express.Router();
const serviceAreaController = require('../controllers/serviceAreaController');
const serviceAreaValidator = require('../validators/serviceAreaValidator');
const { authenticateJWT, authorizePermission } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /service-areas/geospatial/find-by-location:
 *   post:
 *     summary: Find service areas by location
 *     tags: [Service Area Geospatial]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longitude
 *               - latitude
 *             properties:
 *               longitude:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 description: Longitude coordinate
 *               latitude:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 description: Latitude coordinate
 *               searchType:
 *                 type: string
 *                 enum: [contains, near, polygon]
 *                 default: contains
 *                 description: Type of search
 *               maxDistance:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum distance in meters (for 'near' search)
 *               polygon:
 *                 type: object
 *                 description: GeoJSON polygon (for 'polygon' search)
 *     responses:
 *       200:
 *         description: Service areas matching the search criteria
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/find-by-location',
  authenticateJWT,
  authorizePermission('service-area:read'),
  serviceAreaValidator.validateFindByLocation,
  serviceAreaController.findServiceAreasByLocation
);

/**
 * @swagger
 * /service-areas/geospatial/find-branches-by-location:
 *   post:
 *     summary: Find branches serving a location
 *     tags: [Service Area Geospatial]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longitude
 *               - latitude
 *             properties:
 *               longitude:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 description: Longitude coordinate
 *               latitude:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 description: Latitude coordinate
 *     responses:
 *       200:
 *         description: Branches serving the location
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/find-branches-by-location',
  authenticateJWT,
  authorizePermission('service-area:read'),
  serviceAreaValidator.validateFindByLocation,
  serviceAreaController.findBranchesServingLocation
);

module.exports = router;
