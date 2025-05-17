/**
 * Find Branches Serving Location Use Case
 * Finds branches that serve a specific location based on their assigned service areas
 */

const branchServiceAreaRepository = require('../../../infrastructure/repositories/branchServiceAreaRepository');
const { ValidationError } = require('../../../utils/errors');

/**
 * Find branches serving a location
 * @param {Object} location - Location object with coordinates
 * @returns {Promise<Array>} - Branches serving the location
 */
const findBranchesServingLocation = async (location) => {
  // Validate location
  if (!location || !location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
    throw new ValidationError('Valid location with coordinates [longitude, latitude] is required');
  }
  
  const coordinates = location.coordinates;
  
  // Validate coordinates
  if (typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
    throw new ValidationError('Coordinates must be numbers');
  }
  
  if (coordinates[0] < -180 || coordinates[0] > 180 || coordinates[1] < -90 || coordinates[1] > 90) {
    throw new ValidationError('Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90');
  }
  
  // Find branches serving the location
  return branchServiceAreaRepository.findBranchesServingPoint(coordinates);
};

module.exports = findBranchesServingLocation;
