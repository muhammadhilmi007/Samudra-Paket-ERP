/**
 * Get Branch Hierarchy Use Case
 * Handles the business logic for retrieving branch hierarchy
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * Get branch hierarchy
 * @param {string} id - Branch ID (optional, if not provided returns full hierarchy)
 * @returns {Promise<Object>} - Returns branch hierarchy
 */
const getBranchHierarchy = async (id = null) => {
  try {
    // Get branch hierarchy
    const hierarchy = await branchRepository.getHierarchy(id);
    
    return hierarchy;
  } catch (error) {
    logger.error(`Error getting branch hierarchy: ${error.message}`, { error, branchId: id });
    throw error;
  }
};

module.exports = getBranchHierarchy;
