/**
 * Update Branch Metrics Use Case
 * Handles the business logic for updating a branch's performance metrics
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * Update branch metrics
 * @param {string} id - Branch ID
 * @param {Object} metrics - Metrics data
 * @param {string} userId - User ID updating the metrics
 * @returns {Promise<Object>} - Returns updated branch
 */
const updateBranchMetrics = async (id, metrics, userId) => {
  try {
    // Check if branch exists
    const branch = await branchRepository.findById(id);
    if (!branch) {
      throw new Error(`Branch with ID ${id} not found`);
    }
    
    // Validate metrics
    if (metrics.customerSatisfactionScore !== undefined && (metrics.customerSatisfactionScore < 0 || metrics.customerSatisfactionScore > 5)) {
      throw new Error('Customer satisfaction score must be between 0 and 5');
    }
    
    if (metrics.deliverySuccessRate !== undefined && (metrics.deliverySuccessRate < 0 || metrics.deliverySuccessRate > 100)) {
      throw new Error('Delivery success rate must be between 0 and 100');
    }
    
    // Update metrics
    const updatedBranch = await branchRepository.updateMetrics(id, metrics);
    
    // Update metadata
    await branchRepository.updateById(id, {
      updatedBy: userId,
      updatedAt: new Date()
    });
    
    logger.info(`Branch metrics updated: ${branch.code}`, { branchId: id, userId });
    
    return updatedBranch;
  } catch (error) {
    logger.error(`Error updating branch metrics: ${error.message}`, { error, branchId: id, metrics });
    throw error;
  }
};

module.exports = updateBranchMetrics;
