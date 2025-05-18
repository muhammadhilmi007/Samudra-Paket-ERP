/**
 * Position Use Cases
 * Business logic for position management
 */

const { positionRepository, divisionRepository } = require('../../infrastructure/repositories');
const { logger } = require('../../utils');
const { ApplicationError } = require('../../utils/errors');

/**
 * Create a new position
 * @param {Object} positionData - The position data
 * @param {string} userId - The ID of the user creating the position
 * @returns {Promise<Object>} The created position
 */
const createPosition = async (positionData, userId) => {
  try {
    // Check if position code already exists
    const existingPosition = await positionRepository.getPositionByCode(positionData.code);
    if (existingPosition) {
      throw new ApplicationError(`Position with code ${positionData.code} already exists`, 400);
    }
    
    // Check if division exists
    const division = await divisionRepository.getDivisionById(positionData.division);
    if (!division) {
      throw new ApplicationError(`Division with ID ${positionData.division} not found`, 404);
    }
    
    // If reportTo is provided, check if it exists
    if (positionData.reportTo) {
      const reportToPosition = await positionRepository.getPositionById(positionData.reportTo);
      if (!reportToPosition) {
        throw new ApplicationError(`Reporting position with ID ${positionData.reportTo} not found`, 404);
      }
    }
    
    return await positionRepository.createPosition(positionData, userId);
  } catch (error) {
    logger.error('Error in createPosition use case:', error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get a position by ID
 * @param {string} id - The position ID
 * @returns {Promise<Object>} The position
 */
const getPositionById = async (id) => {
  try {
    const position = await positionRepository.getPositionById(id);
    if (!position) {
      throw new ApplicationError(`Position with ID ${id} not found`, 404);
    }
    
    return position;
  } catch (error) {
    logger.error(`Error in getPositionById use case for ID ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get a position by code
 * @param {string} code - The position code
 * @returns {Promise<Object>} The position
 */
const getPositionByCode = async (code) => {
  try {
    const position = await positionRepository.getPositionByCode(code);
    if (!position) {
      throw new ApplicationError(`Position with code ${code} not found`, 404);
    }
    
    return position;
  } catch (error) {
    logger.error(`Error in getPositionByCode use case for code ${code}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
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
    // Check if position exists
    const position = await positionRepository.getPositionById(id);
    if (!position) {
      throw new ApplicationError(`Position with ID ${id} not found`, 404);
    }
    
    // If code is being updated, check if it already exists
    if (updateData.code && updateData.code !== position.code) {
      const existingPosition = await positionRepository.getPositionByCode(updateData.code);
      if (existingPosition) {
        throw new ApplicationError(`Position with code ${updateData.code} already exists`, 400);
      }
    }
    
    // If division is being updated, check if it exists
    if (updateData.division) {
      const division = await divisionRepository.getDivisionById(updateData.division);
      if (!division) {
        throw new ApplicationError(`Division with ID ${updateData.division} not found`, 404);
      }
    }
    
    // If reportTo is being updated, check if it exists and prevent circular reporting
    if (updateData.reportTo) {
      // Cannot report to itself
      if (updateData.reportTo.toString() === id) {
        throw new ApplicationError('Position cannot report to itself', 400);
      }
      
      // Check if the reportTo position exists
      const reportToPosition = await positionRepository.getPositionById(updateData.reportTo);
      if (!reportToPosition) {
        throw new ApplicationError(`Reporting position with ID ${updateData.reportTo} not found`, 404);
      }
      
      // Check if this would create a circular reporting relationship
      let currentPosition = reportToPosition;
      const visitedPositions = new Set([id]);
      
      while (currentPosition.reportTo) {
        const currentPositionId = currentPosition.reportTo.toString();
        
        // If we've already visited this position, we have a circular reference
        if (visitedPositions.has(currentPositionId)) {
          throw new ApplicationError('Circular reporting relationship detected', 400);
        }
        
        visitedPositions.add(currentPositionId);
        
        // Get the next position in the chain
        currentPosition = await positionRepository.getPositionById(currentPosition.reportTo);
        if (!currentPosition) {
          break;
        }
      }
    }
    
    return await positionRepository.updatePosition(id, updateData, userId);
  } catch (error) {
    logger.error(`Error in updatePosition use case for ID ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
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
    // Check if position exists
    const position = await positionRepository.getPositionById(id);
    if (!position) {
      throw new ApplicationError(`Position with ID ${id} not found`, 404);
    }
    
    // Check if any positions report to this position
    const reportingPositions = await positionRepository.getReportingPositions(id);
    if (reportingPositions.length > 0) {
      throw new ApplicationError(`Cannot delete position with ID ${id} because ${reportingPositions.length} positions report to it`, 400);
    }
    
    return await positionRepository.deletePosition(id, userId);
  } catch (error) {
    logger.error(`Error in deletePosition use case for ID ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
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
    return await positionRepository.listPositions(filters, page, limit);
  } catch (error) {
    logger.error('Error in listPositions use case:', error);
    throw new ApplicationError(error.message, 500);
  }
};

/**
 * Get positions by division
 * @param {string} divisionId - The division ID
 * @returns {Promise<Array>} The positions in the division
 */
const getPositionsByDivision = async (divisionId) => {
  try {
    // Check if division exists
    const division = await divisionRepository.getDivisionById(divisionId);
    if (!division) {
      throw new ApplicationError(`Division with ID ${divisionId} not found`, 404);
    }
    
    return await positionRepository.getPositionsByDivision(divisionId);
  } catch (error) {
    logger.error(`Error in getPositionsByDivision use case for division ${divisionId}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get positions reporting to a position
 * @param {string} positionId - The position ID
 * @returns {Promise<Array>} The reporting positions
 */
const getReportingPositions = async (positionId) => {
  try {
    // Check if position exists
    const position = await positionRepository.getPositionById(positionId);
    if (!position) {
      throw new ApplicationError(`Position with ID ${positionId} not found`, 404);
    }
    
    return await positionRepository.getReportingPositions(positionId);
  } catch (error) {
    logger.error(`Error in getReportingPositions use case for position ${positionId}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get reporting chain for a position
 * @param {string} positionId - The position ID
 * @returns {Promise<Array>} The reporting chain
 */
const getReportingChain = async (positionId) => {
  try {
    // Check if position exists
    const position = await positionRepository.getPositionById(positionId);
    if (!position) {
      throw new ApplicationError(`Position with ID ${positionId} not found`, 404);
    }
    
    return await positionRepository.getReportingChain(positionId);
  } catch (error) {
    logger.error(`Error in getReportingChain use case for position ${positionId}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get organization chart
 * @returns {Promise<Array>} The organization chart
 */
const getOrganizationChart = async () => {
  try {
    return await positionRepository.getOrganizationChart();
  } catch (error) {
    logger.error('Error in getOrganizationChart use case:', error);
    throw new ApplicationError(error.message, 500);
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
    // Check if position exists
    const position = await positionRepository.getPositionById(id);
    if (!position) {
      throw new ApplicationError(`Position with ID ${id} not found`, 404);
    }
    
    // Validate status
    const validStatuses = ['ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      throw new ApplicationError(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`, 400);
    }
    
    return await positionRepository.changePositionStatus(id, status, userId);
  } catch (error) {
    logger.error(`Error in changePositionStatus use case for position ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
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
    // Check if position exists
    const position = await positionRepository.getPositionById(id);
    if (!position) {
      throw new ApplicationError(`Position with ID ${id} not found`, 404);
    }
    
    // Validate requirements data
    if (!requirements || typeof requirements !== 'object' || Array.isArray(requirements)) {
      throw new ApplicationError('Requirements must be an object', 400);
    }
    
    return await positionRepository.updatePositionRequirements(id, requirements, userId);
  } catch (error) {
    logger.error(`Error in updatePositionRequirements use case for position ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
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
    // Check if position exists
    const position = await positionRepository.getPositionById(id);
    if (!position) {
      throw new ApplicationError(`Position with ID ${id} not found`, 404);
    }
    
    // Validate compensation data
    if (!compensation || typeof compensation !== 'object' || Array.isArray(compensation)) {
      throw new ApplicationError('Compensation must be an object', 400);
    }
    
    // Validate salary range if provided
    if (compensation.salaryRange) {
      if (compensation.salaryRange.min !== undefined && (isNaN(compensation.salaryRange.min) || compensation.salaryRange.min < 0)) {
        throw new ApplicationError('Minimum salary must be a non-negative number', 400);
      }
      
      if (compensation.salaryRange.max !== undefined && (isNaN(compensation.salaryRange.max) || compensation.salaryRange.max < 0)) {
        throw new ApplicationError('Maximum salary must be a non-negative number', 400);
      }
      
      if (compensation.salaryRange.min !== undefined && compensation.salaryRange.max !== undefined && 
          compensation.salaryRange.min > compensation.salaryRange.max) {
        throw new ApplicationError('Minimum salary cannot be greater than maximum salary', 400);
      }
    }
    
    return await positionRepository.updatePositionCompensation(id, compensation, userId);
  } catch (error) {
    logger.error(`Error in updatePositionCompensation use case for position ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
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
    // Check if position exists
    const position = await positionRepository.getPositionById(id);
    if (!position) {
      throw new ApplicationError(`Position with ID ${id} not found`, 404);
    }
    
    // Validate responsibilities data
    if (!Array.isArray(responsibilities)) {
      throw new ApplicationError('Responsibilities must be an array', 400);
    }
    
    // Validate each responsibility
    for (const responsibility of responsibilities) {
      if (typeof responsibility !== 'string' || responsibility.trim() === '') {
        throw new ApplicationError('Each responsibility must be a non-empty string', 400);
      }
    }
    
    return await positionRepository.updatePositionResponsibilities(id, responsibilities, userId);
  } catch (error) {
    logger.error(`Error in updatePositionResponsibilities use case for position ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
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
    // Check if position exists
    const position = await positionRepository.getPositionById(id);
    if (!position) {
      throw new ApplicationError(`Position with ID ${id} not found`, 404);
    }
    
    // Check if division exists
    const division = await divisionRepository.getDivisionById(divisionId);
    if (!division) {
      throw new ApplicationError(`Division with ID ${divisionId} not found`, 404);
    }
    
    return await positionRepository.transferPositionToDivision(id, divisionId, userId);
  } catch (error) {
    logger.error(`Error in transferPositionToDivision use case for position ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
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
