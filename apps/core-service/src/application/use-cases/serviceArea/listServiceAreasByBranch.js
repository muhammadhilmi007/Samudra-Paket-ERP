/**
 * List Service Areas by Branch Use Case
 * Lists service areas assigned to a branch with pagination and filtering
 */

const branchServiceAreaRepository = require('../../../infrastructure/repositories/branchServiceAreaRepository');
const branchRepository = require('../../../infrastructure/repositories/branchRepository');
const { NotFoundError } = require('../../../utils/errors');

/**
 * List service areas assigned to a branch
 * @param {String} branchId - Branch ID
 * @param {Object} filter - Filter criteria
 * @param {Number} page - Page number (1-based)
 * @param {Number} limit - Number of items per page
 * @returns {Promise<Object>} - Paginated service area assignments
 */
const listServiceAreasByBranch = async (branchId, filter = {}, page = 1, limit = 10) => {
  // Check if branch exists
  const branch = await branchRepository.findById(branchId);
  if (!branch) {
    throw new NotFoundError('Branch not found');
  }
  
  return branchServiceAreaRepository.findServiceAreasByBranch(branchId, filter, page, limit);
};

module.exports = listServiceAreasByBranch;
