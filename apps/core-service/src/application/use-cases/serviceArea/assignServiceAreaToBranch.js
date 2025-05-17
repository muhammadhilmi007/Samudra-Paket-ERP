/**
 * Assign Service Area to Branch Use Case
 * Assigns a service area to a branch with priority control
 */

const branchServiceAreaRepository = require('../../../infrastructure/repositories/branchServiceAreaRepository');
const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const branchRepository = require('../../../infrastructure/repositories/branchRepository');
const { NotFoundError, ValidationError } = require('../../../utils/errors');

/**
 * Assign a service area to a branch
 * @param {String} branchId - Branch ID
 * @param {String} serviceAreaId - Service area ID
 * @param {Number} priorityLevel - Priority level (lower number = higher priority)
 * @param {String} notes - Assignment notes
 * @param {String} userId - ID of the user making the assignment
 * @returns {Promise<Object>} - Created branch service area assignment
 */
const assignServiceAreaToBranch = async (branchId, serviceAreaId, priorityLevel, notes, userId) => {
  // Check if branch exists
  const branch = await branchRepository.findById(branchId);
  if (!branch) {
    throw new NotFoundError('Branch not found');
  }
  
  // Check if service area exists
  const serviceArea = await serviceAreaRepository.findById(serviceAreaId);
  if (!serviceArea) {
    throw new NotFoundError('Service area not found');
  }
  
  // Check if assignment already exists
  const existingAssignment = await branchServiceAreaRepository.findByBranchAndServiceArea(branchId, serviceAreaId);
  if (existingAssignment) {
    throw new ValidationError('Service area is already assigned to this branch');
  }
  
  // Validate priority level
  if (priorityLevel < 1 || priorityLevel > 10) {
    throw new ValidationError('Priority level must be between 1 and 10');
  }
  
  // Create the assignment
  return branchServiceAreaRepository.assignServiceAreaToBranch(
    branchId,
    serviceAreaId,
    priorityLevel,
    notes,
    userId
  );
};

module.exports = assignServiceAreaToBranch;
