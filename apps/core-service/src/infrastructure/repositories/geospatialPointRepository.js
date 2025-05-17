/**
 * Geospatial Point Repository
 * Handles data access operations for geospatial test points
 */

const { GeospatialPoint } = require('../../domain/models');
const { logger } = require('../../utils');

/**
 * Create a new geospatial point
 * @param {Object} pointData - The geospatial point data
 * @returns {Promise<Object>} The created geospatial point
 */
const createGeospatialPoint = async (pointData) => {
  try {
    const geospatialPoint = new GeospatialPoint(pointData);
    return await geospatialPoint.save();
  } catch (error) {
    logger.error('Error creating geospatial point:', error);
    throw error;
  }
};

/**
 * Get a geospatial point by ID
 * @param {string} id - The geospatial point ID
 * @returns {Promise<Object>} The geospatial point
 */
const getGeospatialPointById = async (id) => {
  try {
    return await GeospatialPoint.findById(id);
  } catch (error) {
    logger.error(`Error getting geospatial point with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update a geospatial point
 * @param {string} id - The geospatial point ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} The updated geospatial point
 */
const updateGeospatialPoint = async (id, updateData) => {
  try {
    return await GeospatialPoint.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  } catch (error) {
    logger.error(`Error updating geospatial point with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a geospatial point
 * @param {string} id - The geospatial point ID
 * @returns {Promise<Object>} The deleted geospatial point
 */
const deleteGeospatialPoint = async (id) => {
  try {
    return await GeospatialPoint.findByIdAndDelete(id);
  } catch (error) {
    logger.error(`Error deleting geospatial point with ID ${id}:`, error);
    throw error;
  }
};

/**
 * List geospatial points with pagination and filtering
 * @param {Object} filters - The filters to apply
 * @param {number} page - The page number
 * @param {number} limit - The number of items per page
 * @returns {Promise<Object>} The paginated geospatial points
 */
const listGeospatialPoints = async (filters = {}, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    // Apply filters
    if (filters.type) query.type = filters.type;
    if (filters.serviceArea) query.serviceArea = filters.serviceArea;
    
    const total = await GeospatialPoint.countDocuments(query);
    const points = await GeospatialPoint.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      points,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error listing geospatial points:', error);
    throw error;
  }
};

/**
 * Find geospatial points near a location
 * @param {Array} coordinates - The coordinates [longitude, latitude]
 * @param {number} maxDistance - The maximum distance in meters
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array>} The geospatial points near the location
 */
const findPointsNearLocation = async (coordinates, maxDistance = 5000, filters = {}) => {
  try {
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: maxDistance
        }
      }
    };

    // Apply additional filters
    if (filters.type) query.type = filters.type;
    if (filters.serviceArea) query.serviceArea = filters.serviceArea;

    return await GeospatialPoint.find(query).limit(20);
  } catch (error) {
    logger.error('Error finding points near location:', error);
    throw error;
  }
};

/**
 * Find points within a polygon
 * @param {Array} polygonCoordinates - The polygon coordinates
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array>} The geospatial points within the polygon
 */
const findPointsWithinPolygon = async (polygonCoordinates, filters = {}) => {
  try {
    const query = {
      location: {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: [polygonCoordinates]
          }
        }
      }
    };

    // Apply additional filters
    if (filters.type) query.type = filters.type;
    if (filters.serviceArea) query.serviceArea = filters.serviceArea;

    return await GeospatialPoint.find(query);
  } catch (error) {
    logger.error('Error finding points within polygon:', error);
    throw error;
  }
};

/**
 * Find points within a service area
 * @param {string} serviceAreaId - The service area ID
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array>} The geospatial points within the service area
 */
const findPointsInServiceArea = async (serviceAreaId, filters = {}) => {
  try {
    const query = { serviceArea: serviceAreaId };

    // Apply additional filters
    if (filters.type) query.type = filters.type;

    return await GeospatialPoint.find(query);
  } catch (error) {
    logger.error(`Error finding points in service area ${serviceAreaId}:`, error);
    throw error;
  }
};

module.exports = {
  createGeospatialPoint,
  getGeospatialPointById,
  updateGeospatialPoint,
  deleteGeospatialPoint,
  listGeospatialPoints,
  findPointsNearLocation,
  findPointsWithinPolygon,
  findPointsInServiceArea
};
