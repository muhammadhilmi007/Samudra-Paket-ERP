/**
 * List Service Area Pricings Use Case
 * Lists pricing configurations for a service area
 */

const serviceAreaPricingRepository = require('../../../infrastructure/repositories/serviceAreaPricingRepository');
const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const { NotFoundError } = require('../../../utils/errors');

/**
 * List pricing configurations for a service area
 * @param {String} serviceAreaId - Service area ID
 * @param {Object} filter - Filter criteria
 * @param {Number} page - Page number (1-based)
 * @param {Number} limit - Number of items per page
 * @returns {Promise<Object>} - Paginated pricing configurations
 */
const listServiceAreaPricings = async (serviceAreaId, filter = {}, page = 1, limit = 10) => {
  // Check if service area exists
  const serviceArea = await serviceAreaRepository.findById(serviceAreaId);
  if (!serviceArea) {
    throw new NotFoundError('Service area not found');
  }
  
  return serviceAreaPricingRepository.findAllByServiceArea(serviceAreaId, filter, page, limit);
};

module.exports = listServiceAreaPricings;
