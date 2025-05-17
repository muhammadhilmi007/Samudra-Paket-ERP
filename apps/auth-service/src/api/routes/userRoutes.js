/**
 * User Routes
 * Handles user management endpoints
 */

const express = require('express');
const { userController } = require('../controllers');
const { authenticateJWT, hasRole } = require('../middlewares');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve a list of all users with pagination
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
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 50
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         pages:
 *                           type: integer
 *                           example: 5
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: string
 *                   example: FORBIDDEN
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 */
router.get(
  '/',
  authenticateJWT,
  hasRole(['admin', 'manager']),
  userController.getAllUsers
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     description: Retrieve a user by their ID. Users can access their own data, while admins and managers can access any user's data.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: string
 *                   example: FORBIDDEN
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:id',
  authenticateJWT,
  (req, res, next) => {
    // Allow users to access their own data
    if (req.user.id === req.params.id || ['admin', 'manager'].includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({
      status: 'error',
      code: 'FORBIDDEN',
      message: 'Insufficient permissions'
    });
  },
  userController.getUserById
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     description: Update user information. Users can update their own data, while admins and managers can update any user's data.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phoneNumber:
 *                 type: string
 *                 example: '+6281234567890'
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: '123 Main St'
 *                   city:
 *                     type: string
 *                     example: 'Jakarta'
 *                   state:
 *                     type: string
 *                     example: 'DKI Jakarta'
 *                   postalCode:
 *                     type: string
 *                     example: '12345'
 *                   country:
 *                     type: string
 *                     example: 'Indonesia'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: string
 *                   example: FORBIDDEN
 *                 message:
 *                   type: string
 *                   example: Insufficient permissions
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/:id',
  authenticateJWT,
  (req, res, next) => {
    // Allow users to update their own data
    if (req.user.id === req.params.id || ['admin', 'manager'].includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({
      status: 'error',
      code: 'FORBIDDEN',
      message: 'Insufficient permissions'
    });
  },
  userController.updateUser
);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user
 * @access Private (Admin only)
 */
router.delete(
  '/:id',
  authenticateJWT,
  hasRole('admin'),
  userController.deleteUser
);

/**
 * @route GET /api/users/role/:role
 * @desc Get users by role
 * @access Private (Admin, Manager)
 */
router.get(
  '/role/:role',
  authenticateJWT,
  hasRole(['admin', 'manager']),
  userController.getUsersByRole
);

/**
 * @route POST /api/users/:id/lock
 * @desc Lock user account
 * @access Private (Admin only)
 */
router.post(
  '/:id/lock',
  authenticateJWT,
  hasRole('admin'),
  userController.lockUserAccount
);

/**
 * @route POST /api/users/:id/unlock
 * @desc Unlock user account
 * @access Private (Admin only)
 */
router.post(
  '/:id/unlock',
  authenticateJWT,
  hasRole('admin'),
  userController.unlockUserAccount
);

module.exports = router;
