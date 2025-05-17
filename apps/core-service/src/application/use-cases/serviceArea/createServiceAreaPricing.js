/**
 * Create Service Area Pricing Use Case
 * Creates a new pricing configuration for a service area
 */

const serviceAreaPricingRepository = require('../../../infrastructure/repositories/serviceAreaPricingRepository');
const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const { NotFoundError, ValidationError } = require('../../../utils/errors');

/**
 * Create a new pricing configuration for a service area
 * @param {Object} pricingData - Pricing configuration data
 * @param {String} userId - ID of the user creating the pricing
 * @returns {Promise<Object>} - Created pricing configuration
 */
const createServiceAreaPricing = async (pricingData, userId) => {
  // Check if service area exists
  const serviceArea = await serviceAreaRepository.findById(pricingData.serviceArea);
  if (!serviceArea) {
    throw new NotFoundError('Service area not found');
  }
  
  // Check if pricing configuration already exists for this service area and service type
  const existingPricing = await serviceAreaPricingRepository.findByServiceAreaAndType(
    pricingData.serviceArea,
    pricingData.serviceType
  );
  
  if (existingPricing) {
    throw new ValidationError('Pricing configuration already exists for this service area and service type');
  }
  
  // Validate pricing data
  if (pricingData.basePrice < 0) {
    throw new ValidationError('Base price cannot be negative');
  }
  
  if (pricingData.pricePerKm < 0) {
    throw new ValidationError('Price per kilometer cannot be negative');
  }
  
  if (pricingData.pricePerKg < 0) {
    throw new ValidationError('Price per kilogram cannot be negative');
  }
  
  if (pricingData.minCharge < 0) {
    throw new ValidationError('Minimum charge cannot be negative');
  }
  
  if (pricingData.maxCharge !== undefined && pricingData.maxCharge < pricingData.minCharge) {
    throw new ValidationError('Maximum charge cannot be less than minimum charge');
  }
  
  // Create the pricing configuration
  return serviceAreaPricingRepository.createPricing(pricingData, userId);
};

module.exports = createServiceAreaPricing;
