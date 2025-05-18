/**
 * Leave Model
 * Defines the Leave entity for employee leave management
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define leave request schema
const leaveSchema = new Schema({
  // Employee reference
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  
  // Leave type
  type: {
    type: String,
    enum: ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'BEREAVEMENT', 'UNPAID', 'RELIGIOUS', 'MARRIAGE', 'EMERGENCY', 'OTHER'],
    required: true
  },
  
  // Leave period
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Duration in days
  duration: {
    type: Number,
    required: true,
    min: 0.5
  },
  
  // Half day specification
  isHalfDay: {
    type: Boolean,
    default: false
  },
  halfDayPortion: {
    type: String,
    enum: ['MORNING', 'AFTERNOON'],
    default: 'MORNING'
  },
  
  // Reason for leave
  reason: {
    type: String,
    required: true,
    trim: true
  },
  
  // Supporting documents
  attachments: [{
    fileUrl: {
      type: String,
      required: true,
      trim: true
    },
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    fileType: {
      type: String,
      required: true,
      trim: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Approval workflow
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING'
  },
  
  // Approval history
  approvalHistory: [{
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
      required: true
    },
    approverRole: {
      type: String,
      required: true,
      trim: true
    },
    approverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    approverName: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Current approver
  currentApprover: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Notifications
  notifiedManager: {
    type: Boolean,
    default: false
  },
  notifiedHR: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add compound index for employee and leave period
leaveSchema.index({ employeeId: 1, startDate: 1, endDate: 1 });

// Create and export the model
const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
