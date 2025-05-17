/**
 * Authentication Controller
 * Handles authentication-related requests
 */

const { authService } = require('../../application/services');
const { securityLogRepository } = require('../../infrastructure/repositories');

/**
 * Register a new user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const register = async (req, res, next) => {
  try {
    // Add request metadata
    const userData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    // Register user
    const user = await authService.registerUser(userData);
    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Please check your email for verification.',
      data: user
    });
  } catch (error) {
    // Log registration failure
    try {
      await securityLogRepository.createLog({
        eventType: 'ACCOUNT_CREATION',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { email: req.body.email, reason: error.message },
        status: 'FAILURE'
      });
    } catch (logError) {
      console.error('Error logging registration failure:', logError);
    }
    
    next(error);
  }
};

/**
 * Verify user email
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    // Verify email
    const result = await authService.verifyEmail(token);
    
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Add request metadata
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    // Login user
    const result = await authService.loginUser(username, password, metadata);
    
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    // Add request metadata
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    // Refresh token
    const result = await authService.refreshToken(refreshToken, metadata);
    
    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    // Add request metadata
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    // Logout user
    await authService.logoutUser(refreshToken, metadata);
    
    res.status(200).json({
      status: 'success',
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Add request metadata
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    // Request password reset
    await authService.requestPasswordReset(email, metadata);
    
    // Always return success to prevent email enumeration
    res.status(200).json({
      status: 'success',
      message: 'If your email is registered, you will receive a password reset link'
    });
  } catch (error) {
    // Always return success to prevent email enumeration
    res.status(200).json({
      status: 'success',
      message: 'If your email is registered, you will receive a password reset link'
    });
  }
};

/**
 * Reset password
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    // Add request metadata
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    // Reset password
    await authService.resetPassword(token, password, metadata);
    
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Add request metadata
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      sessionId: req.sessionId
    };
    
    // Change password
    await authService.changePassword(userId, currentPassword, newPassword, metadata);
    
    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // User is already attached to request by auth middleware
    res.status(200).json({
      status: 'success',
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getCurrentUser
};
