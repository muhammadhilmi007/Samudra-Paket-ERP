/**
 * Delete Service Area Use Case
 * Deletes a service area
 */

const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const branchServiceAreaRepository = require('../../../infrastructure/repositories/branchServiceAreaRepository');
const serviceAreaPricingRepository = require('../../../infrastructure/repositories/serviceAreaPricingRepository');
const { NotFoundError, ValidationError } = require('../../../utils/errors');

/**
 * Delete a service area
 * @param {String} id - Service area ID
 * @param {String} userId - ID of the user deleting the service area
 * @param {String} reason - Reason for deletion
 * @param {Boolean} force - Whether to force deletion even if there are dependencies
 * @returns {Promise<Boolean>} - Whether the deletion was successful
 */
const deleteServiceArea = async (id, userId, reason = '', force = false) => {
  // Check if service area exists
  const serviceArea = await serviceAreaRepository.findById(id);
  if (!serviceArea) {
    throw new NotFoundError('Service area not found');
  }
  
  // Check if service area is assigned to any branches
  const { assignments } = await branchServiceAreaRepository.findBranchesByServiceArea(id, {}, 1, 1);
  if (assignments.length > 0 && !force) {
    throw new ValidationError('Service area is assigned to one or more branches. Use force=true to delete anyway.');
  }
  
  // Check if service area has pricing configurations
  const { pricingConfigurations } = await serviceAreaPricingRepository.findAllByServiceArea(id, {}, 1, 1);
  if (pricingConfigurations.length > 0 && !force) {
    throw new ValidationError('Service area has pricing configurations. Use force=true to delete anyway.');
  }
  
  // If force is true, delete all dependencies first
  if (force) {
    // Get all branch assignments
    const allAssignments = await branchServiceAreaRepository.findBranchesByServiceArea(id, {}, 1, 100);
    for (const assignment of allAssignments.assignments) {
      await branchServiceAreaRepository.removeAssignment(assignment._id, userId, 'Removed due to service area deletion');
    }
    
    // Get all pricing configurations
    const allPricings = await serviceAreaPricingRepository.findAllByServiceArea(id, {}, 1, 100);
    for (const pricing of allPricings.pricingConfigurations) {
      await serviceAreaPricingRepository.deletePricing(pricing._id, userId, 'Deleted due to service area deletion');
    }
  }
  
  // Delete the service area
  const deleted = await serviceAreaRepository.deleteServiceArea(id, userId, reason);
  if (!deleted) {
    throw new NotFoundError('Service area not found');
  }
  
  return true;
};

module.exports = deleteServiceArea;
