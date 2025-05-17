/**
 * Create Branch Use Case
 * Handles the business logic for creating a new branch
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * Create a new branch
 * @param {Object} branchData - Branch data
 * @param {string} userId - User ID creating the branch
 * @returns {Promise<Object>} - Returns created branch
 */
const createBranch = async (branchData, userId) => {
  try {
    // Check if branch with same code already exists
    const existingBranch = await branchRepository.findByCode(branchData.code);
    if (existingBranch) {
      throw new Error(`Branch with code ${branchData.code} already exists`);
    }
    
    // Set metadata
    branchData.createdBy = userId;
    
    // Create branch
    const branch = await branchRepository.createBranch(branchData);
    
    logger.info(`Branch created: ${branch.code} - ${branch.name}`, { branchId: branch._id, userId });
    
    return branch;
  } catch (error) {
    logger.error(`Error creating branch: ${error.message}`, { error, branchData });
    throw error;
  }
};

module.exports = createBranch;
