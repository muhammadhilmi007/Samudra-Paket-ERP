/**
 * Find Service Areas by Location Use Case
 * Finds service areas containing or near a specific location
 */

const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const { ValidationError } = require('../../../utils/errors');

/**
 * Find service areas by location
 * @param {Object} location - Location object with coordinates
 * @param {String} searchType - Type of search: 'contains', 'near', or 'polygon'
 * @param {Number} maxDistance - Maximum distance in meters (for 'near' search)
 * @param {Object} polygon - GeoJSON polygon (for 'polygon' search)
 * @returns {Promise<Array>} - Service areas matching the search criteria
 */
const findServiceAreasByLocation = async (location, searchType = 'contains', maxDistance = 5000, polygon = null) => {
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
  
  // Perform search based on search type
  switch (searchType) {
    case 'contains':
      return serviceAreaRepository.findByPoint(coordinates);
      
    case 'near':
      // Validate maxDistance
      if (typeof maxDistance !== 'number' || maxDistance <= 0) {
        throw new ValidationError('Max distance must be a positive number');
      }
      return serviceAreaRepository.findNearPoint(coordinates, maxDistance);
      
    case 'polygon':
      // Validate polygon
      if (!polygon || !polygon.type || !polygon.coordinates) {
        throw new ValidationError('Valid polygon with type and coordinates is required');
      }
      
      if (polygon.type !== 'Polygon' && polygon.type !== 'MultiPolygon') {
        throw new ValidationError('Polygon type must be Polygon or MultiPolygon');
      }
      
      return serviceAreaRepository.findByPolygon(polygon);
      
    default:
      throw new ValidationError('Invalid search type. Must be "contains", "near", or "polygon"');
  }
};

module.exports = findServiceAreasByLocation;
