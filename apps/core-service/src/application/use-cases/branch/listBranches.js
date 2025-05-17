/**
 * List Branches Use Case
 * Handles the business logic for retrieving a list of branches with pagination and filtering
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * List branches with pagination and filtering
 * @param {Object} options - Query options
 * @param {Object} options.filter - Filter criteria
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {Object} options.sort - Sort criteria
 * @returns {Promise<Object>} - Returns paginated branches
 */
const listBranches = async ({ filter = {}, page = 1, limit = 10, sort = { createdAt: -1 } }) => {
  try {
    // Process filter parameters
    const processedFilter = { ...filter };
    
    // Handle status filter
    if (filter.status) {
      processedFilter.status = filter.status;
    }
    
    // Handle type filter
    if (filter.type) {
      processedFilter.type = filter.type;
    }
    
    // Handle parent filter
    if (filter.parent === 'null') {
      processedFilter.parent = null;
    } else if (filter.parent) {
      processedFilter.parent = filter.parent;
    }
    
    // Get branches with pagination
    const result = await branchRepository.findAll({
      filter: processedFilter,
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    });
    
    return result;
  } catch (error) {
    logger.error(`Error listing branches: ${error.message}`, { error, filter, page, limit });
    throw error;
  }
};

module.exports = listBranches;
