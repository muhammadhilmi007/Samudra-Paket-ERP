/**
 * Update Branch Status Use Case
 * Handles the business logic for updating a branch's status
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * Update branch status
 * @param {string} id - Branch ID
 * @param {string} status - New status (ACTIVE, INACTIVE, PENDING, CLOSED)
 * @param {string} reason - Reason for status change
 * @param {string} userId - User ID updating the status
 * @returns {Promise<Object>} - Returns updated branch
 */
const updateBranchStatus = async (id, status, reason, userId) => {
  try {
    // Check if branch exists
    const branch = await branchRepository.findById(id);
    if (!branch) {
      throw new Error(`Branch with ID ${id} not found`);
    }
    
    // Validate status
    const validStatuses = ['ACTIVE', 'INACTIVE', 'PENDING', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    // Update status
    const updatedBranch = await branchRepository.updateStatus(id, status, reason, userId);
    
    logger.info(`Branch status updated: ${branch.code} - ${status}`, { branchId: id, status, userId });
    
    return updatedBranch;
  } catch (error) {
    logger.error(`Error updating branch status: ${error.message}`, { error, branchId: id, status });
    throw error;
  }
};

module.exports = updateBranchStatus;
