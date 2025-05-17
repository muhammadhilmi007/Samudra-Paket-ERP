/**
 * Delete Service Area Pricing Use Case
 * Deletes a pricing configuration for a service area
 */

const serviceAreaPricingRepository = require('../../../infrastructure/repositories/serviceAreaPricingRepository');
const { NotFoundError } = require('../../../utils/errors');

/**
 * Delete a pricing configuration
 * @param {String} id - Pricing configuration ID
 * @param {String} userId - ID of the user deleting the pricing
 * @param {String} reason - Reason for deletion
 * @returns {Promise<Boolean>} - Whether the deletion was successful
 */
const deleteServiceAreaPricing = async (id, userId, reason = '') => {
  // Check if pricing configuration exists
  const pricing = await serviceAreaPricingRepository.findById(id);
  if (!pricing) {
    throw new NotFoundError('Pricing configuration not found');
  }
  
  // Delete the pricing configuration
  const deleted = await serviceAreaPricingRepository.deletePricing(id, userId, reason);
  if (!deleted) {
    throw new NotFoundError('Pricing configuration not found');
  }
  
  return true;
};

module.exports = deleteServiceAreaPricing;
