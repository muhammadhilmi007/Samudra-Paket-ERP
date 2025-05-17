/**
 * Get Service Area Use Case
 * Retrieves a service area by ID
 */

const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const { NotFoundError } = require('../../../utils/errors');

/**
 * Get a service area by ID
 * @param {String} id - Service area ID
 * @returns {Promise<Object>} - Found service area
 */
const getServiceArea = async (id) => {
  const serviceArea = await serviceAreaRepository.findById(id);
  
  if (!serviceArea) {
    throw new NotFoundError('Service area not found');
  }
  
  return serviceArea;
};

module.exports = getServiceArea;
