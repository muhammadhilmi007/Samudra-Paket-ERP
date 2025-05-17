/**
 * Branch Model
 * Defines the schema for branch entities with hierarchical structure
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Branch Schema
 */
const branchSchema = new Schema({
  // Basic Information
  code: {
    type: String,
    required: [true, 'Branch code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [10, 'Branch code cannot exceed 10 characters']
  },
  name: {
    type: String,
    required: [true, 'Branch name is required'],
    trim: true,
    maxlength: [100, 'Branch name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Branch type is required'],
    enum: {
      values: ['HEAD_OFFICE', 'REGIONAL', 'BRANCH'],
      message: 'Branch type must be HEAD_OFFICE, REGIONAL, or BRANCH'
    }
  },
  
  // Hierarchy Information
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    default: null
  },
  level: {
    type: Number,
    required: true,
    min: [0, 'Branch level must be at least 0'],
    max: [10, 'Branch level cannot exceed 10']
  },
  path: {
    type: String,
    default: ''
  },
  
  // Status Information
  status: {
    type: String,
    required: true,
    enum: {
      values: ['ACTIVE', 'INACTIVE', 'PENDING', 'CLOSED'],
      message: 'Status must be ACTIVE, INACTIVE, PENDING, or CLOSED'
    },
    default: 'ACTIVE'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'CLOSED']
    },
    reason: {
      type: String,
      trim: true
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Contact Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    province: {
      type: String,
      required: [true, 'Province is required'],
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'Indonesia',
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        default: null
      },
      longitude: {
        type: Number,
        default: null
      }
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    fax: {
      type: String,
      trim: true,
      default: null
    },
    website: {
      type: String,
      trim: true,
      default: null
    }
  },
  
  // Operational Information
  operationalHours: [{
    day: {
      type: String,
      required: true,
      enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    openTime: {
      type: String,
      validate: {
        validator: function(v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: props => `${props.value} is not a valid time format (HH:MM)`
      }
    },
    closeTime: {
      type: String,
      validate: {
        validator: function(v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: props => `${props.value} is not a valid time format (HH:MM)`
      }
    }
  }],
  
  // Resource Information
  resources: {
    employeeCount: {
      type: Number,
      default: 0,
      min: [0, 'Employee count cannot be negative']
    },
    vehicleCount: {
      type: Number,
      default: 0,
      min: [0, 'Vehicle count cannot be negative']
    },
    storageCapacity: {
      type: Number,
      default: 0,
      min: [0, 'Storage capacity cannot be negative']
    }
  },
  
  // Performance Metrics
  metrics: {
    monthlyShipmentVolume: {
      type: Number,
      default: 0
    },
    monthlyRevenue: {
      type: Number,
      default: 0
    },
    customerSatisfactionScore: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be less than 0'],
      max: [5, 'Score cannot exceed 5']
    },
    deliverySuccessRate: {
      type: Number,
      default: 0,
      min: [0, 'Rate cannot be less than 0'],
      max: [100, 'Rate cannot exceed 100']
    }
  },
  
  // Document Management
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['LICENSE', 'PERMIT', 'CERTIFICATE', 'CONTRACT', 'OTHER']
    },
    fileUrl: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      default: null
    }
  }],
  
  // Metadata
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

/**
 * Pre-save middleware to update path and timestamps
 */
branchSchema.pre('save', async function(next) {
  // Only update path if parent or code has changed
  if (this.isModified('parent') || this.isModified('code') || this.isNew) {
    try {
      if (!this.parent) {
        // Root branch
        this.path = this.code;
        this.level = 0;
      } else {
        // Child branch
        const parentBranch = await this.constructor.findById(this.parent);
        if (!parentBranch) {
          return next(new Error('Parent branch not found'));
        }
        this.path = `${parentBranch.path}.${this.code}`;
        this.level = parentBranch.level + 1;
      }
    } catch (error) {
      return next(error);
    }
  }
  
  // Update timestamps
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  
  next();
});

/**
 * Add status change to history
 */
branchSchema.methods.updateStatus = function(status, reason, userId) {
  this.status = status;
  this.statusHistory.push({
    status,
    reason,
    changedBy: userId,
    changedAt: Date.now()
  });
  return this.save();
};

/**
 * Get all child branches
 */
branchSchema.methods.getChildren = function() {
  return this.constructor.find({ parent: this._id });
};

/**
 * Get full branch hierarchy (children and descendants)
 */
branchSchema.methods.getDescendants = function() {
  return this.constructor.find({ path: new RegExp(`^${this.path}\\.`) });
};

/**
 * Get branch ancestors
 */
branchSchema.methods.getAncestors = async function() {
  const ancestors = [];
  const pathParts = this.path.split('.');
  
  // Remove the last part (current branch code)
  pathParts.pop();
  
  let currentPath = '';
  for (const part of pathParts) {
    currentPath = currentPath ? `${currentPath}.${part}` : part;
    const ancestor = await this.constructor.findOne({ path: currentPath });
    if (ancestor) {
      ancestors.push(ancestor);
    }
  }
  
  return ancestors;
};

/**
 * Static method to find branches by type
 */
branchSchema.statics.findByType = function(type) {
  return this.find({ type });
};

/**
 * Static method to find active branches
 */
branchSchema.statics.findActive = function() {
  return this.find({ status: 'ACTIVE' });
};

/**
 * Create Branch model
 */
const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;
