/**
 * Get Service Area History Use Case
 * Retrieves the change history for a service area
 */

const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const { NotFoundError } = require('../../../utils/errors');

/**
 * Get service area history
 * @param {String} id - Service area ID
 * @returns {Promise<Array>} - History entries for the service area
 */
const getServiceAreaHistory = async (id) => {
  // Check if service area exists
  const serviceArea = await serviceAreaRepository.findById(id);
  if (!serviceArea) {
    throw new NotFoundError('Service area not found');
  }
  
  // Get the history
  return serviceAreaRepository.getServiceAreaHistory(id);
};

module.exports = getServiceAreaHistory;
