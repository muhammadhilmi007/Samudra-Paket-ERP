/**
 * Branch Service Area Model
 * Defines the relationship between branches and service areas with priority control
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Branch Service Area Schema
 */
const branchServiceAreaSchema = new Schema({
  // Branch Reference
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'Branch reference is required']
  },
  
  // Service Area Reference
  serviceArea: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceArea',
    required: [true, 'Service area reference is required']
  },
  
  // Priority Level (for overlap handling)
  priorityLevel: {
    type: Number,
    required: [true, 'Priority level is required'],
    min: [1, 'Priority level must be at least 1'],
    max: [10, 'Priority level cannot exceed 10'],
    default: 5
  },
  
  // Assignment Status
  status: {
    type: String,
    enum: {
      values: ['ACTIVE', 'INACTIVE'],
      message: 'Status must be ACTIVE or INACTIVE'
    },
    default: 'ACTIVE'
  },
  
  // Assignment Notes
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  
  // Metadata
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedAt: {
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

// Create compound index for unique branch-serviceArea combinations
branchServiceAreaSchema.index({ branch: 1, serviceArea: 1 }, { unique: true });

// Create index for efficient queries by branch or service area
branchServiceAreaSchema.index({ branch: 1 });
branchServiceAreaSchema.index({ serviceArea: 1 });

// Create index for priority-based queries
branchServiceAreaSchema.index({ serviceArea: 1, priorityLevel: 1 });

/**
 * Find the highest priority branch for a service area
 * @param {ObjectId} serviceAreaId - Service area ID
 * @returns {Object} - Highest priority branch service area assignment
 */
branchServiceAreaSchema.statics.findHighestPriorityBranch = function(serviceAreaId) {
  return this.findOne({ 
    serviceArea: serviceAreaId,
    status: 'ACTIVE'
  })
  .sort({ priorityLevel: 1 }) // Lower number = higher priority
  .populate('branch');
};

/**
 * Find all branches serving a service area, ordered by priority
 * @param {ObjectId} serviceAreaId - Service area ID
 * @returns {Array} - Branch service area assignments ordered by priority
 */
branchServiceAreaSchema.statics.findBranchesByServiceArea = function(serviceAreaId) {
  return this.find({ 
    serviceArea: serviceAreaId,
    status: 'ACTIVE'
  })
  .sort({ priorityLevel: 1 }) // Lower number = higher priority
  .populate('branch');
};

/**
 * Find all service areas assigned to a branch
 * @param {ObjectId} branchId - Branch ID
 * @returns {Array} - Branch service area assignments
 */
branchServiceAreaSchema.statics.findServiceAreasByBranch = function(branchId) {
  return this.find({ 
    branch: branchId,
    status: 'ACTIVE'
  })
  .populate('serviceArea');
};

/**
 * Create BranchServiceArea model
 */
const BranchServiceArea = mongoose.model('BranchServiceArea', branchServiceAreaSchema);

module.exports = BranchServiceArea;
