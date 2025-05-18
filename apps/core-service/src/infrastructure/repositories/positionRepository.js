/**
 * Position Repository
 * Handles data access operations for positions
 */

const { Position, Division, OrganizationalChange } = require('../../domain/models');
const { logger } = require('../../utils');

/**
 * Create a new position
 * @param {Object} positionData - The position data
 * @param {string} userId - The ID of the user creating the position
 * @returns {Promise<Object>} The created position
 */
const createPosition = async (positionData, userId) => {
  try {
    // Verify that the division exists
    const division = await Division.findById(positionData.division);
    if (!division) {
      throw new Error(`Division with ID ${positionData.division} not found`);
    }
    
    // Create the position
    const position = new Position({
      ...positionData,
      createdBy: userId
    });
    
    const savedPosition = await position.save();
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'POSITION',
      entityId: savedPosition._id,
      changeType: 'CREATE',
      description: `Position ${savedPosition.name} (${savedPosition.code}) created in division ${division.name}`,
      newState: savedPosition.toObject(),
      createdBy: userId
    }).save();
    
    return savedPosition;
  } catch (error) {
    logger.error('Error creating position:', error);
    throw error;
  }
};

/**
 * Get a position by ID
 * @param {string} id - The position ID
 * @returns {Promise<Object>} The position
 */
const getPositionById = async (id) => {
  try {
    return await Position.findById(id)
      .populate('division', 'name code')
      .populate('reportTo', 'name code');
  } catch (error) {
    logger.error(`Error getting position with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get a position by code
 * @param {string} code - The position code
 * @returns {Promise<Object>} The position
 */
const getPositionByCode = async (code) => {
  try {
    return await Position.findOne({ code: code.toUpperCase() })
      .populate('division', 'name code')
      .populate('reportTo', 'name code');
  } catch (error) {
    logger.error(`Error getting position with code ${code}:`, error);
    throw error;
  }
};

/**
 * Update a position
 * @param {string} id - The position ID
 * @param {Object} updateData - The data to update
 * @param {string} userId - The ID of the user updating the position
 * @returns {Promise<Object>} The updated position
 */
const updatePosition = async (id, updateData, userId) => {
  try {
    // Get the current state of the position
    const currentPosition = await Position.findById(id);
    if (!currentPosition) {
      throw new Error(`Position with ID ${id} not found`);
    }
    
    // If division is being updated, verify that it exists
    if (updateData.division) {
      const division = await Division.findById(updateData.division);
      if (!division) {
        throw new Error(`Division with ID ${updateData.division} not found`);
      }
    }
    
    // Update the position
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );
    
    // Determine which fields were changed
    const changedFields = [];
    for (const key in updateData) {
      if (JSON.stringify(currentPosition[key]) !== JSON.stringify(updateData[key])) {
        changedFields.push(key);
      }
    }
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'POSITION',
      entityId: id,
      changeType: 'UPDATE',
      description: `Position ${updatedPosition.name} (${updatedPosition.code}) updated`,
      previousState: currentPosition.toObject(),
      newState: updatedPosition.toObject(),
      changedFields,
      createdBy: userId
    }).save();
    
    return updatedPosition;
  } catch (error) {
    logger.error(`Error updating position with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a position
 * @param {string} id - The position ID
 * @param {string} userId - The ID of the user deleting the position
 * @returns {Promise<Object>} The deleted position
 */
const deletePosition = async (id, userId) => {
  try {
    // Get the current state of the position
    const position = await Position.findById(id);
    if (!position) {
      throw new Error(`Position with ID ${id} not found`);
    }
    
    // Check if any positions report to this position
    const reportingPositions = await Position.countDocuments({ reportTo: id });
    if (reportingPositions > 0) {
      throw new Error(`Cannot delete position with ID ${id} because ${reportingPositions} positions report to it`);
    }
    
    // Delete the position
    const deletedPosition = await Position.findByIdAndDelete(id);
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'POSITION',
      entityId: id,
      changeType: 'DELETE',
      description: `Position ${position.name} (${position.code}) deleted`,
      previousState: position.toObject(),
      createdBy: userId
    }).save();
    
    return deletedPosition;
  } catch (error) {
    logger.error(`Error deleting position with ID ${id}:`, error);
    throw error;
  }
};

/**
 * List positions with pagination and filtering
 * @param {Object} filters - The filters to apply
 * @param {number} page - The page number
 * @param {number} limit - The number of items per page
 * @returns {Promise<Object>} The paginated positions
 */
const listPositions = async (filters = {}, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};
    
    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.division) query.division = filters.division;
    if (filters.reportTo) query.reportTo = filters.reportTo;
    if (filters.level !== undefined) query.level = filters.level;
    if (filters.search) {
      query.$or = [
        { name: new RegExp(filters.search, 'i') },
        { code: new RegExp(filters.search, 'i') },
        { description: new RegExp(filters.search, 'i') }
      ];
    }
    
    const total = await Position.countDocuments(query);
    const positions = await Position.find(query)
      .populate('division', 'name code')
      .populate('reportTo', 'name code')
      .skip(skip)
      .limit(limit)
      .sort({ level: 1, code: 1 });
    
    return {
      positions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error listing positions:', error);
    throw error;
  }
};

