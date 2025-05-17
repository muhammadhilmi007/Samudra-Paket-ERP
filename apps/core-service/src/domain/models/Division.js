/**
 * Division Model
 * Represents a division in the organizational structure
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const divisionSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Division name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Division code is required'],
    trim: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Division',
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: 0
  },
  path: {
    type: String,
    default: ''
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    default: null
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  metrics: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  budget: {
    annual: {
      type: Number,
      default: 0
    },
    spent: {
      type: Number,
      default: 0
    },
    remaining: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'IDR'
    },
    fiscalYear: {
      type: Number,
      default: () => new Date().getFullYear()
    }
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId
  }
}, {
  timestamps: true
});

// Create indexes
divisionSchema.index({ code: 1 }, { unique: true });
divisionSchema.index({ parent: 1 });
divisionSchema.index({ status: 1 });
divisionSchema.index({ branch: 1 });
divisionSchema.index({ path: 1 });

// Pre-save middleware to set the path
divisionSchema.pre('save', async function(next) {
  try {
    // If this is a new division or the parent has changed
    if (this.isNew || this.isModified('parent')) {
      // If there's no parent, this is a top-level division
      if (!this.parent) {
        this.level = 0;
        this.path = this.code;
      } else {
        // Find the parent division to get its path and level
        const parentDivision = await this.constructor.findById(this.parent);
        if (!parentDivision) {
          throw new Error('Parent division not found');
        }
        
        this.level = parentDivision.level + 1;
        this.path = `${parentDivision.path}.${this.code}`;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to get all child divisions
divisionSchema.statics.findChildren = function(divisionId) {
  return this.find({ parent: divisionId });
};

// Static method to get all descendants (recursive children)
divisionSchema.statics.findDescendants = function(divisionPath) {
  return this.find({ path: new RegExp(`^${divisionPath}\\.`) });
};

// Static method to get division with its manager
divisionSchema.statics.findWithManager = function(divisionId) {
  return this.findById(divisionId).populate('manager');
};

// Static method to get division with its parent
divisionSchema.statics.findWithParent = function(divisionId) {
  return this.findById(divisionId).populate('parent');
};

// Static method to get division with its branch
divisionSchema.statics.findWithBranch = function(divisionId) {
  return this.findById(divisionId).populate('branch');
};

// Static method to get division hierarchy
divisionSchema.statics.getHierarchy = async function() {
  // Get all divisions
  const divisions = await this.find({}).sort({ level: 1, code: 1 });
  
  // Create a map of divisions by ID for quick lookup
  const divisionsMap = {};
  divisions.forEach(division => {
    divisionsMap[division._id.toString()] = {
      ...division.toObject(),
      children: []
    };
  });
  
  // Build the hierarchy
  const hierarchy = [];
  divisions.forEach(division => {
    const divisionId = division._id.toString();
    
    // If this division has a parent, add it to the parent's children
    if (division.parent) {
      const parentId = division.parent.toString();
      if (divisionsMap[parentId]) {
        divisionsMap[parentId].children.push(divisionsMap[divisionId]);
      }
    } else {
      // This is a top-level division, add it to the hierarchy
      hierarchy.push(divisionsMap[divisionId]);
    }
  });
  
  return hierarchy;
};

const Division = mongoose.model('Division', divisionSchema);

module.exports = Division;
