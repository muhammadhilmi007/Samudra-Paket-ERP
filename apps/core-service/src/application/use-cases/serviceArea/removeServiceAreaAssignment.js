/**
 * Remove Service Area Assignment Use Case
 * Removes a service area assignment from a branch
 */

const branchServiceAreaRepository = require('../../../infrastructure/repositories/branchServiceAreaRepository');
const { NotFoundError } = require('../../../utils/errors');

/**
 * Remove a service area assignment from a branch
 * @param {String} id - Assignment ID
 * @param {String} userId - ID of the user removing the assignment
 * @param {String} reason - Reason for removal
 * @returns {Promise<Boolean>} - Whether the removal was successful
 */
const removeServiceAreaAssignment = async (id, userId, reason = '') => {
  // Check if assignment exists
  const assignment = await branchServiceAreaRepository.findById(id);
  if (!assignment) {
    throw new NotFoundError('Service area assignment not found');
  }
  
  // Remove the assignment
  const removed = await branchServiceAreaRepository.removeAssignment(id, userId, reason);
  if (!removed) {
    throw new NotFoundError('Service area assignment not found');
  }
  
  return true;
};

module.exports = removeServiceAreaAssignment;
