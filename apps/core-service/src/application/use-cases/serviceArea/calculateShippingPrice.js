/**
 * Calculate Shipping Price Use Case
 * Calculates shipping price based on service area, distance, and weight
 */

const serviceAreaPricingRepository = require('../../../infrastructure/repositories/serviceAreaPricingRepository');
const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const { NotFoundError, ValidationError } = require('../../../utils/errors');

/**
 * Calculate shipping price
 * @param {String} serviceAreaId - Service area ID
 * @param {String} serviceType - Service type
 * @param {Number} distance - Distance in kilometers
 * @param {Number} weight - Weight in kilograms
 * @returns {Promise<Object>} - Calculated price and pricing details
 */
const calculateShippingPrice = async (serviceAreaId, serviceType, distance, weight) => {
  // Check if service area exists
  const serviceArea = await serviceAreaRepository.findById(serviceAreaId);
  if (!serviceArea) {
    throw new NotFoundError('Service area not found');
  }
  
  // Validate input
  if (distance < 0) {
    throw new ValidationError('Distance cannot be negative');
  }
  
  if (weight <= 0) {
    throw new ValidationError('Weight must be greater than zero');
  }
  
  // Normalize service type
  const normalizedServiceType = serviceType.toUpperCase();
  
  // Calculate price
  try {
    return serviceAreaPricingRepository.calculatePrice(
      serviceAreaId,
      normalizedServiceType,
      distance,
      weight
    );
  } catch (error) {
    if (error.message.includes('No active pricing found')) {
      throw new NotFoundError(`No active pricing found for service area ${serviceAreaId} and service type ${normalizedServiceType}`);
    }
    throw error;
  }
};

module.exports = calculateShippingPrice;
