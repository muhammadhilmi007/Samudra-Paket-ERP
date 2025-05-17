/**
 * Permission Routes for API Gateway
 * Proxies requests to the Auth Service
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const config = require('../../config');

const router = express.Router();

// Create proxy middleware
const permissionProxy = createProxyMiddleware({
  target: config.services?.auth?.url || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/v1/auth/permissions': '/api/permissions' // Rewrite path
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add headers if needed
    if (req.user) {
      proxyReq.setHeader('X-User-ID', req.user.id);
      proxyReq.setHeader('X-User-Role', req.user.role);
    }
  }
});

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permission management endpoints
 */

/**
 * @swagger
 * /v1/auth/permissions:
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

/**
 * @swagger
 * /v1/auth/permissions/{id}:
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

/**
 * @swagger
 * /v1/auth/permissions:
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

/**
 * @swagger
 * /v1/auth/permissions/{id}:
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

/**
 * @swagger
 * /v1/auth/permissions/{id}:
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

/**
 * @swagger
 * /v1/auth/permissions/resource/{resource}:
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

/**
 * @swagger
 * /v1/auth/permissions/role/{roleId}:
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

/**
 * @swagger
 * /v1/auth/permissions/role/{roleId}/permission/{permissionId}:
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

/**
 * @swagger
 * /v1/auth/permissions/role/{roleId}/permission/{permissionId}:
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

// Apply authentication middleware and proxy to all routes
router.use('/', authenticateJWT, permissionProxy);

module.exports = router;
