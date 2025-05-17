/**
 * Role Routes for API Gateway
 * Proxies requests to the Auth Service
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const config = require('../../config');

const router = express.Router();

// Create proxy middleware
const roleProxy = createProxyMiddleware({
  target: config.services?.auth?.url || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/v1/auth/roles': '/api/roles' // Rewrite path
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
 *   name: Roles
 *   description: Role management endpoints
 */

/**
 * @swagger
 * /v1/auth/roles:
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

/**
 * @swagger
 * /v1/auth/roles/{id}:
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

/**
 * @swagger
 * /v1/auth/roles:
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

/**
 * @swagger
 * /v1/auth/roles/{id}:
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

/**
 * @swagger
 * /v1/auth/roles/{id}:
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

/**
 * @swagger
 * /v1/auth/roles/hierarchy:
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

// Apply authentication middleware and proxy to all routes
router.use('/', authenticateJWT, roleProxy);

module.exports = router;
