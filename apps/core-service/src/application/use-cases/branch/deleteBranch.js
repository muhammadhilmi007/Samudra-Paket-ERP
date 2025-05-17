/**
 * Delete Branch Use Case
 * Handles the business logic for deleting a branch
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * Delete a branch by ID
 * @param {string} id - Branch ID
 * @returns {Promise<Object>} - Returns deleted branch
 */
const deleteBranch = async (id) => {
  try {
    // Check if branch exists
    const branch = await branchRepository.findById(id);
    if (!branch) {
      throw new Error(`Branch with ID ${id} not found`);
    }
    
    // Check if branch has children
    const children = await branch.getChildren();
    if (children.length > 0) {
      throw new Error(`Cannot delete branch with children. Please reassign or delete child branches first.`);
    }
    
    // Delete branch
    const deletedBranch = await branchRepository.deleteById(id);
    
    logger.info(`Branch deleted: ${deletedBranch.code} - ${deletedBranch.name}`, { branchId: id });
    
    return deletedBranch;
  } catch (error) {
    logger.error(`Error deleting branch: ${error.message}`, { error, branchId: id });
    throw error;
  }
};

module.exports = deleteBranch;
