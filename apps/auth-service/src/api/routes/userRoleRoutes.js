/**
 * User Role Routes
 * Handles user role management endpoints
 */

const express = require('express');
const { userRoleController } = require('../controllers');
const { authenticateJWT, requirePermission, validate } = require('../middlewares');
const { userRoleValidation } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserRoles
 *   description: User role management endpoints
 */

/**
 * @swagger
 * /user-roles/user/{userId}:
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
router.get(
  '/user/:userId',
  authenticateJWT,
  requirePermission('user_roles', 'read'),
  userRoleController.getRolesForUser
);

/**
 * @swagger
 * /user-roles/role/{roleId}:
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
router.get(
  '/role/:roleId',
  authenticateJWT,
  requirePermission('user_roles', 'read'),
  userRoleController.getUsersWithRole
);

/**
 * @swagger
 * /user-roles/user/{userId}/role/{roleId}:
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
router.post(
  '/user/:userId/role/:roleId',
  authenticateJWT,
  requirePermission('user_roles', 'create'),
  validate(userRoleValidation.assignRole),
  userRoleController.assignRoleToUser
);

/**
 * @swagger
 * /user-roles/user/{userId}/role/{roleId}:
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
router.put(
  '/user/:userId/role/:roleId',
  authenticateJWT,
  requirePermission('user_roles', 'update'),
  validate(userRoleValidation.updateUserRole),
  userRoleController.updateUserRole
);

/**
 * @swagger
 * /user-roles/user/{userId}/role/{roleId}:
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
router.delete(
  '/user/:userId/role/:roleId',
  authenticateJWT,
  requirePermission('user_roles', 'delete'),
  userRoleController.revokeRoleFromUser
);

module.exports = router;
