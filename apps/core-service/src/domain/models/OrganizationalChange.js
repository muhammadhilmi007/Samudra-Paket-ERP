/**
 * Organizational Change Model
 * Tracks changes to divisions and positions in the organizational structure
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationalChangeSchema = new Schema({
  entityType: {
    type: String,
    enum: ['DIVISION', 'POSITION'],
    required: true
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  changeType: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'TRANSFER', 'RESTRUCTURE'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  previousState: {
    type: Schema.Types.Mixed
  },
  newState: {
    type: Schema.Types.Mixed
  },
  changedFields: {
    type: [String],
    default: []
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
organizationalChangeSchema.index({ entityType: 1, entityId: 1 });
organizationalChangeSchema.index({ changeType: 1 });
organizationalChangeSchema.index({ effectiveDate: 1 });
organizationalChangeSchema.index({ createdAt: 1 });

// Static method to get changes for a specific entity
organizationalChangeSchema.statics.findByEntity = function(entityType, entityId) {
  return this.find({ 
    entityType, 
    entityId 
  }).sort({ createdAt: -1 });
};

// Static method to get changes by type
organizationalChangeSchema.statics.findByChangeType = function(changeType) {
  return this.find({ changeType }).sort({ createdAt: -1 });
};

// Static method to get changes in a date range
organizationalChangeSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    effectiveDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ effectiveDate: -1 });
};

// Static method to get recent changes
organizationalChangeSchema.statics.findRecentChanges = function(limit = 10) {
  return this.find({})
    .sort({ createdAt: -1 })
    .limit(limit);
};

const OrganizationalChange = mongoose.model('OrganizationalChange', organizationalChangeSchema);

module.exports = OrganizationalChange;
