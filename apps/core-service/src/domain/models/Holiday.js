/**
 * Holiday Model
 * Defines the Holiday entity for managing company holidays
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define holiday schema
const holidaySchema = new Schema({
  // Holiday name
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Holiday date
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // Holiday type
  type: {
    type: String,
    enum: ['NATIONAL', 'RELIGIOUS', 'COMPANY', 'LOCAL', 'OTHER'],
    required: true,
    default: 'NATIONAL'
  },
  
  // Description
  description: {
    type: String,
    trim: true
  },
  
  // Is recurring yearly
  isRecurring: {
    type: Boolean,
    default: true
  },
  
  // For recurring holidays, store month and day for easy querying
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  day: {
    type: Number,
    min: 1,
    max: 31
  },
  
  // Is half day
  isHalfDay: {
    type: Boolean,
    default: false
  },
  
  // Half day portion (if applicable)
  halfDayPortion: {
    type: String,
    enum: ['MORNING', 'AFTERNOON'],
    default: 'AFTERNOON'
  },
  
  // Applicable to specific branches only
  applicableBranches: [{
    type: Schema.Types.ObjectId,
    ref: 'Branch'
  }],
  
  // Applicable to specific divisions only
  applicableDivisions: [{
    type: Schema.Types.ObjectId,
    ref: 'Division'
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

// Add compound index for date and type
holidaySchema.index({ date: 1, type: 1 });

// Create and export the model
const Holiday = mongoose.model('Holiday', holidaySchema);

module.exports = Holiday;
