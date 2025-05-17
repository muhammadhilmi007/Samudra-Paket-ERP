/**
 * Branch Routes
 * Defines API endpoints for branch management
 */

const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const branchValidator = require('../validators/branchValidator');
const { authenticateJWT, authorizePermission } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: Branch management endpoints
 */

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Create a new branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchInput'
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
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
  authenticateJWT,
  authorizePermission('branch:create'),
  branchValidator.validateCreateBranch,
  branchController.createBranch
);

/**
 * @swagger
 * /branches:
 *   get:
 *     summary: Get all branches with pagination and filtering
 *     tags: [Branches]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, PENDING, CLOSED]
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [HEAD_OFFICE, REGIONAL, BRANCH]
 *         description: Filter by type
 *       - in: query
 *         name: parent
 *         schema:
 *           type: string
 *         description: Filter by parent ID (use 'null' for root branches)
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
 *         description: List of branches
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticateJWT,
  authorizePermission('branch:read'),
  branchController.listBranches
);

/**
 * @swagger
 * /branches/hierarchy:
 *   get:
 *     summary: Get full branch hierarchy
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Branch hierarchy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchHierarchyResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  '/hierarchy',
  authenticateJWT,
  authorizePermission('branch:read'),
  branchController.getBranchHierarchy
);

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     summary: Get branch by ID
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticateJWT,
  authorizePermission('branch:read'),
  branchController.getBranch
);

/**
 * @swagger
 * /branches/{id}/hierarchy:
 *   get:
 *     summary: Get branch hierarchy starting from specified branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch hierarchy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchHierarchyResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/hierarchy',
  authenticateJWT,
  authorizePermission('branch:read'),
  branchController.getBranchHierarchy
);

/**
 * @swagger
 * /branches/{id}:
 *   put:
 *     summary: Update branch by ID
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchUpdateInput'
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticateJWT,
  authorizePermission('branch:update'),
  branchValidator.validateUpdateBranch,
  branchController.updateBranch
);

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     summary: Delete branch by ID
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *       400:
 *         description: Cannot delete branch with children
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorizePermission('branch:delete'),
  branchController.deleteBranch
);

/**
 * @swagger
 * /branches/{id}/status:
 *   patch:
 *     summary: Update branch status
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
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
 *                 enum: [ACTIVE, INACTIVE, PENDING, CLOSED]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Branch status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/status',
  authenticateJWT,
  authorizePermission('branch:update'),
  branchValidator.validateUpdateStatus,
  branchController.updateBranchStatus
);

/**
 * @swagger
 * /branches/{id}/metrics:
 *   patch:
 *     summary: Update branch performance metrics
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchMetricsInput'
 *     responses:
 *       200:
 *         description: Branch metrics updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       400:
 *         description: Invalid metrics data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/metrics',
  authenticateJWT,
  authorizePermission('branch:update'),
  branchValidator.validateUpdateMetrics,
  branchController.updateBranchMetrics
);

/**
 * @swagger
 * /branches/{id}/resources:
 *   patch:
 *     summary: Update branch resources
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchResourcesInput'
 *     responses:
 *       200:
 *         description: Branch resources updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       400:
 *         description: Invalid resources data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/resources',
  authenticateJWT,
  authorizePermission('branch:update'),
  branchValidator.validateUpdateResources,
  branchController.updateBranchResources
);

/**
 * @swagger
 * /branches/{id}/documents:
 *   post:
 *     summary: Add document to branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchDocumentInput'
 *     responses:
 *       200:
 *         description: Document added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       400:
 *         description: Invalid document data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/documents',
  authenticateJWT,
  authorizePermission('branch:update'),
  branchValidator.validateAddDocument,
  branchController.addBranchDocument
);

/**
 * @swagger
 * /branches/{id}/documents/{documentId}:
 *   delete:
 *     summary: Remove document from branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch or document not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id/documents/:documentId',
  authenticateJWT,
  authorizePermission('branch:update'),
  branchController.removeBranchDocument
);

/**
 * @swagger
 * /branches/{id}/operational-hours:
 *   put:
 *     summary: Update branch operational hours
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchOperationalHoursInput'
 *     responses:
 *       200:
 *         description: Operational hours updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       400:
 *         description: Invalid operational hours data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id/operational-hours',
  authenticateJWT,
  authorizePermission('branch:update'),
  branchValidator.validateUpdateOperationalHours,
  branchController.updateBranchOperationalHours
);

module.exports = router;
