/**
 * Permission Model
 * Defines the Permission entity for granular access control
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  // Resource being accessed (e.g., 'users', 'shipments', 'reports')
  resource: {
    type: String,
    required: true,
    trim: true
  },
  // Action being performed (e.g., 'create', 'read', 'update', 'delete', 'list')
  action: {
    type: String,
    required: true,
    trim: true
  },
  // Optional attributes/constraints for conditional permissions
  // (e.g., { ownedByUser: true } for resources owned by the user)
  attributes: {
    type: Schema.Types.Mixed,
    default: {}
  },
  // Description of what this permission allows
  description: {
    type: String,
    trim: true
  },
  // Whether this is a system permission that cannot be modified or deleted
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

// Compound index for resource and action to ensure uniqueness
permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

// Pre-save middleware to update timestamps
permissionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate permission key (used for caching and quick lookups)
permissionSchema.methods.getKey = function() {
  return `${this.resource}:${this.action}`;
};

// Static method to find or create a permission
permissionSchema.statics.findOrCreate = async function(permissionData) {
  const { resource, action } = permissionData;
  
  try {
    // Try to find existing permission
    let permission = await this.findOne({ resource, action });
    
    // If permission doesn't exist, create it
    if (!permission) {
      permission = await this.create(permissionData);
    }
    
    return permission;
  } catch (error) {
    throw error;
  }
};

// Check if a permission matches a request context
permissionSchema.methods.matchesContext = function(context) {
  // If no attributes defined, permission applies to all contexts
  if (!this.attributes || Object.keys(this.attributes).length === 0) {
    return true;
  }
  
  // Check if all attributes in the permission match the context
  for (const [key, value] of Object.entries(this.attributes)) {
    // If context doesn't have the attribute or values don't match
    if (!context[key] || context[key] !== value) {
      return false;
    }
  }
  
  return true;
};

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
