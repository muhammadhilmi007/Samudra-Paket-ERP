/**
 * User Controller
 * Handles user management requests
 */

const { userRepository, securityLogRepository } = require('../../infrastructure/repositories');

/**
 * Get all users
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getAllUsers = async (req, res, next) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Get users
    const users = await userRepository.findAll({ skip, limit, sort });
    const total = await userRepository.countUsers();
    
    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get user
    const user = await userRepository.findById(id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.passwordHistory;
    delete updateData.verificationToken;
    delete updateData.verificationTokenExpires;
    delete updateData.resetPasswordToken;
    delete updateData.resetPasswordExpires;
    
    // Update user
    const user = await userRepository.updateUser(id, updateData);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Log account update
    await securityLogRepository.createLog({
      userId: user._id,
      eventType: 'ACCOUNT_UPDATE',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS'
    });
    
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Delete user
    const user = await userRepository.deleteUser(id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get users by role
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Get users by role
    const users = await userRepository.findByRole(role, { skip, limit, sort });
    const total = await userRepository.countUsers({ role });
    
    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lock user account
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const lockUserAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Lock until 30 minutes from now
    const lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    
    // Lock account
    const user = await userRepository.lockAccount(id, lockedUntil);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Log account lock
    await securityLogRepository.createLog({
      userId: user._id,
      eventType: 'ACCOUNT_LOCK',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS'
    });
    
    res.status(200).json({
      status: 'success',
      message: 'User account locked successfully',
      data: {
        isLocked: user.isLocked,
        lockedUntil: user.lockedUntil
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unlock user account
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const unlockUserAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Unlock account
    const user = await userRepository.unlockAccount(id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Log account unlock
    await securityLogRepository.createLog({
      userId: user._id,
      eventType: 'ACCOUNT_UNLOCK',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS'
    });
    
    res.status(200).json({
      status: 'success',
      message: 'User account unlocked successfully',
      data: {
        isLocked: user.isLocked,
        failedLoginAttempts: user.failedLoginAttempts
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole,
  lockUserAccount,
  unlockUserAccount
};
