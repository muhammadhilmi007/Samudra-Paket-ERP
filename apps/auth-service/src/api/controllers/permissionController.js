/**
 * Permission Controller
 * Handles permission management endpoints
 */

const { Permission, Role, RolePermission, UserRole } = require('../../domain/models');
const { successResponse, errorResponse } = require('../../utils');
const { clearPermissionCache } = require('../../application/services/permissionService');
const { logger } = require('../../utils/logger');

/**
 * Get all permissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with permissions
 */
const getAllPermissions = async (req, res) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter by resource if provided
    const filter = {};
    if (req.query.resource) {
      filter.resource = req.query.resource;
    }

    // Get total count
    const total = await Permission.countDocuments(filter);

    // Get permissions with pagination
    const permissions = await Permission.find(filter)
      .sort({ resource: 1, action: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
      successResponse({
        permissions,
        pagination: {
          total,
          page,
          limit,
          pages: totalPages,
        },
      })
    );
  } catch (error) {
    logger.error(`Error getting permissions: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to get permissions'));
  }
};

/**
 * Get permission by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with permission
 */
const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get permission
    const permission = await Permission.findById(id).lean();

    if (!permission) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Permission not found'));
    }

    return res.status(200).json(successResponse(permission));
  } catch (error) {
    logger.error(`Error getting permission: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to get permission'));
  }
};

/**
 * Create a new permission
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with created permission
 */
