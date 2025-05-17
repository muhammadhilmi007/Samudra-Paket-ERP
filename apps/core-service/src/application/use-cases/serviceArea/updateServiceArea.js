/**
 * Update Service Area Use Case
 * Updates an existing service area
 */

const serviceAreaRepository = require('../../../infrastructure/repositories/serviceAreaRepository');
const { NotFoundError, ValidationError } = require('../../../utils/errors');

/**
 * Update a service area
 * @param {String} id - Service area ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - ID of the user updating the service area
 * @param {String} reason - Reason for the update
 * @returns {Promise<Object>} - Updated service area
 */
const updateServiceArea = async (id, updateData, userId, reason = '') => {
  // Check if service area exists
  const existingServiceArea = await serviceAreaRepository.findById(id);
  if (!existingServiceArea) {
    throw new NotFoundError('Service area not found');
  }
  
  // If code is being updated, check if it already exists
  if (updateData.code && updateData.code !== existingServiceArea.code) {
    const serviceAreaWithCode = await serviceAreaRepository.findByCode(updateData.code);
    if (serviceAreaWithCode && serviceAreaWithCode._id.toString() !== id) {
      throw new ValidationError('Service area code already exists');
    }
  }
  
  // Validate geometry if it's being updated
  if (updateData.geometry) {
    if (!updateData.geometry.type || !updateData.geometry.coordinates) {
      throw new ValidationError('Valid geometry with type and coordinates is required');
    }
    
    // Ensure geometry type is valid
    if (!['Polygon', 'MultiPolygon'].includes(updateData.geometry.type)) {
      throw new ValidationError('Geometry type must be Polygon or MultiPolygon');
    }
    
    // Calculate center point if geometry is updated but center is not provided
    if (!updateData.center || !updateData.center.coordinates) {
      // Simple centroid calculation for polygons
      const coordinates = updateData.geometry.coordinates;
      if (updateData.geometry.type === 'Polygon' && coordinates[0] && coordinates[0].length > 0) {
        const points = coordinates[0];
        let sumX = 0;
        let sumY = 0;
        
        points.forEach(point => {
          sumX += point[0];
          sumY += point[1];
        });
        
        updateData.center = {
          type: 'Point',
          coordinates: [sumX / points.length, sumY / points.length]
        };
      }
    }
  }
  
  // Update the service area
  const updatedServiceArea = await serviceAreaRepository.updateServiceArea(id, updateData, userId, reason);
  if (!updatedServiceArea) {
    throw new NotFoundError('Service area not found');
  }
  
  return updatedServiceArea;
};

module.exports = updateServiceArea;
