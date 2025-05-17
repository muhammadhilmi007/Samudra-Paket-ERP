/**
 * RolePermission Model
 * Defines the many-to-many relationship between roles and permissions
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rolePermissionSchema = new Schema({
  // Role reference
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  // Permission reference
  permission: {
    type: Schema.Types.ObjectId,
    ref: 'Permission',
    required: true
  },
  // Optional constraints for conditional permissions
  // (e.g., { ownedByUser: true } for resources owned by the user)
  constraints: {
    type: Schema.Types.Mixed,
    default: {}
  },
  // Whether this assignment is granted (true) or denied (false)
  // This allows for explicit permission denial in role hierarchies
  granted: {
    type: Boolean,
    default: true
  },
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index for role and permission to ensure uniqueness
rolePermissionSchema.index({ role: 1, permission: 1 }, { unique: true });

// Pre-save middleware to update timestamps
rolePermissionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to assign a permission to a role
rolePermissionSchema.statics.assignPermissionToRole = async function(roleId, permissionId, constraints = {}, granted = true, userId = null) {
  try {
    // Check if assignment already exists
    let rolePermission = await this.findOne({ role: roleId, permission: permissionId });
    
    // If assignment exists, update it
    if (rolePermission) {
      rolePermission.constraints = constraints;
      rolePermission.granted = granted;
      if (userId) rolePermission.updatedBy = userId;
      await rolePermission.save();
    } else {
      // Create new assignment
      rolePermission = await this.create({
        role: roleId,
        permission: permissionId,
        constraints,
        granted,
        createdBy: userId,
        updatedBy: userId
      });
    }
    
    return rolePermission;
  } catch (error) {
    throw error;
  }
};

// Static method to revoke a permission from a role
rolePermissionSchema.statics.revokePermissionFromRole = async function(roleId, permissionId) {
  try {
    const result = await this.deleteOne({ role: roleId, permission: permissionId });
    return result.deletedCount > 0;
  } catch (error) {
    throw error;
  }
};

// Static method to get all permissions for a role (including parent roles)
rolePermissionSchema.statics.getPermissionsForRole = async function(roleId, includeParents = true) {
  const Role = mongoose.model('Role');
  const Permission = mongoose.model('Permission');
  
  try {
    // Get the role
    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
    
    // Get direct permissions for this role
    const directPermissions = await this.find({ role: roleId })
      .populate('permission')
      .lean();
    
    // If we don't need parent permissions, return direct permissions
    if (!includeParents || !role.parent) {
      return directPermissions;
    }
    
    // Get parent roles
    const parentRoles = await role.getParentRoles();
    
    // Get permissions for parent roles
    const parentPermissionSets = await Promise.all(
      parentRoles.map(parentRole => 
        this.find({ role: parentRole._id })
          .populate('permission')
          .lean()
      )
    );
    
    // Flatten parent permissions
    const parentPermissions = parentPermissionSets.flat();
    
    // Combine direct and parent permissions, with direct permissions taking precedence
    const allPermissions = [...parentPermissions];
    
    // Add direct permissions, overriding parent permissions if they exist
    for (const directPerm of directPermissions) {
      const permKey = directPerm.permission.getKey();
      
      // Find index of parent permission with same key
      const parentIndex = allPermissions.findIndex(
        p => p.permission.getKey() === permKey
      );
      
      if (parentIndex >= 0) {
        // Override parent permission
        allPermissions[parentIndex] = directPerm;
      } else {
        // Add new permission
        allPermissions.push(directPerm);
      }
    }
    
    return allPermissions;
  } catch (error) {
    throw error;
  }
};

const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);

module.exports = RolePermission;
