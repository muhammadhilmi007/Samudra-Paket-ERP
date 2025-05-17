/**
 * Create Service Area Use Case
 * Creates a new service area with geospatial data
 */

const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const { ValidationError } = require('../../../utils/errors');

/**
 * Create a new service area
 * @param {Object} serviceAreaData - Service area data
 * @param {String} userId - ID of the user creating the service area
 * @returns {Promise<Object>} - Created service area
 */
const createServiceArea = async (serviceAreaData, userId) => {
  // Check if service area code already exists
  const existingServiceArea = await serviceAreaRepository.findByCode(serviceAreaData.code);
  if (existingServiceArea) {
    throw new ValidationError('Service area code already exists');
  }
  
  // Validate geometry
  if (!serviceAreaData.geometry || !serviceAreaData.geometry.type || !serviceAreaData.geometry.coordinates) {
    throw new ValidationError('Valid geometry with type and coordinates is required');
  }
  
  // Ensure geometry type is valid
  if (!['Polygon', 'MultiPolygon'].includes(serviceAreaData.geometry.type)) {
    throw new ValidationError('Geometry type must be Polygon or MultiPolygon');
  }
  
  // Calculate center point if not provided
  if (!serviceAreaData.center || !serviceAreaData.center.coordinates) {
    // Simple centroid calculation for polygons
    // For production, a more sophisticated algorithm would be used
    const coordinates = serviceAreaData.geometry.coordinates;
    if (serviceAreaData.geometry.type === 'Polygon' && coordinates[0] && coordinates[0].length > 0) {
      const points = coordinates[0];
      let sumX = 0;
      let sumY = 0;
      
      points.forEach(point => {
        sumX += point[0];
        sumY += point[1];
      });
      
      serviceAreaData.center = {
        type: 'Point',
        coordinates: [sumX / points.length, sumY / points.length]
      };
    }
  }
  
  // Create the service area
  return serviceAreaRepository.createServiceArea(serviceAreaData, userId);
};

module.exports = createServiceArea;
