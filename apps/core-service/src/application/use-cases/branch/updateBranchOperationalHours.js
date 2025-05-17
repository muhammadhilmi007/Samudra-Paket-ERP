/**
 * Update Branch Operational Hours Use Case
 * Handles the business logic for updating a branch's operational hours
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * Update branch operational hours
 * @param {string} id - Branch ID
 * @param {Array} operationalHours - Operational hours data
 * @param {string} userId - User ID updating the operational hours
 * @returns {Promise<Object>} - Returns updated branch
 */
const updateBranchOperationalHours = async (id, operationalHours, userId) => {
  try {
    // Check if branch exists
    const branch = await branchRepository.findById(id);
    if (!branch) {
      throw new Error(`Branch with ID ${id} not found`);
    }
    
    // Validate operational hours
    const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    
    // Ensure all days are present and valid
    const daysSet = new Set(operationalHours.map(oh => oh.day));
    
    if (daysSet.size !== validDays.length) {
      throw new Error(`All days of the week must be specified`);
    }
    
    for (const oh of operationalHours) {
      if (!validDays.includes(oh.day)) {
        throw new Error(`Invalid day: ${oh.day}. Must be one of: ${validDays.join(', ')}`);
      }
      
      if (oh.isOpen) {
        if (!oh.openTime || !timeRegex.test(oh.openTime)) {
          throw new Error(`Invalid open time for ${oh.day}: ${oh.openTime}. Must be in format HH:MM`);
        }
        
        if (!oh.closeTime || !timeRegex.test(oh.closeTime)) {
          throw new Error(`Invalid close time for ${oh.day}: ${oh.closeTime}. Must be in format HH:MM`);
        }
      }
    }
    
    // Update operational hours
    const updatedBranch = await branchRepository.updateOperationalHours(id, operationalHours);
    
    // Update metadata
    await branchRepository.updateById(id, {
      updatedBy: userId,
      updatedAt: new Date()
    });
    
    logger.info(`Branch operational hours updated: ${branch.code}`, { branchId: id, userId });
    
    return updatedBranch;
  } catch (error) {
    logger.error(`Error updating branch operational hours: ${error.message}`, { error, branchId: id });
    throw error;
  }
};

module.exports = updateBranchOperationalHours;
