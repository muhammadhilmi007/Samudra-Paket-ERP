/**
 * UserRole Model
 * Defines the many-to-many relationship between users and roles
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
  // User reference
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Role reference
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  // Optional scope for the role (e.g., specific branch, department, etc.)
  scope: {
    type: Schema.Types.Mixed,
    default: null
  },
  // Expiration date for temporary role assignments
  expiresAt: {
    type: Date,
    default: null
  },
  // Whether this role assignment is active
  isActive: {
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

// Compound index for user and role to ensure uniqueness
userRoleSchema.index({ user: 1, role: 1 }, { unique: true });

// Pre-save middleware to update timestamps
userRoleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to assign a role to a user
userRoleSchema.statics.assignRoleToUser = async function(userId, roleId, options = {}, assignedBy = null) {
  const { scope = null, expiresAt = null, isActive = true } = options;
  
  try {
    // Check if assignment already exists
    let userRole = await this.findOne({ user: userId, role: roleId });
    
    // If assignment exists, update it
    if (userRole) {
      userRole.scope = scope;
      userRole.expiresAt = expiresAt;
      userRole.isActive = isActive;
      if (assignedBy) userRole.updatedBy = assignedBy;
      await userRole.save();
    } else {
      // Create new assignment
      userRole = await this.create({
        user: userId,
        role: roleId,
        scope,
        expiresAt,
        isActive,
        createdBy: assignedBy,
        updatedBy: assignedBy
      });
    }
    
    return userRole;
  } catch (error) {
    throw error;
  }
};

// Static method to revoke a role from a user
userRoleSchema.statics.revokeRoleFromUser = async function(userId, roleId) {
  try {
    const result = await this.deleteOne({ user: userId, role: roleId });
    return result.deletedCount > 0;
  } catch (error) {
    throw error;
  }
};

// Static method to get all active roles for a user
userRoleSchema.statics.getActiveRolesForUser = async function(userId) {
  try {
    const now = new Date();
    
    // Find all active role assignments that haven't expired
    const userRoles = await this.find({
      user: userId,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).populate('role');
    
    return userRoles;
  } catch (error) {
    throw error;
  }
};

// Static method to check if a user has a specific role
userRoleSchema.statics.userHasRole = async function(userId, roleName) {
  try {
    const Role = mongoose.model('Role');
    
    // Find the role by name
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return false;
    }
    
    // Check if user has this role
    const now = new Date();
    const userRole = await this.findOne({
      user: userId,
      role: role._id,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    });
    
    return !!userRole;
  } catch (error) {
    throw error;
  }
};

// Static method to get all users with a specific role
userRoleSchema.statics.getUsersWithRole = async function(roleId) {
  try {
    const now = new Date();
    
    // Find all active role assignments for this role
    const userRoles = await this.find({
      role: roleId,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).populate('user');
    
    return userRoles.map(ur => ur.user);
  } catch (error) {
    throw error;
  }
};

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;
