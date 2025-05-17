/**
 * Authentication Routes
 * Handles authentication-related endpoints
 */

const express = require('express');
const { authController } = require('../controllers');
const { validate } = require('../middlewares/validationMiddleware');
const { authValidation } = require('../validators');
const { 
  loginRateLimiter, 
  passwordResetRateLimiter, 
  registrationRateLimiter,
  authenticateJWT
} = require('../middlewares');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Register a new user account with email verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - username
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               role:
 *                 type: string
 *                 enum: [admin, manager, customer, courier, driver, warehouse]
 *                 example: customer
 *               phoneNumber:
 *                 type: string
 *                 example: '+6281234567890'
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully. Please check your email to verify your account.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email or username already exists
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
 *                   example: CONFLICT
 *                 message:
 *                   type: string
 *                   example: Email already exists
 *       429:
 *         description: Too many registration attempts
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
 *                   example: TOO_MANY_REQUESTS
 *                 message:
 *                   type: string
 *                   example: Too many registration attempts. Please try again later.
 */
router.post(
  '/register',
  registrationRateLimiter,
  validate(authValidation.registerSchema),
  authController.register
);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     tags: [Authentication]
 *     description: Verify user email with the provided token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid or expired token
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
 *                   example: INVALID_TOKEN
 *                 message:
 *                   type: string
 *                   example: Invalid or expired verification token
 */
router.get(
  '/verify-email/:token',
  authController.verifyEmail
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     description: Authenticate user and return JWT tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username or email
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid credentials
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
 *                   example: INVALID_CREDENTIALS
 *                 message:
 *                   type: string
 *                   example: Invalid username or password
 *       403:
 *         description: Account locked
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
 *                   example: ACCOUNT_LOCKED
 *                 message:
 *                   type: string
 *                   example: Account is locked due to too many failed login attempts
 *       429:
 *         description: Too many login attempts
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
 *                   example: TOO_MANY_REQUESTS
 *                 message:
 *                   type: string
 *                   example: Too many login attempts. Please try again later.
 */
router.post(
  '/login',
  loginRateLimiter,
  validate(authValidation.loginSchema),
  authController.login
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     description: Get a new access token using a valid refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                   example: Token refreshed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid refresh token
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
 *                   example: INVALID_TOKEN
 *                 message:
 *                   type: string
 *                   example: Invalid refresh token
 */
router.post(
  '/refresh-token',
  validate(authValidation.refreshTokenSchema),
  authController.refreshToken
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Invalidate refresh token and end user session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   example: Logout successful
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/logout',
  validate(authValidation.logoutSchema),
  authController.logout
);

/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     description: Request a password reset link to be sent to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
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
 *                   example: If your email is registered, you will receive a password reset link
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       429:
 *         description: Too many password reset attempts
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
 *                   example: TOO_MANY_REQUESTS
 *                 message:
 *                   type: string
 *                   example: Too many password reset attempts. Please try again later.
 */
router.post(
  '/request-password-reset',
  passwordResetRateLimiter,
  validate(authValidation.passwordResetRequestSchema),
  authController.requestPasswordReset
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     description: Reset user password using a valid reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: 7c841efa986b1118f6e7105c4f9f5d8a7d83e494
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password reset successful
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
 *                   example: Password reset successful
 *       400:
 *         description: Invalid or expired token
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
 *                   example: INVALID_TOKEN
 *                 message:
 *                   type: string
 *                   example: Invalid or expired reset token
 */
router.post(
  '/reset-password',
  validate(authValidation.passwordResetSchema),
  authController.resetPassword
);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Authentication]
 *     description: Change user password when logged in
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: Password changed successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Incorrect current password
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
 *                   example: INVALID_CREDENTIALS
 *                 message:
 *                   type: string
 *                   example: Current password is incorrect
 */
router.post(
  '/change-password',
  authenticateJWT,
  validate(authValidation.passwordChangeSchema),
  authController.changePassword
);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get(
  '/me',
  authenticateJWT,
  authController.getCurrentUser
);

module.exports = router;
