/**
 * Get Service Area Assignment Use Case
 * Retrieves a branch service area assignment by ID
 */

const branchServiceAreaRepository = require('../../../infrastructure/repositories/branchServiceAreaRepository');
const { NotFoundError } = require('../../../utils/errors');

/**
 * Get a branch service area assignment by ID
 * @param {String} id - Assignment ID
 * @returns {Promise<Object>} - Found assignment
 */
const getServiceAreaAssignment = async (id) => {
  const assignment = await branchServiceAreaRepository.findById(id);
  
  if (!assignment) {
    throw new NotFoundError('Service area assignment not found');
  }
  
  return assignment;
};

module.exports = getServiceAreaAssignment;
