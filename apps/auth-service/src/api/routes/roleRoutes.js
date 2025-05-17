/**
 * Role Routes
 * Handles role management endpoints
 */

const express = require('express');
const { roleController } = require('../controllers');
const { authenticateJWT, requirePermission, validate } = require('../middlewares');
const { roleValidation } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management endpoints
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     description: Retrieve a list of all roles with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of roles
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/',
  authenticateJWT,
  requirePermission('roles', 'read'),
  roleController.getAllRoles
);

/**
 * @swagger
 * /roles/hierarchy:
 *   get:
 *     summary: Get role hierarchy
 *     tags: [Roles]
 *     description: Retrieve the complete role hierarchy as a tree structure
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role hierarchy tree
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/hierarchy',
  authenticateJWT,
  requirePermission('roles', 'read'),
  roleController.getRoleHierarchy
);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     description: Retrieve a role by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.get(
  '/:id',
  authenticateJWT,
  requirePermission('roles', 'read'),
  roleController.getRoleById
);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     description: Create a new role with name, description, and optional parent
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Role name
 *               description:
 *                 type: string
 *                 description: Role description
 *               parent:
 *                 type: string
 *                 description: Parent role ID
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Role with this name already exists
 */
router.post(
  '/',
  authenticateJWT,
  requirePermission('roles', 'create'),
  validate(roleValidation.createRole),
  roleController.createRole
);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     description: Update a role's name, description, or parent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Role name
 *               description:
 *                 type: string
 *                 description: Role description
 *               parent:
 *                 type: string
 *                 description: Parent role ID
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *       409:
 *         description: Role with this name already exists
 */
router.put(
  '/:id',
  authenticateJWT,
  requirePermission('roles', 'update'),
  validate(roleValidation.updateRole),
  roleController.updateRole
);



/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     description: Delete a role by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       400:
 *         description: Cannot delete role with child roles or assigned to users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.delete(
  '/:id',
  authenticateJWT,
  requirePermission('roles', 'delete'),
  roleController.deleteRole
);

/**
 * @swagger
 * /roles/hierarchy:
 *   get:
 *     summary: Get role hierarchy
 *     tags: [Roles]
 *     description: Retrieve the complete role hierarchy
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role hierarchy
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/hierarchy',
  authenticateJWT,
  requirePermission('roles', 'read'),
  roleController.getRoleHierarchy
);

module.exports = router;
