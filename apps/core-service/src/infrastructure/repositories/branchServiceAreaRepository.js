/**
 * Branch Service Area Repository
 * Handles data access operations for branch-service area assignments
 */

const { BranchServiceArea, ServiceAreaHistory } = require('../../domain/models');
const mongoose = require('mongoose');

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
  const branchServiceArea = new BranchServiceArea({
    branch: branchId,
    serviceArea: serviceAreaId,
    priorityLevel,
    notes,
    assignedBy: userId
  });
  
  const savedAssignment = await branchServiceArea.save();
  
  // Create history entry for the service area
  await ServiceAreaHistory.createHistoryEntry(
    { _id: serviceAreaId },
    'ASSIGNMENT_CHANGE',
    null,
    [{
      field: 'branchAssignment',
      oldValue: null,
      newValue: {
        branch: branchId,
        priorityLevel,
        status: 'ACTIVE'
      }
    }],
    `Assigned to branch with priority ${priorityLevel}`,
    userId
  );
  
  return savedAssignment.populate(['branch', 'serviceArea']);
};

/**
 * Find branch service area assignment by ID
 * @param {String} id - Assignment ID
 * @returns {Promise<Object>} - Found assignment or null
 */
const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return BranchServiceArea.findById(id).populate(['branch', 'serviceArea']);
};

/**
 * Find branch service area assignment by branch and service area
 * @param {String} branchId - Branch ID
 * @param {String} serviceAreaId - Service area ID
 * @returns {Promise<Object>} - Found assignment or null
 */
const findByBranchAndServiceArea = async (branchId, serviceAreaId) => {
  return BranchServiceArea.findOne({
    branch: branchId,
    serviceArea: serviceAreaId
  }).populate(['branch', 'serviceArea']);
};

/**
 * Find all service areas assigned to a branch
 * @param {String} branchId - Branch ID
 * @param {Object} filter - Filter criteria
 * @param {Number} page - Page number (1-based)
 * @param {Number} limit - Number of items per page
 * @returns {Promise<Object>} - Paginated service area assignments
 */
const findServiceAreasByBranch = async (branchId, filter = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  // Combine branch ID with other filters
  const combinedFilter = {
    branch: branchId,
    ...filter
  };
  
  // Process filter for status
  if (filter.status) {
    combinedFilter.status = filter.status.toUpperCase();
  }
  
  const total = await BranchServiceArea.countDocuments(combinedFilter);
  const assignments = await BranchServiceArea.find(combinedFilter)
    .sort({ priorityLevel: 1 })
    .skip(skip)
    .limit(limit)
    .populate('serviceArea');
  
  return {
    assignments,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Find all branches assigned to a service area
 * @param {String} serviceAreaId - Service area ID
 * @param {Object} filter - Filter criteria
 * @param {Number} page - Page number (1-based)
 * @param {Number} limit - Number of items per page
 * @returns {Promise<Object>} - Paginated branch assignments
 */
const findBranchesByServiceArea = async (serviceAreaId, filter = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  // Combine service area ID with other filters
  const combinedFilter = {
    serviceArea: serviceAreaId,
    ...filter
  };
  
  // Process filter for status
  if (filter.status) {
    combinedFilter.status = filter.status.toUpperCase();
  }
  
  const total = await BranchServiceArea.countDocuments(combinedFilter);
  const assignments = await BranchServiceArea.find(combinedFilter)
    .sort({ priorityLevel: 1 })
    .skip(skip)
    .limit(limit)
    .populate('branch');
  
  return {
    assignments,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Update a branch service area assignment
 * @param {String} id - Assignment ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - ID of the user updating the assignment
 * @returns {Promise<Object>} - Updated assignment
 */
const updateAssignment = async (id, updateData, userId) => {
  const assignment = await findById(id);
  if (!assignment) {
    return null;
  }
  
  const previousState = assignment.toObject();
  
  // Track changes
  const changes = [];
  Object.keys(updateData).forEach(key => {
    if (JSON.stringify(assignment[key]) !== JSON.stringify(updateData[key])) {
      changes.push({
        field: key,
        oldValue: assignment[key],
        newValue: updateData[key]
      });
    }
  });
  
  // Update the assignment
  Object.assign(assignment, updateData);
  assignment.updatedBy = userId;
  assignment.updatedAt = new Date();
  
  const updatedAssignment = await assignment.save();
  
  // Create history entry for the service area if there are changes
  if (changes.length > 0) {
    await ServiceAreaHistory.createHistoryEntry(
      { _id: assignment.serviceArea._id },
      'ASSIGNMENT_CHANGE',
      { branchAssignment: previousState },
      [{
        field: 'branchAssignment',
        oldValue: previousState,
        newValue: updatedAssignment.toObject()
      }],
      `Updated branch assignment`,
      userId
    );
  }
  
  return updatedAssignment.populate(['branch', 'serviceArea']);
};

/**
 * Remove a service area assignment from a branch
 * @param {String} id - Assignment ID
 * @param {String} userId - ID of the user removing the assignment
 * @param {String} reason - Reason for removal
 * @returns {Promise<Boolean>} - Whether the removal was successful
 */
const removeAssignment = async (id, userId, reason = '') => {
  const assignment = await findById(id);
  if (!assignment) {
    return false;
  }
  
  const previousState = assignment.toObject();
  
  // Create history entry before removal
  await ServiceAreaHistory.createHistoryEntry(
    { _id: assignment.serviceArea._id },
    'ASSIGNMENT_CHANGE',
    { branchAssignment: previousState },
    [{
      field: 'branchAssignment',
      oldValue: previousState,
      newValue: null
    }],
    reason || 'Removed branch assignment',
    userId
  );
  
  await BranchServiceArea.findByIdAndDelete(id);
  return true;
};

/**
 * Find the highest priority branch for a service area
 * @param {String} serviceAreaId - Service area ID
 * @returns {Promise<Object>} - Highest priority branch assignment
 */
const findHighestPriorityBranch = async (serviceAreaId) => {
  return BranchServiceArea.findHighestPriorityBranch(serviceAreaId);
};

/**
 * Find branches serving a point location
 * @param {Array} coordinates - [longitude, latitude]
 * @returns {Promise<Array>} - Branch service area assignments for the point
 */
const findBranchesServingPoint = async (coordinates) => {
  // First find service areas containing the point
  const { ServiceArea } = require('../../domain/models');
  const point = {
    type: 'Point',
    coordinates
  };
  
  const serviceAreas = await ServiceArea.find({
    geometry: {
      $geoIntersects: {
        $geometry: point
      }
    },
    status: 'ACTIVE'
  });
  
  if (!serviceAreas.length) {
    return [];
  }
  
  // Then find branches assigned to those service areas
  const serviceAreaIds = serviceAreas.map(area => area._id);
  
  return BranchServiceArea.find({
    serviceArea: { $in: serviceAreaIds },
    status: 'ACTIVE'
  })
  .sort({ priorityLevel: 1 })
  .populate(['branch', 'serviceArea']);
};

module.exports = {
  assignServiceAreaToBranch,
  findById,
  findByBranchAndServiceArea,
  findServiceAreasByBranch,
  findBranchesByServiceArea,
  updateAssignment,
  removeAssignment,
  findHighestPriorityBranch,
  findBranchesServingPoint
};
