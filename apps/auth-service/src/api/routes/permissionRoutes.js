/**
 * Permission Routes
 * Handles permission management endpoints
 */

const express = require('express');
const { permissionController } = require('../controllers');
const { authenticateJWT, requirePermission, validate } = require('../middlewares');
const { permissionValidation } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permission management endpoints
 */

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     description: Retrieve a list of all permissions with pagination
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
 *       - in: query
 *         name: resource
 *         schema:
 *           type: string
 *         description: Filter by resource
 *     responses:
 *       200:
 *         description: A list of permissions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/',
  authenticateJWT,
  requirePermission('permissions', 'read'),
  permissionController.getAllPermissions
);

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     description: Retrieve a permission by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 */
router.get(
  '/:id',
  authenticateJWT,
  requirePermission('permissions', 'read'),
  permissionController.getPermissionById
);

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     description: Create a new permission with resource, action, and optional attributes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resource
 *               - action
 *             properties:
 *               resource:
 *                 type: string
 *                 description: Resource name
 *               action:
 *                 type: string
 *                 description: Action name
 *               attributes:
 *                 type: object
 *                 description: Permission attributes
 *               description:
 *                 type: string
 *                 description: Permission description
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Permission with this resource and action already exists
 */
router.post(
  '/',
  authenticateJWT,
  requirePermission('permissions', 'create'),
  validate(permissionValidation.createPermission),
  permissionController.createPermission
);

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Update a permission
 *     tags: [Permissions]
 *     description: Update a permission's resource, action, attributes, or description
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resource:
 *                 type: string
 *                 description: Resource name
 *               action:
 *                 type: string
 *                 description: Action name
 *               attributes:
 *                 type: object
 *                 description: Permission attributes
 *               description:
 *                 type: string
 *                 description: Permission description
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 *       409:
 *         description: Permission with this resource and action already exists
 */
router.put(
  '/:id',
  authenticateJWT,
  requirePermission('permissions', 'update'),
  validate(permissionValidation.updatePermission),
  permissionController.updatePermission
);

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
 *     description: Delete a permission by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       400:
 *         description: Cannot delete permission assigned to roles
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 */
router.delete(
  '/:id',
  authenticateJWT,
  requirePermission('permissions', 'delete'),
  permissionController.deletePermission
);

/**
 * @swagger
 * /permissions/resource/{resource}:
 *   get:
 *     summary: Get permissions by resource
 *     tags: [Permissions]
 *     description: Retrieve all permissions for a specific resource
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource name
 *     responses:
 *       200:
 *         description: Permissions for resource
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/resource/:resource',
  authenticateJWT,
  requirePermission('permissions', 'read'),
  permissionController.getPermissionsByResource
);

/**
 * @swagger
 * /permissions/role/{roleId}:
 *   get:
 *     summary: Get permissions for role
 *     tags: [Permissions]
 *     description: Retrieve all permissions assigned to a role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *       - in: query
 *         name: includeParents
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Include permissions from parent roles
 *     responses:
 *       200:
 *         description: Permissions for role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.get(
  '/role/:roleId',
  authenticateJWT,
  requirePermission('permissions', 'read'),
  permissionController.getPermissionsForRole
);

/**
 * @swagger
 * /permissions/role/{roleId}/permission/{permissionId}:
 *   post:
 *     summary: Assign permission to role
 *     tags: [Permissions]
 *     description: Assign a permission to a role with optional constraints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               constraints:
 *                 type: object
 *                 description: Permission constraints
 *               granted:
 *                 type: boolean
 *                 default: true
 *                 description: Whether permission is granted or denied
 *     responses:
 *       200:
 *         description: Permission assigned to role successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role or permission not found
 */
router.post(
  '/role/:roleId/permission/:permissionId',
  authenticateJWT,
  requirePermission('permissions', 'update'),
  validate(permissionValidation.assignPermission),
  permissionController.assignPermissionToRole
);

/**
 * @swagger
 * /permissions/role/{roleId}/permission/{permissionId}:
 *   delete:
 *     summary: Revoke permission from role
 *     tags: [Permissions]
 *     description: Revoke a permission from a role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission revoked from role successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role, permission, or assignment not found
 */
router.delete(
  '/role/:roleId/permission/:permissionId',
  authenticateJWT,
  requirePermission('permissions', 'update'),
  permissionController.revokePermissionFromRole
);

module.exports = router;
