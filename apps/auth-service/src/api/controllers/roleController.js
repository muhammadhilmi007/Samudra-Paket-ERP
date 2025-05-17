/**
 * Role Controller
 * Handles role management endpoints
 */

const { Role, UserRole, RolePermission } = require('../../domain/models');
const { successResponse, errorResponse } = require('../../utils');
const { logger } = require('../../utils/logger');

/**
 * Get all roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with roles
 */
const getAllRoles = async (req, res) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Role.countDocuments();

    // Get roles with pagination
    const roles = await Role.find().sort({ level: 1, name: 1 }).skip(skip).limit(limit).lean();

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
      successResponse({
        roles,
        pagination: {
          total,
          page,
          limit,
          pages: totalPages,
        },
      })
    );
  } catch (error) {
    logger.error(`Error getting roles: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to get roles'));
  }
};

/**
 * Get role by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with role
 */
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get role
    const role = await Role.findById(id).lean();

    if (!role) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Role not found'));
    }

    return res.status(200).json(successResponse(role));
  } catch (error) {
    logger.error(`Error getting role: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to get role'));
  }
};

/**
 * Create a new role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with created role
 */
const createRole = async (req, res) => {
  try {
    const { name, description, parent } = req.body;

    // Check if role with same name already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(409).json(errorResponse('CONFLICT', 'Role with this name already exists'));
    }

    // Determine level based on parent
    let level = 0;
    if (parent) {
      const parentRole = await Role.findById(parent);
      if (!parentRole) {
        return res.status(400).json(errorResponse('BAD_REQUEST', 'Parent role not found'));
      }
      level = parentRole.level + 1;
    }

    // Create role
    const role = await Role.create({
      name,
      description,
      parent,
      level,
      isSystem: false,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    // Log role creation
    logger.info(`Role created: ${role.name}`, {
      userId: req.user.id,
      roleId: role._id,
    });

    return res.status(201).json(successResponse(role, 'Role created successfully'));
  } catch (error) {
    logger.error(`Error creating role: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to create role'));
  }
};

/**
 * Update a role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated role
 */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent } = req.body;

    // Get role
    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Role not found'));
    }

    // Check if role is a system role
    if (role.isSystem) {
      return res.status(403).json(errorResponse('FORBIDDEN', 'System roles cannot be modified'));
    }

    // Check if name is being changed and if it already exists
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res
          .status(409)
          .json(errorResponse('CONFLICT', 'Role with this name already exists'));
      }
    }

    // Check for circular dependency if parent is being changed
    if (parent && parent !== role.parent?.toString()) {
      // Check if parent is the role itself
      if (parent === id) {
        return res.status(400).json(errorResponse('BAD_REQUEST', 'Role cannot be its own parent'));
      }

      // Check if parent is one of the role's descendants
      const parentRole = await Role.findById(parent);
      if (!parentRole) {
        return res.status(400).json(errorResponse('BAD_REQUEST', 'Parent role not found'));
      }

      // Check if parent is a descendant of this role
      const isDescendant = await parentRole.isDescendantOf(id);
      if (isDescendant) {
        return res.status(400).json(errorResponse('BAD_REQUEST', 'Circular dependency detected'));
      }

      // Update level based on new parent
      role.level = parentRole.level + 1;
    }

    // Update role
    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    if (parent !== undefined) role.parent = parent || null;
    role.updatedBy = req.user.id;

    await role.save();

    // Log role update
    logger.info(`Role updated: ${role.name}`, {
      userId: req.user.id,
      roleId: role._id,
    });

    return res.status(200).json(successResponse(role, 'Role updated successfully'));
  } catch (error) {
    logger.error(`Error updating role: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to update role'));
  }
};

/**
 * Delete a role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Get role
    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Role not found'));
    }

    // Check if role is a system role
    if (role.isSystem) {
      return res.status(403).json(errorResponse('FORBIDDEN', 'System roles cannot be deleted'));
    }

    // Check if role has child roles
    const childRoles = await Role.find({ parent: id });
    if (childRoles.length > 0) {
      return res
        .status(400)
        .json(errorResponse('BAD_REQUEST', 'Cannot delete role with child roles'));
    }

    // Check if role is assigned to any users
    const userRoles = await UserRole.find({ role: id });
    if (userRoles.length > 0) {
      return res
        .status(400)
        .json(errorResponse('BAD_REQUEST', 'Cannot delete role assigned to users'));
    }

    // Delete role permissions
    await RolePermission.deleteMany({ role: id });

    // Delete role
    await role.delete();

    // Log role deletion
    logger.info(`Role deleted: ${role.name}`, {
      userId: req.user.id,
      roleId: id,
    });

    return res.status(200).json(successResponse(null, 'Role deleted successfully'));
  } catch (error) {
    logger.error(`Error deleting role: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to delete role'));
  }
};

/**
 * Get role hierarchy
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with role hierarchy
 */
const getRoleHierarchy = async (req, res) => {
  try {
    // Get all roles
    const roles = await Role.find().lean();

    // Build hierarchy
    const roleMap = {};
    const rootRoles = [];

    // Create map of roles
    roles.forEach((role) => {
      roleMap[role._id] = {
        ...role,
        children: [],
      };
    });

    // Build tree structure
    roles.forEach((role) => {
      if (role.parent) {
        // Add as child to parent
        if (roleMap[role.parent]) {
          roleMap[role.parent].children.push(roleMap[role._id]);
        }
      } else {
        // Root role
        rootRoles.push(roleMap[role._id]);
      }
    });

    return res.status(200).json(
      successResponse({
        hierarchy: rootRoles,
      })
    );
  } catch (error) {
    logger.error(`Error getting role hierarchy: ${error.message}`, { error });
    return res.status(500).json(errorResponse('SERVER_ERROR', 'Failed to get role hierarchy'));
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRoleHierarchy,
};