/**
 * Get positions by division
 * @param {string} divisionId - The division ID
 * @returns {Promise<Array>} The positions in the division
 */
const getPositionsByDivision = async (divisionId) => {
  try {
    return await Position.find({ division: divisionId })
      .populate('reportTo', 'name code')
      .sort({ level: 1, code: 1 });
  } catch (error) {
    logger.error(`Error getting positions for division ${divisionId}:`, error);
    throw error;
  }
};

/**
 * Get positions reporting to a position
 * @param {string} positionId - The position ID
 * @returns {Promise<Array>} The reporting positions
 */
const getReportingPositions = async (positionId) => {
  try {
    return await Position.findReportingPositions(positionId)
      .populate('division', 'name code');
  } catch (error) {
    logger.error(`Error getting positions reporting to position ${positionId}:`, error);
    throw error;
  }
};

/**
 * Get reporting chain for a position
 * @param {string} positionId - The position ID
 * @returns {Promise<Array>} The reporting chain
 */
const getReportingChain = async (positionId) => {
  try {
    return await Position.getReportingChain(positionId);
  } catch (error) {
    logger.error(`Error getting reporting chain for position ${positionId}:`, error);
    throw error;
  }
};

/**
 * Get organization chart
 * @returns {Promise<Array>} The organization chart
 */
const getOrganizationChart = async () => {
  try {
    return await Position.getOrganizationChart();
  } catch (error) {
    logger.error('Error getting organization chart:', error);
    throw error;
  }
};

/**
 * Change position status
 * @param {string} id - The position ID
 * @param {string} status - The new status
 * @param {string} userId - The ID of the user changing the status
 * @returns {Promise<Object>} The updated position
 */
