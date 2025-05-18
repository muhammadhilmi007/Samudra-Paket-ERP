/**
 * EmployeeSchedule Model
 * Defines the EmployeeSchedule entity for assigning work schedules to employees
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define employee schedule schema
const employeeScheduleSchema = new Schema({
  // Employee reference
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  
  // Work schedule reference
  scheduleId: {
    type: Schema.Types.ObjectId,
    ref: 'WorkSchedule',
    required: true
  },
  
  // Effective date range
  effectiveStartDate: {
    type: Date,
    required: true
  },
  effectiveEndDate: {
    type: Date
  },
  
  // For shift workers, assigned shifts
  shiftAssignments: [{
    date: {
      type: Date,
      required: true
    },
    shiftCode: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  
  // Override default schedule settings
  overrides: {
    // Custom working days
    workingDays: {
      monday: {
        type: Boolean
      },
      tuesday: {
        type: Boolean
      },
      wednesday: {
        type: Boolean
      },
      thursday: {
        type: Boolean
      },
      friday: {
        type: Boolean
      },
      saturday: {
        type: Boolean
      },
      sunday: {
        type: Boolean
      }
    },
    
    // Custom working hours
    workingHours: {
      startTime: {
        type: String
      },
      endTime: {
        type: String
      },
      breakStartTime: {
        type: String
      },
      breakEndTime: {
        type: String
      },
      lateGracePeriod: {
        type: Number
      }
    },
    
    // Custom geofencing settings
    geofencing: {
      enabled: {
        type: Boolean
      },
      locations: [{
        type: Schema.Types.ObjectId,
        ref: 'Branch'
      }]
    }
  },
  
  // Special date overrides (holidays, events, etc.)
  dateOverrides: [{
    date: {
      type: Date,
      required: true
    },
    isWorkingDay: {
      type: Boolean,
      required: true
    },
    startTime: {
      type: String
    },
    endTime: {
      type: String
    },
    reason: {
      type: String,
      required: true,
      trim: true
    }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
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

// Add compound index for employee and effective date range
employeeScheduleSchema.index({ 
  employeeId: 1, 
  effectiveStartDate: 1, 
  effectiveEndDate: 1 
});

// Add index for shift assignments
employeeScheduleSchema.index({ 
  employeeId: 1, 
  'shiftAssignments.date': 1 
});

// Create and export the model
const EmployeeSchedule = mongoose.model('EmployeeSchedule', employeeScheduleSchema);

module.exports = EmployeeSchedule;