const createPermission = async (req, res) => {
  try {
    const { resource, action, attributes, description } = req.body;

    // Check if permission with same resource and action already exists
    const existingPermission = await Permission.findOne({ resource, action });
    if (existingPermission) {
      return res
        .status(409)
        .json(errorResponse('CONFLICT', 'Permission with this resource and action already exists'));
    }

    // Create permission
    const permission = await Permission.create({
      resource,
      action,
      attributes: attributes || {},
      description,
      isSystem: false,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    // Log permission creation
    logger.info(`Permission created: ${permission.resource}:${permission.action}`, {
      userId: req.user.id,
      permissionId: permission._id,
    });

    return res.status(201).json(successResponse(permission, 'Permission created successfully'));
  } catch (error) {
    logger.error(`Error creating permission: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to create permission'));
  }
};

/**
 * Update a permission
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated permission
 */
const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { resource, action, attributes, description } = req.body;

    // Get permission
    const permission = await Permission.findById(id);

    if (!permission) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Permission not found'));
    }

    // Check if permission is a system permission
    if (permission.isSystem) {
      return res
        .status(403)
        .json(errorResponse('FORBIDDEN', 'System permissions cannot be modified'));
    }

    // Check if resource and action are being changed and if they already exist
    if (
      (resource && resource !== permission.resource) ||
      (action && action !== permission.action)
    ) {
      const existingPermission = await Permission.findOne({
        resource: resource || permission.resource,
        action: action || permission.action,
      });

      if (existingPermission && existingPermission._id.toString() !== id) {
        return res
          .status(409)
          .json(
            errorResponse('CONFLICT', 'Permission with this resource and action already exists')
          );
      }
    }

    // Update permission
    if (resource) permission.resource = resource;
    if (action) permission.action = action;
    if (attributes !== undefined) permission.attributes = attributes || {};
    if (description !== undefined) permission.description = description;
    permission.updatedBy = req.user.id;

    await permission.save();

    // Clear permission cache for all users with this permission
    // This is an expensive operation, but necessary to ensure permissions are up-to-date
    const rolePermissions = await RolePermission.find({ permission: id });
    const roleIds = rolePermissions.map((rp) => rp.role);

    if (roleIds.length > 0) {
      const userRoles = await UserRole.find({ role: { $in: roleIds } });
      const userIds = userRoles.map((ur) => ur.user);

      // Clear cache for each user
      for (const userId of userIds) {
        await clearPermissionCache(userId);
      }
    }

    // Log permission update
    logger.info(`Permission updated: ${permission.resource}:${permission.action}`, {
      userId: req.user.id,
      permissionId: permission._id,
    });

    return res.status(200).json(successResponse(permission, 'Permission updated successfully'));
  } catch (error) {
    logger.error(`Error updating permission: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to update permission'));
  }
};

/**
 * Delete a permission
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    // Get permission
    const permission = await Permission.findById(id);

    if (!permission) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Permission not found'));
    }

    // Check if permission is a system permission
    if (permission.isSystem) {
      return res
        .status(403)
        .json(errorResponse('FORBIDDEN', 'System permissions cannot be deleted'));
    }

    // Check if permission is assigned to any roles
    const rolePermissions = await RolePermission.find({ permission: id });
    if (rolePermissions.length > 0) {
      return res
        .status(400)
        .json(errorResponse('BAD_REQUEST', 'Cannot delete permission assigned to roles'));
    }

    // Delete permission
    await permission.delete();

    // Log permission deletion
    logger.info(`Permission deleted: ${permission.resource}:${permission.action}`, {
      userId: req.user.id,
      permissionId: id,
    });

    return res.status(200).json(successResponse(null, 'Permission deleted successfully'));
  } catch (error) {
    logger.error(`Error deleting permission: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to delete permission'));
  }
};

/**
 * Get permissions by resource
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with permissions
 */
const getPermissionsByResource = async (req, res) => {
  try {
    const { resource } = req.params;

    // Get permissions for resource
    const permissions = await Permission.find({ resource }).lean();

    return res.status(200).json(successResponse(permissions));
  } catch (error) {
    logger.error(`Error getting permissions by resource: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to get permissions'));
  }
};

/**
 * Assign permission to role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with role permission
 */
const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.params;
    const { constraints = {}, granted = true } = req.body;

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Role not found'));
    }

    // Check if permission exists
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Permission not found'));
    }

    // Assign permission to role
    const rolePermission = await RolePermission.assignPermissionToRole(
      roleId,
      permissionId,
      constraints,
      granted,
      req.user.id
    );

    // Clear permission cache for all users with this role
    const userRoles = await UserRole.find({ role: roleId });
    const userIds = userRoles.map((ur) => ur.user);

    // Clear cache for each user
    for (const userId of userIds) {
      await clearPermissionCache(userId);
    }

    // Log permission assignment
    logger.info(
      `Permission assigned to role: ${permission.resource}:${permission.action} -> ${role.name}`,
      {
        userId: req.user.id,
        roleId,
        permissionId,
      }
    );

    return res
      .status(200)
      .json(successResponse(rolePermission, 'Permission assigned to role successfully'));
  } catch (error) {
    logger.error(`Error assigning permission to role: ${error.message}`, { error });
    return res
      .status(500)
      .json(errorResponse('SERVER_ERROR', 'Failed to assign permission to role'));
  }
};

/**
 * Revoke permission from role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
const revokePermissionFromRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.params;

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Role not found'));
    }

    // Check if permission exists
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Permission not found'));
    }

    // Check if permission is assigned to role
    const rolePermission = await RolePermission.findOne({ role: roleId, permission: permissionId });
    if (!rolePermission) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Permission not assigned to role'));
    }

    // Revoke permission from role
    await RolePermission.revokePermissionFromRole(roleId, permissionId);

    // Clear permission cache for all users with this role
    const userRoles = await UserRole.find({ role: roleId });
    const userIds = userRoles.map((ur) => ur.user);

    // Clear cache for each user
    for (const userId of userIds) {
      await clearPermissionCache(userId);
    }

    // Log permission revocation
    logger.info(
      `Permission revoked from role: ${permission.resource}:${permission.action} -> ${role.name}`,
      {
        userId: req.user.id,
        roleId,
        permissionId,
      }
    );

    return res.status(200).json(successResponse(null, 'Permission revoked from role successfully'));
  } catch (error) {
    logger.error(`Error revoking permission from role: ${error.message}`, { error });
    return res
      .status(500)
      .json(errorResponse('SERVER_ERROR', 'Failed to revoke permission from role'));
  }
};

/**
 * Get permissions for role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with permissions
 */
const getPermissionsForRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { includeParents = true } = req.query;

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Role not found'));
    }

    // Get permissions for role
    const rolePermissions = await RolePermission.getPermissionsForRole(
      roleId,
      includeParents === 'true' || includeParents === true
    );

    return res.status(200).json(
      successResponse({
        rolePermissions,
        includeParents: includeParents === 'true' || includeParents === true,
      })
    );
  } catch (error) {
    logger.error(`Error getting permissions for role: ${error.message}`, { error });
    return res
      .status(500)
      .json(errorResponse('SERVER_ERROR', 'Failed to get permissions for role'));
  }
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionsByResource,
  assignPermissionToRole,
  revokePermissionFromRole,
  getPermissionsForRole,
};
