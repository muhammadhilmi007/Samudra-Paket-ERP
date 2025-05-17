/**
 * Service Area Pricing Repository
 * Handles data access operations for service area pricing configurations
 */

const { ServiceAreaPricing, ServiceAreaHistory } = require('../../domain/models');
const mongoose = require('mongoose');

/**
 * Create a new pricing configuration for a service area
 * @param {Object} pricingData - Pricing configuration data
 * @param {String} userId - ID of the user creating the pricing
 * @returns {Promise<Object>} - Created pricing configuration
 */
const createPricing = async (pricingData, userId) => {
  const pricing = new ServiceAreaPricing({
    ...pricingData,
    createdBy: userId
  });
  
  const savedPricing = await pricing.save();
  
  // Create history entry for the service area
  await ServiceAreaHistory.createHistoryEntry(
    { _id: pricingData.serviceArea },
    'UPDATE',
    null,
    [{
      field: 'pricing',
      oldValue: null,
      newValue: savedPricing.toObject()
    }],
    `Created ${pricingData.serviceType} pricing configuration`,
    userId
  );
  
  return savedPricing.populate('serviceArea');
};

/**
 * Find pricing configuration by ID
 * @param {String} id - Pricing configuration ID
 * @returns {Promise<Object>} - Found pricing configuration or null
 */
const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return ServiceAreaPricing.findById(id).populate('serviceArea');
};

/**
 * Find pricing configuration by service area and service type
 * @param {String} serviceAreaId - Service area ID
 * @param {String} serviceType - Service type
 * @returns {Promise<Object>} - Found pricing configuration or null
 */
const findByServiceAreaAndType = async (serviceAreaId, serviceType) => {
  return ServiceAreaPricing.findOne({
    serviceArea: serviceAreaId,
    serviceType: serviceType.toUpperCase()
  }).populate('serviceArea');
};

/**
 * Find active pricing configuration by service area and service type
 * @param {String} serviceAreaId - Service area ID
 * @param {String} serviceType - Service type
 * @returns {Promise<Object>} - Found active pricing configuration or null
 */
const findActivePricing = async (serviceAreaId, serviceType) => {
  return ServiceAreaPricing.findActivePricing(serviceAreaId, serviceType.toUpperCase());
};

/**
 * Find all pricing configurations for a service area
 * @param {String} serviceAreaId - Service area ID
 * @param {Object} filter - Filter criteria
 * @param {Number} page - Page number (1-based)
 * @param {Number} limit - Number of items per page
 * @returns {Promise<Object>} - Paginated pricing configurations
 */
const findAllByServiceArea = async (serviceAreaId, filter = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  // Combine service area ID with other filters
  const combinedFilter = {
    serviceArea: serviceAreaId,
    ...filter
  };
  
  // Process filter for service type
  if (filter.serviceType) {
    combinedFilter.serviceType = filter.serviceType.toUpperCase();
  }
  
  // Process filter for status
  if (filter.status) {
    combinedFilter.status = filter.status.toUpperCase();
  }
  
  const total = await ServiceAreaPricing.countDocuments(combinedFilter);
  const pricingConfigurations = await ServiceAreaPricing.find(combinedFilter)
    .sort({ serviceType: 1, effectiveFrom: -1 })
    .skip(skip)
    .limit(limit)
    .populate('serviceArea');
  
  return {
    pricingConfigurations,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Update a pricing configuration
 * @param {String} id - Pricing configuration ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - ID of the user updating the pricing
 * @returns {Promise<Object>} - Updated pricing configuration
 */
const updatePricing = async (id, updateData, userId) => {
  const pricing = await findById(id);
  if (!pricing) {
    return null;
  }
  
  const previousState = pricing.toObject();
  
  // Track changes
  const changes = [];
  Object.keys(updateData).forEach(key => {
    if (JSON.stringify(pricing[key]) !== JSON.stringify(updateData[key])) {
      changes.push({
        field: key,
        oldValue: pricing[key],
        newValue: updateData[key]
      });
    }
  });
  
  // Update the pricing configuration
  Object.assign(pricing, updateData);
  pricing.updatedBy = userId;
  
  const updatedPricing = await pricing.save();
  
  // Create history entry for the service area if there are changes
  if (changes.length > 0) {
    await ServiceAreaHistory.createHistoryEntry(
      { _id: pricing.serviceArea._id },
      'UPDATE',
      { pricing: previousState },
      [{
        field: 'pricing',
        oldValue: previousState,
        newValue: updatedPricing.toObject()
      }],
      `Updated ${pricing.serviceType} pricing configuration`,
      userId
    );
  }
  
  return updatedPricing.populate('serviceArea');
};

/**
 * Delete a pricing configuration
 * @param {String} id - Pricing configuration ID
 * @param {String} userId - ID of the user deleting the pricing
 * @param {String} reason - Reason for deletion
 * @returns {Promise<Boolean>} - Whether the deletion was successful
 */
const deletePricing = async (id, userId, reason = '') => {
  const pricing = await findById(id);
  if (!pricing) {
    return false;
  }
  
  const previousState = pricing.toObject();
  
  // Create history entry before deletion
  await ServiceAreaHistory.createHistoryEntry(
    { _id: pricing.serviceArea._id },
    'UPDATE',
    { pricing: previousState },
    [{
      field: 'pricing',
      oldValue: previousState,
      newValue: null
    }],
    reason || `Deleted ${pricing.serviceType} pricing configuration`,
    userId
  );
  
  await ServiceAreaPricing.findByIdAndDelete(id);
  return true;
};

/**
 * Calculate shipping price for a service area
 * @param {String} serviceAreaId - Service area ID
 * @param {String} serviceType - Service type
 * @param {Number} distance - Distance in kilometers
 * @param {Number} weight - Weight in kilograms
 * @returns {Promise<Object>} - Calculated price and pricing details
 */
const calculatePrice = async (serviceAreaId, serviceType, distance, weight) => {
  const pricing = await findActivePricing(serviceAreaId, serviceType);
  if (!pricing) {
    throw new Error(`No active pricing found for service area ${serviceAreaId} and service type ${serviceType}`);
  }
  
  const price = pricing.calculatePrice(distance, weight);
  
  return {
    price,
    details: {
      basePrice: pricing.basePrice,
      distanceCharge: distance * pricing.pricePerKm,
      weightCharge: weight * pricing.pricePerKg,
      additionalFees: pricing.insuranceFee + pricing.packagingFee,
      minCharge: pricing.minCharge,
      maxCharge: pricing.maxCharge || null
    },
    pricing
  };
};

module.exports = {
  createPricing,
  findById,
  findByServiceAreaAndType,
  findActivePricing,
  findAllByServiceArea,
  updatePricing,
  deletePricing,
  calculatePrice
};
