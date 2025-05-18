/**
 * WorkSchedule Model
 * Defines the WorkSchedule entity for managing employee work schedules and shifts
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define work schedule schema
const workScheduleSchema = new Schema({
  // Name of the schedule
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Code for the schedule
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  
  // Description
  description: {
    type: String,
    trim: true
  },
  
  // Schedule type
  type: {
    type: String,
    enum: ['REGULAR', 'SHIFT', 'FLEXIBLE', 'CUSTOM'],
    default: 'REGULAR'
  },
  
  // Status
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  
  // Working days
  workingDays: {
    monday: {
      type: Boolean,
      default: true
    },
    tuesday: {
      type: Boolean,
      default: true
    },
    wednesday: {
      type: Boolean,
      default: true
    },
    thursday: {
      type: Boolean,
      default: true
    },
    friday: {
      type: Boolean,
      default: true
    },
    saturday: {
      type: Boolean,
      default: false
    },
    sunday: {
      type: Boolean,
      default: false
    }
  },
  
  // Working hours
  workingHours: {
    // Regular schedule
    regular: {
      startTime: {
        type: String,
        default: '08:00'
      },
      endTime: {
        type: String,
        default: '17:00'
      },
      breakStartTime: {
        type: String,
        default: '12:00'
      },
      breakEndTime: {
        type: String,
        default: '13:00'
      },
      // Grace period for late check-in (in minutes)
      lateGracePeriod: {
        type: Number,
        default: 15
      },
      // Total work hours per day
      totalHours: {
        type: Number,
        default: 8
      }
    },
    
    // Shift-based schedule
    shifts: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      code: {
        type: String,
        required: true,
        trim: true
      },
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      breakDuration: {
        type: Number, // in minutes
        default: 60
      },
      // Total work hours per shift
      totalHours: {
        type: Number,
        required: true
      },
      // Grace period for late check-in (in minutes)
      lateGracePeriod: {
        type: Number,
        default: 15
      },
      // Is overnight shift
      isOvernight: {
        type: Boolean,
        default: false
      }
    }]
  },
  
  // Overtime settings
  overtimeSettings: {
    // Whether overtime is allowed
    isAllowed: {
      type: Boolean,
      default: true
    },
    // Maximum overtime hours per day
    maxDailyHours: {
      type: Number,
      default: 3
    },
    // Maximum overtime hours per week
    maxWeeklyHours: {
      type: Number,
      default: 15
    },
    // Minimum overtime duration to be counted (in minutes)
    minimumDuration: {
      type: Number,
      default: 30
    },
    // Whether pre-approval is required
    requiresApproval: {
      type: Boolean,
      default: true
    }
  },
  
  // Flexible time settings
  flexibleSettings: {
    // Core hours when employee must be present
    coreStartTime: {
      type: String,
      default: '10:00'
    },
    coreEndTime: {
      type: String,
      default: '15:00'
    },
    // Flexible start time range
    flexStartTimeMin: {
      type: String,
      default: '07:00'
    },
    flexStartTimeMax: {
      type: String,
      default: '10:00'
    },
    // Flexible end time range
    flexEndTimeMin: {
      type: String,
      default: '15:00'
    },
    flexEndTimeMax: {
      type: String,
      default: '19:00'
    },
    // Minimum working hours per day
    minWorkingHours: {
      type: Number,
      default: 8
    }
  },
  
  // Geofencing settings
  geofencing: {
    // Whether geofencing is enabled
    enabled: {
      type: Boolean,
      default: false
    },
    // Locations where check-in/out is allowed
    locations: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      address: {
        type: String,
        required: true,
        trim: true
      },
      coordinates: {
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
      // Radius in meters within which check-in/out is allowed
      radius: {
        type: Number,
        required: true,
        default: 100
      }
    }]
  },
  
  // Applicable branches
  branches: [{
    type: Schema.Types.ObjectId,
    ref: 'Branch'
  }],
  
  // Applicable departments
  divisions: [{
    type: Schema.Types.ObjectId,
    ref: 'Division'
  }],
  
  // Applicable positions
  positions: [{
    type: Schema.Types.ObjectId,
    ref: 'Position'
  }],
  
  // Effective date range
  effectiveStartDate: {
    type: Date,
    default: Date.now
  },
  effectiveEndDate: {
    type: Date
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

// Add geospatial index for geofencing locations
workScheduleSchema.index({ 'geofencing.locations.coordinates': '2dsphere' });

// Create and export the model
const WorkSchedule = mongoose.model('WorkSchedule', workScheduleSchema);

module.exports = WorkSchedule;
