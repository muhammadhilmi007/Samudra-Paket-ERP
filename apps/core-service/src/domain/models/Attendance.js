/**
 * Attendance Model
 * Defines the Attendance entity for employee attendance tracking
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define attendance record schema
const attendanceSchema = new Schema({
  // Employee reference
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  
  // Date of attendance
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // Check-in details
  checkIn: {
    time: {
      type: Date,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    device: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Check-out details
  checkOut: {
    time: {
      type: Date
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number] // [longitude, latitude]
      }
    },
    device: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Attendance status
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'EARLY_DEPARTURE', 'ON_LEAVE', 'HOLIDAY', 'WEEKEND'],
    required: true,
    default: 'PRESENT'
  },
  
  // Work duration in minutes
  workDuration: {
    type: Number,
    default: 0
  },
  
  // Overtime duration in minutes
  overtimeDuration: {
    type: Number,
    default: 0
  },
  
  // Break time records
  breaks: [{
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date
    },
    duration: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ['LUNCH', 'REST', 'PRAYER', 'OTHER'],
      default: 'REST'
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  
  // Anomaly flags
  anomalies: {
    isLate: {
      type: Boolean,
      default: false
    },
    isEarlyDeparture: {
      type: Boolean,
      default: false
    },
    isIncomplete: {
      type: Boolean,
      default: false
    },
    isOutsideGeofence: {
      type: Boolean,
      default: false
    }
  },
  
  // Correction request
  correctionRequest: {
    requested: {
      type: Boolean,
      default: false
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    requestedAt: {
      type: Date
    },
    reason: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    reviewNotes: {
      type: String,
      trim: true
    }
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

// Add compound index for employee and date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// Add geospatial index for check-in and check-out locations
attendanceSchema.index({ 'checkIn.location': '2dsphere' });
attendanceSchema.index({ 'checkOut.location': '2dsphere' });

// Create and export the model
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
