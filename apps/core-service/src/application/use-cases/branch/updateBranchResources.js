/**
 * Update Branch Resources Use Case
 * Handles the business logic for updating a branch's resource allocation
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * Update branch resources
 * @param {string} id - Branch ID
 * @param {Object} resources - Resources data
 * @param {string} userId - User ID updating the resources
 * @returns {Promise<Object>} - Returns updated branch
 */
const updateBranchResources = async (id, resources, userId) => {
  try {
    // Check if branch exists
    const branch = await branchRepository.findById(id);
    if (!branch) {
      throw new Error(`Branch with ID ${id} not found`);
    }
    
    // Validate resources
    if (resources.employeeCount !== undefined && resources.employeeCount < 0) {
      throw new Error('Employee count cannot be negative');
    }
    
    if (resources.vehicleCount !== undefined && resources.vehicleCount < 0) {
      throw new Error('Vehicle count cannot be negative');
    }
    
    if (resources.storageCapacity !== undefined && resources.storageCapacity < 0) {
      throw new Error('Storage capacity cannot be negative');
    }
    
    // Update resources
    const updatedBranch = await branchRepository.updateResources(id, resources);
    
    // Update metadata
    await branchRepository.updateById(id, {
      updatedBy: userId,
      updatedAt: new Date()
    });
    
    logger.info(`Branch resources updated: ${branch.code}`, { branchId: id, userId });
    
    return updatedBranch;
  } catch (error) {
    logger.error(`Error updating branch resources: ${error.message}`, { error, branchId: id, resources });
    throw error;
  }
};

module.exports = updateBranchResources;
