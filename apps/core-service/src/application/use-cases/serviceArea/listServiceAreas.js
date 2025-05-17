/**
 * List Service Areas Use Case
 * Lists service areas with pagination and filtering
 */

const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');

/**
 * List service areas with pagination and filtering
 * @param {Object} filter - Filter criteria
 * @param {Number} page - Page number (1-based)
 * @param {Number} limit - Number of items per page
 * @param {Object} sort - Sort criteria
 * @returns {Promise<Object>} - Paginated service areas
 */
const listServiceAreas = async (filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) => {
  return serviceAreaRepository.findAll(filter, page, limit, sort);
};

module.exports = listServiceAreas;
