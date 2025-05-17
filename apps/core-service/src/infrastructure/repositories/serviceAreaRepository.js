/**
 * Service Area Repository
 * Handles data access operations for service areas
 */

const { ServiceArea, ServiceAreaHistory } = require('../../domain/models');
const mongoose = require('mongoose');

/**
 * Create a new service area
 * @param {Object} serviceAreaData - Service area data
 * @param {Object} userId - ID of the user creating the service area
 * @returns {Promise<Object>} - Created service area
 */
const createServiceArea = async (serviceAreaData, userId) => {
  const serviceArea = new ServiceArea({
    ...serviceAreaData,
    createdBy: userId
  });
  
  const savedServiceArea = await serviceArea.save();
  
  // Create history entry
  await ServiceAreaHistory.createHistoryEntry(
    savedServiceArea,
    'CREATE',
    null,
    [],
    'Initial creation',
    userId
  );
  
  return savedServiceArea;
};

/**
 * Find service area by ID
 * @param {String} id - Service area ID
 * @returns {Promise<Object>} - Found service area or null
 */
const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return ServiceArea.findById(id);
};

/**
 * Find service area by code
 * @param {String} code - Service area code
 * @returns {Promise<Object>} - Found service area or null
 */
const findByCode = async (code) => {
  return ServiceArea.findOne({ code: code.toUpperCase() });
};

/**
 * Find service areas with pagination and filtering
 * @param {Object} filter - Filter criteria
 * @param {Number} page - Page number (1-based)
 * @param {Number} limit - Number of items per page
 * @param {Object} sort - Sort criteria
 * @returns {Promise<Object>} - Paginated service areas
 */
const findAll = async (filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) => {
  const skip = (page - 1) * limit;
  
  // Process filter for text search
  if (filter.search) {
    filter.$text = { $search: filter.search };
    delete filter.search;
  }
  
  // Process filter for status
  if (filter.status) {
    filter.status = filter.status.toUpperCase();
  }
  
  // Process filter for area type
  if (filter.areaType) {
    filter.areaType = filter.areaType.toUpperCase();
  }
  
  // Process filter for admin level
  if (filter.adminLevel) {
    filter.adminLevel = filter.adminLevel.toUpperCase();
  }
  
  const total = await ServiceArea.countDocuments(filter);
  const serviceAreas = await ServiceArea.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  return {
    serviceAreas,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Update a service area
 * @param {String} id - Service area ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - ID of the user updating the service area
 * @param {String} reason - Reason for the update
 * @returns {Promise<Object>} - Updated service area
 */
const updateServiceArea = async (id, updateData, userId, reason = '') => {
  // Get the current state before update
  const serviceArea = await findById(id);
  if (!serviceArea) {
    return null;
  }
  
  const previousState = serviceArea.toObject();
  
  // Track changes
  const changes = [];
  Object.keys(updateData).forEach(key => {
    if (JSON.stringify(serviceArea[key]) !== JSON.stringify(updateData[key])) {
      changes.push({
        field: key,
        oldValue: serviceArea[key],
        newValue: updateData[key]
      });
    }
  });
  
  // Determine change type
  let changeType = 'UPDATE';
  if (updateData.status && serviceArea.status !== updateData.status) {
    changeType = 'STATUS_CHANGE';
  } else if (updateData.geometry && JSON.stringify(serviceArea.geometry) !== JSON.stringify(updateData.geometry)) {
    changeType = 'BOUNDARY_CHANGE';
  }
  
  // Update the service area
  Object.assign(serviceArea, updateData);
  serviceArea.updatedBy = userId;
  serviceArea.updatedAt = new Date();
  
  const updatedServiceArea = await serviceArea.save();
  
  // Create history entry if there are changes
  if (changes.length > 0) {
    await ServiceAreaHistory.createHistoryEntry(
      updatedServiceArea,
      changeType,
      previousState,
      changes,
      reason,
      userId
    );
  }
  
  return updatedServiceArea;
};

/**
 * Delete a service area
 * @param {String} id - Service area ID
 * @param {String} userId - ID of the user deleting the service area
 * @param {String} reason - Reason for deletion
 * @returns {Promise<Boolean>} - Whether the deletion was successful
 */
const deleteServiceArea = async (id, userId, reason = '') => {
  const serviceArea = await findById(id);
  if (!serviceArea) {
    return false;
  }
  
  const previousState = serviceArea.toObject();
  
  // Create history entry before deletion
  await ServiceAreaHistory.createHistoryEntry(
    serviceArea,
    'DELETE',
    previousState,
    [],
    reason,
    userId
  );
  
  await ServiceArea.findByIdAndDelete(id);
  return true;
};

/**
 * Find service areas containing a point
 * @param {Array} coordinates - [longitude, latitude]
 * @returns {Promise<Array>} - Service areas containing the point
 */
const findByPoint = async (coordinates) => {
  return ServiceArea.findByPoint(coordinates);
};

/**
 * Find service areas intersecting with a polygon
 * @param {Object} polygon - GeoJSON polygon
 * @returns {Promise<Array>} - Service areas intersecting with the polygon
 */
const findByPolygon = async (polygon) => {
  return ServiceArea.findByPolygon(polygon);
};

/**
 * Find service areas near a point
 * @param {Array} coordinates - [longitude, latitude]
 * @param {Number} maxDistance - Maximum distance in meters
 * @returns {Promise<Array>} - Service areas near the point
 */
const findNearPoint = async (coordinates, maxDistance) => {
  return ServiceArea.findNearPoint(coordinates, maxDistance);
};

/**
 * Get service area history
 * @param {String} id - Service area ID
 * @returns {Promise<Array>} - History entries for the service area
 */
const getServiceAreaHistory = async (id) => {
  return ServiceAreaHistory.findByServiceArea(id);
};

module.exports = {
  createServiceArea,
  findById,
  findByCode,
  findAll,
  updateServiceArea,
  deleteServiceArea,
  findByPoint,
  findByPolygon,
  findNearPoint,
  getServiceAreaHistory
};
