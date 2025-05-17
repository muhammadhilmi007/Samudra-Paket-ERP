/**
 * Role Model
 * Defines the Role entity for hierarchical RBAC
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  // Hierarchical structure - parent role
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    default: null
  },
  // Role level in hierarchy (0 is highest, e.g., superadmin)
  level: {
    type: Number,
    default: 0
  },
  // Whether this is a system role that cannot be modified or deleted
  isSystem: {
    type: Boolean,
    default: false
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

// Pre-save middleware to update timestamps
roleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Get all child roles (recursive)
roleSchema.methods.getChildRoles = async function() {
  const Role = mongoose.model('Role');
  
  // Find all direct children
  const directChildren = await Role.find({ parent: this._id });
  
  // If no children, return empty array
  if (directChildren.length === 0) {
    return [];
  }
  
  // Get all descendants recursively
  let allDescendants = [...directChildren];
  
  // For each direct child, get its children
  for (const child of directChildren) {
    const childDescendants = await child.getChildRoles();
    allDescendants = [...allDescendants, ...childDescendants];
  }
  
  return allDescendants;
};

// Get all parent roles (recursive)
roleSchema.methods.getParentRoles = async function() {
  const Role = mongoose.model('Role');
  const parents = [];
  
  let currentRole = this;
  
  // Follow the parent chain until we reach a role with no parent
  while (currentRole.parent) {
    const parentRole = await Role.findById(currentRole.parent);
    if (!parentRole) break;
    
    parents.push(parentRole);
    currentRole = parentRole;
  }
  
  return parents;
};

// Check if a role is a descendant of this role
roleSchema.methods.isDescendantOf = async function(roleId) {
  const Role = mongoose.model('Role');
  
  let currentRole = this;
  
  // Follow the parent chain until we reach a role with no parent
  while (currentRole.parent) {
    if (currentRole.parent.toString() === roleId.toString()) {
      return true;
    }
    
    const parentRole = await Role.findById(currentRole.parent);
    if (!parentRole) break;
    
    currentRole = parentRole;
  }
  
  return false;
};

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
