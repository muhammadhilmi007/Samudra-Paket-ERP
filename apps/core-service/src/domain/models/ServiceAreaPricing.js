/**
 * Service Area Pricing Model
 * Defines pricing rules for service areas based on distance, weight, and service type
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Service Area Pricing Schema
 */
const serviceAreaPricingSchema = new Schema({
  // Service Area Reference
  serviceArea: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceArea',
    required: [true, 'Service area reference is required']
  },
  
  // Service Type
  serviceType: {
    type: String,
    enum: {
      values: ['REGULAR', 'EXPRESS', 'SAME_DAY', 'NEXT_DAY', 'ECONOMY'],
      message: 'Service type must be REGULAR, EXPRESS, SAME_DAY, NEXT_DAY, or ECONOMY'
    },
    required: [true, 'Service type is required']
  },
  
  // Base Pricing
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Base price cannot be negative']
  },
  
  // Distance-based Pricing
  pricePerKm: {
    type: Number,
    required: [true, 'Price per kilometer is required'],
    min: [0, 'Price per kilometer cannot be negative']
  },
  
  // Weight-based Pricing
  pricePerKg: {
    type: Number,
    required: [true, 'Price per kilogram is required'],
    min: [0, 'Price per kilogram cannot be negative']
  },
  
  // Minimum and Maximum Charges
  minCharge: {
    type: Number,
    required: [true, 'Minimum charge is required'],
    min: [0, 'Minimum charge cannot be negative']
  },
  maxCharge: {
    type: Number,
    min: [0, 'Maximum charge cannot be negative']
  },
  
  // Additional Fees
  insuranceFee: {
    type: Number,
    default: 0,
    min: [0, 'Insurance fee cannot be negative']
  },
  packagingFee: {
    type: Number,
    default: 0,
    min: [0, 'Packaging fee cannot be negative']
  },
  
  // Effective Date Range
  effectiveFrom: {
    type: Date,
    default: Date.now
  },
  effectiveTo: {
    type: Date,
    default: null
  },
  
  // Status
  status: {
    type: String,
    enum: {
      values: ['ACTIVE', 'INACTIVE'],
      message: 'Status must be ACTIVE or INACTIVE'
    },
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
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create compound index for unique serviceArea-serviceType combinations
serviceAreaPricingSchema.index({ serviceArea: 1, serviceType: 1 }, { unique: true });

// Create index for efficient queries
serviceAreaPricingSchema.index({ serviceArea: 1 });
serviceAreaPricingSchema.index({ serviceType: 1 });
serviceAreaPricingSchema.index({ status: 1 });
serviceAreaPricingSchema.index({ effectiveFrom: 1, effectiveTo: 1 });

/**
 * Calculate shipping price based on distance and weight
 * @param {Number} distance - Distance in kilometers
 * @param {Number} weight - Weight in kilograms
 * @returns {Number} - Calculated shipping price
 */
serviceAreaPricingSchema.methods.calculatePrice = function(distance, weight) {
  // Calculate base price components
  const distancePrice = distance * this.pricePerKm;
  const weightPrice = weight * this.pricePerKg;
  
  // Calculate total price
  let totalPrice = this.basePrice + distancePrice + weightPrice;
  
  // Apply minimum charge if total price is below minimum
  if (totalPrice < this.minCharge) {
    totalPrice = this.minCharge;
  }
  
  // Apply maximum charge if total price is above maximum and max charge is set
  if (this.maxCharge && totalPrice > this.maxCharge) {
    totalPrice = this.maxCharge;
  }
  
  // Add additional fees
  totalPrice += this.insuranceFee + this.packagingFee;
  
  return Math.round(totalPrice); // Round to nearest integer
};

/**
 * Find active pricing rule for a service area and service type
 * @param {ObjectId} serviceAreaId - Service area ID
 * @param {String} serviceType - Service type
 * @returns {Object} - Active pricing rule
 */
serviceAreaPricingSchema.statics.findActivePricing = function(serviceAreaId, serviceType) {
  const now = new Date();
  
  return this.findOne({
    serviceArea: serviceAreaId,
    serviceType: serviceType,
    status: 'ACTIVE',
    effectiveFrom: { $lte: now },
    $or: [
      { effectiveTo: null },
      { effectiveTo: { $gte: now } }
    ]
  });
};

/**
 * Create ServiceAreaPricing model
 */
const ServiceAreaPricing = mongoose.model('ServiceAreaPricing', serviceAreaPricingSchema);

module.exports = ServiceAreaPricing;
