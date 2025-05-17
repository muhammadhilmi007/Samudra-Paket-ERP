/**
 * Update Service Area Pricing Use Case
 * Updates a pricing configuration for a service area
 */

const serviceAreaPricingRepository = require('../../../infrastructure/repositories/serviceAreaPricingRepository');
const { NotFoundError, ValidationError } = require('../../../utils/errors');

/**
 * Update a pricing configuration
 * @param {String} id - Pricing configuration ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - ID of the user updating the pricing
 * @returns {Promise<Object>} - Updated pricing configuration
 */
const updateServiceAreaPricing = async (id, updateData, userId) => {
  // Check if pricing configuration exists
  const pricing = await serviceAreaPricingRepository.findById(id);
  if (!pricing) {
    throw new NotFoundError('Pricing configuration not found');
  }
  
  // Validate pricing data
  if (updateData.basePrice !== undefined && updateData.basePrice < 0) {
    throw new ValidationError('Base price cannot be negative');
  }
  
  if (updateData.pricePerKm !== undefined && updateData.pricePerKm < 0) {
    throw new ValidationError('Price per kilometer cannot be negative');
  }
  
  if (updateData.pricePerKg !== undefined && updateData.pricePerKg < 0) {
    throw new ValidationError('Price per kilogram cannot be negative');
  }
  
  if (updateData.minCharge !== undefined && updateData.minCharge < 0) {
    throw new ValidationError('Minimum charge cannot be negative');
  }
  
  // Check if max charge is less than min charge
  const maxCharge = updateData.maxCharge !== undefined ? updateData.maxCharge : pricing.maxCharge;
  const minCharge = updateData.minCharge !== undefined ? updateData.minCharge : pricing.minCharge;
  
  if (maxCharge !== undefined && maxCharge !== null && maxCharge < minCharge) {
    throw new ValidationError('Maximum charge cannot be less than minimum charge');
  }
  
  // Update the pricing configuration
  const updatedPricing = await serviceAreaPricingRepository.updatePricing(id, updateData, userId);
  if (!updatedPricing) {
    throw new NotFoundError('Pricing configuration not found');
  }
  
  return updatedPricing;
};

module.exports = updateServiceAreaPricing;
