/**
 * Update Branch Use Case
 * Handles the business logic for updating an existing branch
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * Update an existing branch
 * @param {string} id - Branch ID
 * @param {Object} updateData - Data to update
 * @param {string} userId - User ID updating the branch
 * @returns {Promise<Object>} - Returns updated branch
 */
const updateBranch = async (id, updateData, userId) => {
  try {
    // Check if branch exists
    const branch = await branchRepository.findById(id);
    if (!branch) {
      throw new Error(`Branch with ID ${id} not found`);
    }
    
    // If code is being updated, check if new code already exists
    if (updateData.code && updateData.code !== branch.code) {
      const existingBranch = await branchRepository.findByCode(updateData.code);
      if (existingBranch && existingBranch._id.toString() !== id) {
        throw new Error(`Branch with code ${updateData.code} already exists`);
      }
    }
    
    // Set metadata
    updateData.updatedBy = userId;
    updateData.updatedAt = new Date();
    
    // Update branch
    const updatedBranch = await branchRepository.updateById(id, updateData);
    
    logger.info(`Branch updated: ${updatedBranch.code} - ${updatedBranch.name}`, { branchId: id, userId });
    
    return updatedBranch;
  } catch (error) {
    logger.error(`Error updating branch: ${error.message}`, { error, branchId: id, updateData });
    throw error;
  }
};

module.exports = updateBranch;
