/**
 * EmployeeHistory Model
 * Tracks all changes to employee records for audit and compliance purposes
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeHistorySchema = new Schema({
  // Reference to the employee
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  
  // Change information
  changeType: {
    type: String,
    enum: [
      'CREATE', 
      'UPDATE', 
      'STATUS_CHANGE', 
      'ASSIGNMENT_CHANGE', 
      'DOCUMENT_ADDED', 
      'DOCUMENT_UPDATED',
      'DOCUMENT_VERIFIED',
      'CONTRACT_ADDED',
      'CONTRACT_UPDATED',
      'CONTRACT_TERMINATED',
      'SKILL_ADDED',
      'SKILL_UPDATED',
      'TRAINING_ADDED',
      'TRAINING_UPDATED',
      'PERFORMANCE_EVALUATION',
      'CAREER_DEVELOPMENT_UPDATE',
      'USER_ACCOUNT_LINKED',
      'USER_ACCOUNT_UNLINKED'
    ],
    required: true
  },
  
  // Fields that were changed
  changedFields: [String],
  
  // Previous and new values
  previousValue: {
    type: Schema.Types.Mixed
  },
  newValue: {
    type: Schema.Types.Mixed
  },
  
  // Change description
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Metadata
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  },
  
  // Timestamps and user tracking
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  changedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
});

// Indexes for efficient querying
employeeHistorySchema.index({ employeeId: 1, timestamp: -1 });
employeeHistorySchema.index({ changeType: 1, timestamp: -1 });
employeeHistorySchema.index({ changedBy: 1, timestamp: -1 });
employeeHistorySchema.index({ timestamp: -1 });

const EmployeeHistory = mongoose.model('EmployeeHistory', employeeHistorySchema);

module.exports = EmployeeHistory;
