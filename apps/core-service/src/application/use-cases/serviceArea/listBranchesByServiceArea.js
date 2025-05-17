/**
 * List Branches by Service Area Use Case
 * Lists branches assigned to a service area with pagination and filtering
 */

const branchServiceAreaRepository = require('../../../infrastructure/repositories/branchServiceAreaRepository');
const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const { NotFoundError } = require('../../../utils/errors');

/**
 * List branches assigned to a service area
 * @param {String} serviceAreaId - Service area ID
 * @param {Object} filter - Filter criteria
 * @param {Number} page - Page number (1-based)
 * @param {Number} limit - Number of items per page
 * @returns {Promise<Object>} - Paginated branch assignments
 */
const listBranchesByServiceArea = async (serviceAreaId, filter = {}, page = 1, limit = 10) => {
  // Check if service area exists
  const serviceArea = await serviceAreaRepository.findById(serviceAreaId);
  if (!serviceArea) {
    throw new NotFoundError('Service area not found');
  }
  
  return branchServiceAreaRepository.findBranchesByServiceArea(serviceAreaId, filter, page, limit);
};

module.exports = listBranchesByServiceArea;
