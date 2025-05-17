/**
 * Update Service Area Assignment Use Case
 * Updates a branch service area assignment
 */

const branchServiceAreaRepository = require('../../../infrastructure/repositories/branchServiceAreaRepository');
const { NotFoundError, ValidationError } = require('../../../utils/errors');

/**
 * Update a branch service area assignment
 * @param {String} id - Assignment ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - ID of the user updating the assignment
 * @returns {Promise<Object>} - Updated assignment
 */
const updateServiceAreaAssignment = async (id, updateData, userId) => {
  // Check if assignment exists
  const assignment = await branchServiceAreaRepository.findById(id);
  if (!assignment) {
    throw new NotFoundError('Service area assignment not found');
  }
  
  // Validate priority level if it's being updated
  if (updateData.priorityLevel !== undefined) {
    if (updateData.priorityLevel < 1 || updateData.priorityLevel > 10) {
      throw new ValidationError('Priority level must be between 1 and 10');
    }
  }
  
  // Update the assignment
  const updatedAssignment = await branchServiceAreaRepository.updateAssignment(id, updateData, userId);
  if (!updatedAssignment) {
    throw new NotFoundError('Service area assignment not found');
  }
  
  return updatedAssignment;
};

module.exports = updateServiceAreaAssignment;
