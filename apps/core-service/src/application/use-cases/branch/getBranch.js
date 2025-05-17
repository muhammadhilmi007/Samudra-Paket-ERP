/**
 * Get Branch Use Case
 * Handles the business logic for retrieving branch details
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * Get branch by ID
 * @param {string} id - Branch ID
 * @returns {Promise<Object>} - Returns branch details
 */
const getBranch = async (id) => {
  try {
    const branch = await branchRepository.findById(id);
    if (!branch) {
      throw new Error(`Branch with ID ${id} not found`);
    }
    
    return branch;
  } catch (error) {
    logger.error(`Error getting branch: ${error.message}`, { error, branchId: id });
    throw error;
  }
};

module.exports = getBranch;
