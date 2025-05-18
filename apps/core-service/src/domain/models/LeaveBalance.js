/**
 * LeaveBalance Model
 * Defines the LeaveBalance entity for tracking employee leave balances and accruals
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define leave balance schema
const leaveBalanceSchema = new Schema({
  // Employee reference
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  
  // Year for the balance
  year: {
    type: Number,
    required: true
  },
  
  // Leave type balances
  balances: [{
    type: {
      type: String,
      enum: ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'BEREAVEMENT', 'UNPAID', 'RELIGIOUS', 'MARRIAGE', 'EMERGENCY', 'OTHER'],
      required: true
    },
    
    // Initial allocation
    allocated: {
      type: Number,
      required: true,
      default: 0
    },
    
    // Additional allocations
    additional: {
      type: Number,
      default: 0
    },
    
    // Used leave days
    used: {
      type: Number,
      default: 0
    },
    
    // Pending leave requests (not yet approved)
    pending: {
      type: Number,
      default: 0
    },
    
    // Carried over from previous year
    carriedOver: {
      type: Number,
      default: 0
    },
    
    // Expiry date for carried over days
    carryOverExpiry: {
      type: Date
    },
    
    // Maximum allowed carryover
    maxCarryOver: {
      type: Number,
      default: 0
    },
    
    // Balance adjustments with reasons
    adjustments: [{
      amount: {
        type: Number,
        required: true
      },
      reason: {
        type: String,
        required: true,
        trim: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }]
  }],
  
  // Accrual settings
  accrualSettings: {
    // Whether leave accrues monthly
    isMonthlyAccrual: {
      type: Boolean,
      default: false
    },
    
    // Amount accrued per month
    monthlyAccrualAmount: {
      type: Number,
      default: 0
    },
    
    // Maximum accrual limit
    maxAccrualLimit: {
      type: Number,
      default: 0
    },
    
    // Accrual start date (usually join date or year start)
    accrualStartDate: {
      type: Date
    },
    
    // Whether prorated based on join date
    isProratedFirstYear: {
      type: Boolean,
      default: true
    }
  },
  
  // Accrual history
  accrualHistory: [{
    date: {
      type: Date,
      required: true
    },
    leaveType: {
      type: String,
      enum: ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'BEREAVEMENT', 'UNPAID', 'RELIGIOUS', 'MARRIAGE', 'EMERGENCY', 'OTHER'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true,
      enum: ['MONTHLY_ACCRUAL', 'ANNUAL_ALLOCATION', 'ADJUSTMENT', 'EXPIRY', 'CARRYOVER'],
      default: 'MONTHLY_ACCRUAL'
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  
  // Last calculation date
  lastCalculationDate: {
    type: Date,
    default: Date.now
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

// Add compound index for employee and year
leaveBalanceSchema.index({ employeeId: 1, year: 1 }, { unique: true });

// Create and export the model
const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);

module.exports = LeaveBalance;
