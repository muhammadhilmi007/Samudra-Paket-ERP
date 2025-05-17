/**
 * Service Area History Model
 * Tracks changes to service areas for auditing and history tracking
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Service Area History Schema
 */
const serviceAreaHistorySchema = new Schema({
  // Service Area Reference
  serviceArea: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceArea',
    required: [true, 'Service area reference is required']
  },
  
  // Change Type
  changeType: {
    type: String,
    enum: {
      values: ['CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'BOUNDARY_CHANGE', 'ASSIGNMENT_CHANGE'],
      message: 'Change type must be CREATE, UPDATE, DELETE, STATUS_CHANGE, BOUNDARY_CHANGE, or ASSIGNMENT_CHANGE'
    },
    required: [true, 'Change type is required']
  },
  
  // Previous State (JSON snapshot)
  previousState: {
    type: Object,
    default: null
  },
  
  // New State (JSON snapshot)
  newState: {
    type: Object,
    default: null
  },
  
  // Change Details
  changes: [{
    field: {
      type: String,
      required: true
    },
    oldValue: {
      type: Schema.Types.Mixed
    },
    newValue: {
      type: Schema.Types.Mixed
    }
  }],
  
  // Change Reason
  reason: {
    type: String,
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  
  // Metadata
  changedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for efficient queries
serviceAreaHistorySchema.index({ serviceArea: 1 });
serviceAreaHistorySchema.index({ changedAt: -1 });
serviceAreaHistorySchema.index({ changeType: 1 });
serviceAreaHistorySchema.index({ changedBy: 1 });

/**
 * Find history entries for a service area
 * @param {ObjectId} serviceAreaId - Service area ID
 * @returns {Array} - History entries for the service area
 */
serviceAreaHistorySchema.statics.findByServiceArea = function(serviceAreaId) {
  return this.find({ serviceArea: serviceAreaId })
    .sort({ changedAt: -1 })
    .populate('changedBy', 'username name');
};

/**
 * Create a history entry for a service area change
 * @param {Object} serviceArea - Service area document
 * @param {String} changeType - Type of change
 * @param {Object} previousState - Previous state of the service area
 * @param {Object} changes - Detailed changes
 * @param {String} reason - Reason for the change
 * @param {ObjectId} userId - User ID of the person making the change
 * @returns {Object} - Created history entry
 */
serviceAreaHistorySchema.statics.createHistoryEntry = async function(
  serviceArea,
  changeType,
  previousState,
  changes,
  reason,
  userId
) {
  return this.create({
    serviceArea: serviceArea._id,
    changeType,
    previousState,
    newState: serviceArea.toObject(),
    changes,
    reason,
    changedBy: userId,
    changedAt: new Date()
  });
};

/**
 * Create ServiceAreaHistory model
 */
const ServiceAreaHistory = mongoose.model('ServiceAreaHistory', serviceAreaHistorySchema);

module.exports = ServiceAreaHistory;
