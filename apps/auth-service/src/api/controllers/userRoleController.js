/**
 * User Role Controller
 * Handles user role management endpoints
 */

const { User, Role, UserRole } = require('../../domain/models');
const { successResponse, errorResponse } = require('../../utils');
const { clearPermissionCache } = require('../../application/services/permissionService');
const { logger } = require('../../utils/logger');

/**
 * Assign role to user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with user role
 */
const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.params;
    const { scope = null, expiresAt = null, isActive = true } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'User not found'));
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Role not found'));
    }

    // Assign role to user
    const userRole = await UserRole.assignRoleToUser(
      userId,
      roleId,
      { scope, expiresAt, isActive },
      req.user.id
    );

    // Clear permission cache for user
    await clearPermissionCache(userId);

    // Log role assignment
    logger.info(`Role assigned to user: ${role.name} -> ${user.email}`, {
      userId: req.user.id,
      targetUserId: userId,
      roleId,
    });

    return res.status(200).json(successResponse(userRole, 'Role assigned to user successfully'));
  } catch (error) {
    logger.error(`Error assigning role to user: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to assign role to user'));
  }
};

/**
 * Revoke role from user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
const revokeRoleFromUser = async (req, res) => {
  try {
    const { userId, roleId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'User not found'));
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Role not found'));
    }

    // Check if user has role
    const userRole = await UserRole.findOne({ user: userId, role: roleId });
    if (!userRole) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'User does not have this role'));
    }

    // Revoke role from user
    await UserRole.revokeRoleFromUser(userId, roleId);

    // Clear permission cache for user
    await clearPermissionCache(userId);

    // Log role revocation
    logger.info(`Role revoked from user: ${role.name} -> ${user.email}`, {
      userId: req.user.id,
      targetUserId: userId,
      roleId,
    });

    return res.status(200).json(successResponse(null, 'Role revoked from user successfully'));
  } catch (error) {
    logger.error(`Error revoking role from user: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to revoke role from user'));
  }
};

/**
 * Get roles for user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with roles
 */
const getRolesForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'User not found'));
    }

    // Get active roles for user
    const userRoles = await UserRole.getActiveRolesForUser(userId);

    return res.status(200).json(
      successResponse({
        userRoles,
      })
    );
  } catch (error) {
    logger.error(`Error getting roles for user: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to get roles for user'));
  }
};

/**
 * Get users with role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with users
 */
const getUsersWithRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Role not found'));
    }

    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await UserRole.countDocuments({ role: roleId });

    // Get users with role
    const userRoles = await UserRole.find({ role: roleId })
      .populate('user', 'firstName lastName email username role')
      .skip(skip)
      .limit(limit)
      .lean();

    // Extract users from user roles
    const users = userRoles.map((ur) => ur.user);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
      successResponse({
        users,
        pagination: {
          total,
          page,
          limit,
          pages: totalPages,
        },
      })
    );
  } catch (error) {
    logger.error(`Error getting users with role: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to get users with role'));
  }
};

/**
 * Update user role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated user role
 */
const updateUserRole = async (req, res) => {
  try {
    const { userId, roleId } = req.params;
    const { scope, expiresAt, isActive } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'User not found'));
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Role not found'));
    }

    // Check if user has role
    let userRole = await UserRole.findOne({ user: userId, role: roleId });
    if (!userRole) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'User does not have this role'));
    }

    // Update user role
    if (scope !== undefined) userRole.scope = scope;
    if (expiresAt !== undefined) userRole.expiresAt = expiresAt;
    if (isActive !== undefined) userRole.isActive = isActive;
    userRole.updatedBy = req.user.id;

    await userRole.save();

    // Clear permission cache for user
    await clearPermissionCache(userId);

    // Log user role update
    logger.info(`User role updated: ${role.name} -> ${user.email}`, {
      userId: req.user.id,
      targetUserId: userId,
      roleId,
    });

    return res.status(200).json(successResponse(userRole, 'User role updated successfully'));
  } catch (error) {
    logger.error(`Error updating user role: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to update user role'));
  }
};

module.exports = {
  assignRoleToUser,
  revokeRoleFromUser,
  getRolesForUser,
  getUsersWithRole,
  updateUserRole,
};