const changePositionStatus = async (id, status, userId) => {
  try {
    // Get the current state of the position
    const currentPosition = await Position.findById(id);
    if (!currentPosition) {
      throw new Error(`Position with ID ${id} not found`);
    }
    
    // Update the position status
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        status,
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );
    
    // Determine the change type
    const changeType = status === 'ACTIVE' ? 'ACTIVATE' : 'DEACTIVATE';
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'POSITION',
      entityId: id,
      changeType,
      description: `Position ${updatedPosition.name} (${updatedPosition.code}) ${status === 'ACTIVE' ? 'activated' : 'deactivated'}`,
      previousState: currentPosition.toObject(),
      newState: updatedPosition.toObject(),
      changedFields: ['status'],
      createdBy: userId
    }).save();
    
    return updatedPosition;
  } catch (error) {
    logger.error(`Error changing position status with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update position requirements
 * @param {string} id - The position ID
 * @param {Object} requirements - The requirements data
 * @param {string} userId - The ID of the user updating the requirements
 * @returns {Promise<Object>} The updated position
 */
const updatePositionRequirements = async (id, requirements, userId) => {
  try {
    // Get the current state of the position
    const currentPosition = await Position.findById(id);
    if (!currentPosition) {
      throw new Error(`Position with ID ${id} not found`);
    }
    
    // Update the position requirements
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        requirements: {
          ...currentPosition.requirements,
          ...requirements
        },
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'POSITION',
      entityId: id,
      changeType: 'UPDATE',
      description: `Position ${updatedPosition.name} (${updatedPosition.code}) requirements updated`,
      previousState: { requirements: currentPosition.requirements },
      newState: { requirements: updatedPosition.requirements },
      changedFields: ['requirements'],
      createdBy: userId
    }).save();
    
    return updatedPosition;
  } catch (error) {
    logger.error(`Error updating position requirements with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update position compensation
 * @param {string} id - The position ID
 * @param {Object} compensation - The compensation data
 * @param {string} userId - The ID of the user updating the compensation
 * @returns {Promise<Object>} The updated position
 */
const updatePositionCompensation = async (id, compensation, userId) => {
  try {
    // Get the current state of the position
    const currentPosition = await Position.findById(id);
    if (!currentPosition) {
      throw new Error(`Position with ID ${id} not found`);
    }
    
    // Update the position compensation
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        compensation: {
          ...currentPosition.compensation,
          ...compensation
        },
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'POSITION',
      entityId: id,
      changeType: 'UPDATE',
      description: `Position ${updatedPosition.name} (${updatedPosition.code}) compensation updated`,
      previousState: { compensation: currentPosition.compensation },
      newState: { compensation: updatedPosition.compensation },
      changedFields: ['compensation'],
      createdBy: userId
    }).save();
    
    return updatedPosition;
  } catch (error) {
    logger.error(`Error updating position compensation with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update position responsibilities
 * @param {string} id - The position ID
 * @param {Array} responsibilities - The responsibilities array
 * @param {string} userId - The ID of the user updating the responsibilities
 * @returns {Promise<Object>} The updated position
 */
const updatePositionResponsibilities = async (id, responsibilities, userId) => {
  try {
    // Get the current state of the position
    const currentPosition = await Position.findById(id);
    if (!currentPosition) {
      throw new Error(`Position with ID ${id} not found`);
    }
    
    // Update the position responsibilities
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        responsibilities,
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'POSITION',
      entityId: id,
      changeType: 'UPDATE',
      description: `Position ${updatedPosition.name} (${updatedPosition.code}) responsibilities updated`,
      previousState: { responsibilities: currentPosition.responsibilities },
      newState: { responsibilities: updatedPosition.responsibilities },
      changedFields: ['responsibilities'],
      createdBy: userId
    }).save();
    
    return updatedPosition;
  } catch (error) {
    logger.error(`Error updating position responsibilities with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Transfer position to another division
 * @param {string} id - The position ID
 * @param {string} divisionId - The new division ID
 * @param {string} userId - The ID of the user transferring the position
 * @returns {Promise<Object>} The updated position
 */
const transferPositionToDivision = async (id, divisionId, userId) => {
  try {
    // Get the current state of the position
    const currentPosition = await Position.findById(id);
    if (!currentPosition) {
      throw new Error(`Position with ID ${id} not found`);
    }
    
    // Verify that the division exists
    const division = await Division.findById(divisionId);
    if (!division) {
      throw new Error(`Division with ID ${divisionId} not found`);
    }
    
    // Update the position
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        division: divisionId,
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'POSITION',
      entityId: id,
      changeType: 'TRANSFER',
      description: `Position ${updatedPosition.name} (${updatedPosition.code}) transferred to division ${division.name}`,
      previousState: { division: currentPosition.division },
      newState: { division: divisionId },
      changedFields: ['division'],
      createdBy: userId
    }).save();
    
    return updatedPosition;
  } catch (error) {
    logger.error(`Error transferring position with ID ${id} to division ${divisionId}:`, error);
    throw error;
  }
};

module.exports = {
  createPosition,
  getPositionById,
  getPositionByCode,
  updatePosition,
  deletePosition,
  listPositions,
  getPositionsByDivision,
  getReportingPositions,
  getReportingChain,
  getOrganizationChart,
  changePositionStatus,
  updatePositionRequirements,
  updatePositionCompensation,
  updatePositionResponsibilities,
  transferPositionToDivision
};
