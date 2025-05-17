/**
 * Get Service Area Pricing Use Case
 * Retrieves a pricing configuration by ID
 */

const serviceAreaPricingRepository = require('../../../infrastructure/repositories/serviceAreaPricingRepository');
const { NotFoundError } = require('../../../utils/errors');

/**
 * Get a pricing configuration by ID
 * @param {String} id - Pricing configuration ID
 * @returns {Promise<Object>} - Found pricing configuration
 */
const getServiceAreaPricing = async (id) => {
  const pricing = await serviceAreaPricingRepository.findById(id);
  
  if (!pricing) {
    throw new NotFoundError('Pricing configuration not found');
  }
  
  return pricing;
};

module.exports = getServiceAreaPricing;
