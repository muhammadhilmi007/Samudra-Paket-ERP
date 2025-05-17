/**
 * User Role Routes for API Gateway
 * Proxies requests to the Auth Service
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const config = require('../../config');

const router = express.Router();

// Create proxy middleware
const userRoleProxy = createProxyMiddleware({
  target: config.services?.auth?.url || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/v1/auth/user-roles': '/api/user-roles' // Rewrite path
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
 *   name: UserRoles
 *   description: User role management endpoints
 */

/**
 * @swagger
 * /v1/auth/user-roles/user/{userId}:
 *   get:
 *     summary: Get roles for user
 *     tags: [UserRoles]
 *     description: Retrieve all roles assigned to a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Roles for user
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /v1/auth/user-roles/role/{roleId}:
 *   get:
 *     summary: Get users with role
 *     tags: [UserRoles]
 *     description: Retrieve all users assigned to a role
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
 *         description: Users with role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */

/**
 * @swagger
 * /v1/auth/user-roles/user/{userId}/role/{roleId}:
 *   post:
 *     summary: Assign role to user
 *     tags: [UserRoles]
 *     description: Assign a role to a user with optional scope and expiration
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scope:
 *                 type: object
 *                 description: Role scope (e.g., specific branch, department)
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Expiration date for temporary role assignment
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Whether role assignment is active
 *     responses:
 *       200:
 *         description: Role assigned to user successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User or role not found
 */

/**
 * @swagger
 * /v1/auth/user-roles/user/{userId}/role/{roleId}:
 *   put:
 *     summary: Update user role
 *     tags: [UserRoles]
 *     description: Update a user's role assignment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scope:
 *                 type: object
 *                 description: Role scope (e.g., specific branch, department)
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Expiration date for temporary role assignment
 *               isActive:
 *                 type: boolean
 *                 description: Whether role assignment is active
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User, role, or assignment not found
 */

/**
 * @swagger
 * /v1/auth/user-roles/user/{userId}/role/{roleId}:
 *   delete:
 *     summary: Revoke role from user
 *     tags: [UserRoles]
 *     description: Revoke a role from a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role revoked from user successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User, role, or assignment not found
 */

// Apply authentication middleware and proxy to all routes
router.use('/', authenticateJWT, userRoleProxy);

module.exports = router;
