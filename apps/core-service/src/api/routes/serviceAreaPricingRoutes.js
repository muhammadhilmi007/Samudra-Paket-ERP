/**
 * Service Area Pricing Routes
 * API routes for service area pricing management
 */

const express = require('express');
const router = express.Router();
const serviceAreaController = require('../controllers/serviceAreaController');
const serviceAreaValidator = require('../validators/serviceAreaValidator');
const { authenticateJWT, authorizePermission } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /service-area-pricing:
 *   post:
 *     summary: Create a new pricing configuration for a service area
 *     tags: [Service Area Pricing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceArea
 *               - serviceType
 *               - basePrice
 *               - pricePerKm
 *               - pricePerKg
 *               - minCharge
 *             properties:
 *               serviceArea:
 *                 type: string
 *                 description: Service area ID
 *               serviceType:
 *                 type: string
 *                 enum: [REGULAR, EXPRESS, SAME_DAY, NEXT_DAY, ECONOMY]
 *                 description: Service type
 *               basePrice:
 *                 type: number
 *                 minimum: 0
 *                 description: Base price
 *               pricePerKm:
 *                 type: number
 *                 minimum: 0
 *                 description: Price per kilometer
 *               pricePerKg:
 *                 type: number
 *                 minimum: 0
 *                 description: Price per kilogram
 *               minCharge:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum charge
 *               maxCharge:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum charge
 *               insuranceFee:
 *                 type: number
 *                 minimum: 0
 *                 default: 0
 *                 description: Insurance fee
 *               packagingFee:
 *                 type: number
 *                 minimum: 0
 *                 default: 0
 *                 description: Packaging fee
 *               effectiveFrom:
 *                 type: string
 *                 format: date-time
 *                 description: Effective from date
 *               effectiveTo:
 *                 type: string
 *                 format: date-time
 *                 description: Effective to date
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 default: ACTIVE
 *                 description: Status
 *     responses:
 *       201:
 *         description: Pricing configuration created successfully
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
router.post(
  '/',
  authenticateJWT,
  authorizePermission('service-area:pricing:create'),
  serviceAreaValidator.validateServiceAreaPricing,
  serviceAreaController.createServiceAreaPricing
);

/**
 * @swagger
 * /service-area-pricing/{id}:
 *   get:
 *     summary: Get pricing configuration by ID
 *     tags: [Service Area Pricing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pricing configuration ID
 *     responses:
 *       200:
 *         description: Pricing configuration details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pricing configuration not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticateJWT,
  authorizePermission('service-area:pricing:read'),
  serviceAreaController.getServiceAreaPricing
);

/**
 * @swagger
 * /service-area-pricing/{id}:
 *   put:
 *     summary: Update pricing configuration
 *     tags: [Service Area Pricing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pricing configuration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basePrice:
 *                 type: number
 *                 minimum: 0
 *                 description: Base price
 *               pricePerKm:
 *                 type: number
 *                 minimum: 0
 *                 description: Price per kilometer
 *               pricePerKg:
 *                 type: number
 *                 minimum: 0
 *                 description: Price per kilogram
 *               minCharge:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum charge
 *               maxCharge:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum charge
 *               insuranceFee:
 *                 type: number
 *                 minimum: 0
 *                 description: Insurance fee
 *               packagingFee:
 *                 type: number
 *                 minimum: 0
 *                 description: Packaging fee
 *               effectiveFrom:
 *                 type: string
 *                 format: date-time
 *                 description: Effective from date
 *               effectiveTo:
 *                 type: string
 *                 format: date-time
 *                 description: Effective to date
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 description: Status
 *     responses:
 *       200:
 *         description: Pricing configuration updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Pricing configuration not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticateJWT,
  authorizePermission('service-area:pricing:update'),
  serviceAreaValidator.validateUpdateServiceAreaPricing,
  serviceAreaController.updateServiceAreaPricing
);

/**
 * @swagger
 * /service-area-pricing/{id}:
 *   delete:
 *     summary: Delete pricing configuration
 *     tags: [Service Area Pricing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pricing configuration ID
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *         description: Reason for deletion
 *     responses:
 *       200:
 *         description: Pricing configuration deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Pricing configuration not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorizePermission('service-area:pricing:delete'),
  serviceAreaController.deleteServiceAreaPricing
);

/**
 * @swagger
 * /service-areas/{serviceAreaId}/pricing:
 *   get:
 *     summary: List pricing configurations for a service area
 *     tags: [Service Area Pricing]
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
 *         name: serviceType
 *         schema:
 *           type: string
 *           enum: [REGULAR, EXPRESS, SAME_DAY, NEXT_DAY, ECONOMY]
 *         description: Filter by service type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of pricing configurations for the service area
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service area not found
 *       500:
 *         description: Server error
 */
router.get(
  '/service-areas/:serviceAreaId/pricing',
  authenticateJWT,
  authorizePermission('service-area:pricing:read'),
  serviceAreaController.listServiceAreaPricings
);

/**
 * @swagger
 * /service-area-pricing/calculate:
 *   post:
 *     summary: Calculate shipping price
 *     tags: [Service Area Pricing]
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
 *               - serviceType
 *               - distance
 *               - weight
 *             properties:
 *               serviceAreaId:
 *                 type: string
 *                 description: Service area ID
 *               serviceType:
 *                 type: string
 *                 enum: [REGULAR, EXPRESS, SAME_DAY, NEXT_DAY, ECONOMY]
 *                 description: Service type
 *               distance:
 *                 type: number
 *                 minimum: 0
 *                 description: Distance in kilometers
 *               weight:
 *                 type: number
 *                 minimum: 0.1
 *                 description: Weight in kilograms
 *     responses:
 *       200:
 *         description: Calculated shipping price
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service area or pricing configuration not found
 *       500:
 *         description: Server error
 */
router.post(
  '/calculate',
  authenticateJWT,
  authorizePermission('service-area:pricing:read'),
  serviceAreaValidator.validateCalculateShippingPrice,
  serviceAreaController.calculateShippingPrice
);

module.exports = router;
