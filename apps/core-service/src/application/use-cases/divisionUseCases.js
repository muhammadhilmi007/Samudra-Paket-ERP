/**
 * Division Use Cases
 * Business logic for division management
 */

const { divisionRepository, positionRepository } = require('../../infrastructure/repositories');
const { logger } = require('../../utils');
const { ApplicationError } = require('../../utils/errors');

/**
 * Create a new division
 * @param {Object} divisionData - The division data
 * @param {string} userId - The ID of the user creating the division
 * @returns {Promise<Object>} The created division
 */
const createDivision = async (divisionData, userId) => {
  try {
    // Check if division code already exists
    const existingDivision = await divisionRepository.getDivisionByCode(divisionData.code);
    if (existingDivision) {
      throw new ApplicationError(`Division with code ${divisionData.code} already exists`, 400);
    }
    
    return await divisionRepository.createDivision(divisionData, userId);
  } catch (error) {
    logger.error('Error in createDivision use case:', error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get a division by ID
 * @param {string} id - The division ID
 * @returns {Promise<Object>} The division
 */
const getDivisionById = async (id) => {
  try {
    const division = await divisionRepository.getDivisionById(id);
    if (!division) {
      throw new ApplicationError(`Division with ID ${id} not found`, 404);
    }
    
    return division;
  } catch (error) {
    logger.error(`Error in getDivisionById use case for ID ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get a division by code
 * @param {string} code - The division code
 * @returns {Promise<Object>} The division
 */
const getDivisionByCode = async (code) => {
  try {
    const division = await divisionRepository.getDivisionByCode(code);
    if (!division) {
      throw new ApplicationError(`Division with code ${code} not found`, 404);
    }
    
    return division;
  } catch (error) {
    logger.error(`Error in getDivisionByCode use case for code ${code}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Update a division
 * @param {string} id - The division ID
 * @param {Object} updateData - The data to update
 * @param {string} userId - The ID of the user updating the division
 * @returns {Promise<Object>} The updated division
 */
const updateDivision = async (id, updateData, userId) => {
  try {
    // Check if division exists
    const division = await divisionRepository.getDivisionById(id);
    if (!division) {
      throw new ApplicationError(`Division with ID ${id} not found`, 404);
    }
    
    // If code is being updated, check if it already exists
    if (updateData.code && updateData.code !== division.code) {
      const existingDivision = await divisionRepository.getDivisionByCode(updateData.code);
      if (existingDivision) {
        throw new ApplicationError(`Division with code ${updateData.code} already exists`, 400);
      }
    }
    
    // Prevent circular parent relationships
    if (updateData.parent) {
      // Cannot set itself as parent
      if (updateData.parent.toString() === id) {
        throw new ApplicationError('Division cannot be its own parent', 400);
      }
      
      // Check if the parent exists
      const parentDivision = await divisionRepository.getDivisionById(updateData.parent);
      if (!parentDivision) {
        throw new ApplicationError(`Parent division with ID ${updateData.parent} not found`, 404);
      }
      
      // Check if this would create a circular relationship
      let currentParent = parentDivision;
      const visitedDivisions = new Set([id]);
      
      while (currentParent.parent) {
        const currentParentId = currentParent.parent.toString();
        
        // If we've already visited this division, we have a circular reference
        if (visitedDivisions.has(currentParentId)) {
          throw new ApplicationError('Circular parent relationship detected', 400);
        }
        
        visitedDivisions.add(currentParentId);
        
        // Get the next parent in the chain
        currentParent = await divisionRepository.getDivisionById(currentParent.parent);
        if (!currentParent) {
          break;
        }
      }
    }
    
    return await divisionRepository.updateDivision(id, updateData, userId);
  } catch (error) {
    logger.error(`Error in updateDivision use case for ID ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Delete a division
 * @param {string} id - The division ID
 * @param {string} userId - The ID of the user deleting the division
 * @returns {Promise<Object>} The deleted division
 */
const deleteDivision = async (id, userId) => {
  try {
    // Check if division exists
    const division = await divisionRepository.getDivisionById(id);
    if (!division) {
      throw new ApplicationError(`Division with ID ${id} not found`, 404);
    }
    
    // Check if division has child divisions
    const childDivisions = await divisionRepository.getChildDivisions(id);
    if (childDivisions.length > 0) {
      throw new ApplicationError(`Cannot delete division with ID ${id} because it has ${childDivisions.length} child divisions`, 400);
    }
    
    // Check if division has positions
    const positions = await positionRepository.getPositionsByDivision(id);
    if (positions.length > 0) {
      throw new ApplicationError(`Cannot delete division with ID ${id} because it has ${positions.length} positions`, 400);
    }
    
    return await divisionRepository.deleteDivision(id, userId);
  } catch (error) {
    logger.error(`Error in deleteDivision use case for ID ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * List divisions with pagination and filtering
 * @param {Object} filters - The filters to apply
 * @param {number} page - The page number
 * @param {number} limit - The number of items per page
 * @returns {Promise<Object>} The paginated divisions
 */
const listDivisions = async (filters = {}, page = 1, limit = 10) => {
  try {
    return await divisionRepository.listDivisions(filters, page, limit);
  } catch (error) {
    logger.error('Error in listDivisions use case:', error);
    throw new ApplicationError(error.message, 500);
  }
};

/**
 * Get division hierarchy
 * @returns {Promise<Array>} The division hierarchy
 */
const getDivisionHierarchy = async () => {
  try {
    return await divisionRepository.getDivisionHierarchy();
  } catch (error) {
    logger.error('Error in getDivisionHierarchy use case:', error);
    throw new ApplicationError(error.message, 500);
  }
};

/**
 * Get divisions by branch
 * @param {string} branchId - The branch ID
 * @returns {Promise<Array>} The divisions in the branch
 */
const getDivisionsByBranch = async (branchId) => {
  try {
    return await divisionRepository.getDivisionsByBranch(branchId);
  } catch (error) {
    logger.error(`Error in getDivisionsByBranch use case for branch ${branchId}:`, error);
    throw new ApplicationError(error.message, 500);
  }
};

/**
 * Get child divisions
 * @param {string} divisionId - The parent division ID
 * @returns {Promise<Array>} The child divisions
 */
const getChildDivisions = async (divisionId) => {
  try {
    // Check if division exists
    const division = await divisionRepository.getDivisionById(divisionId);
    if (!division) {
      throw new ApplicationError(`Division with ID ${divisionId} not found`, 404);
    }
    
    return await divisionRepository.getChildDivisions(divisionId);
  } catch (error) {
    logger.error(`Error in getChildDivisions use case for division ${divisionId}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Get all descendant divisions
 * @param {string} divisionId - The ancestor division ID
 * @returns {Promise<Array>} The descendant divisions
 */
const getDescendantDivisions = async (divisionId) => {
  try {
    // Check if division exists
    const division = await divisionRepository.getDivisionById(divisionId);
    if (!division) {
      throw new ApplicationError(`Division with ID ${divisionId} not found`, 404);
    }
    
    return await divisionRepository.getDescendantDivisions(divisionId);
  } catch (error) {
    logger.error(`Error in getDescendantDivisions use case for division ${divisionId}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Change division status
 * @param {string} id - The division ID
 * @param {string} status - The new status
 * @param {string} userId - The ID of the user changing the status
 * @returns {Promise<Object>} The updated division
 */
const changeDivisionStatus = async (id, status, userId) => {
  try {
    // Check if division exists
    const division = await divisionRepository.getDivisionById(id);
    if (!division) {
      throw new ApplicationError(`Division with ID ${id} not found`, 404);
    }
    
    // Validate status
    const validStatuses = ['ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      throw new ApplicationError(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`, 400);
    }
    
    // If deactivating, check if there are active child divisions
    if (status !== 'ACTIVE' && division.status === 'ACTIVE') {
      const childDivisions = await divisionRepository.getChildDivisions(id);
      const activeChildDivisions = childDivisions.filter(child => child.status === 'ACTIVE');
      
      if (activeChildDivisions.length > 0) {
        throw new ApplicationError(`Cannot deactivate division with ID ${id} because it has ${activeChildDivisions.length} active child divisions`, 400);
      }
    }
    
    return await divisionRepository.changeDivisionStatus(id, status, userId);
  } catch (error) {
    logger.error(`Error in changeDivisionStatus use case for division ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Update division budget
 * @param {string} id - The division ID
 * @param {Object} budgetData - The budget data
 * @param {string} userId - The ID of the user updating the budget
 * @returns {Promise<Object>} The updated division
 */
const updateDivisionBudget = async (id, budgetData, userId) => {
  try {
    // Check if division exists
    const division = await divisionRepository.getDivisionById(id);
    if (!division) {
      throw new ApplicationError(`Division with ID ${id} not found`, 404);
    }
    
    // Validate budget data
    if (budgetData.annual !== undefined && (isNaN(budgetData.annual) || budgetData.annual < 0)) {
      throw new ApplicationError('Annual budget must be a non-negative number', 400);
    }
    
    if (budgetData.spent !== undefined && (isNaN(budgetData.spent) || budgetData.spent < 0)) {
      throw new ApplicationError('Spent budget must be a non-negative number', 400);
    }
    
    if (budgetData.fiscalYear !== undefined && (isNaN(budgetData.fiscalYear) || budgetData.fiscalYear < 2000 || budgetData.fiscalYear > 2100)) {
      throw new ApplicationError('Fiscal year must be a valid year between 2000 and 2100', 400);
    }
    
    return await divisionRepository.updateDivisionBudget(id, budgetData, userId);
  } catch (error) {
    logger.error(`Error in updateDivisionBudget use case for division ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Update division metrics
 * @param {string} id - The division ID
 * @param {Object} metrics - The metrics data
 * @param {string} userId - The ID of the user updating the metrics
 * @returns {Promise<Object>} The updated division
 */
const updateDivisionMetrics = async (id, metrics, userId) => {
  try {
    // Check if division exists
    const division = await divisionRepository.getDivisionById(id);
    if (!division) {
      throw new ApplicationError(`Division with ID ${id} not found`, 404);
    }
    
    // Validate metrics data
    if (!metrics || typeof metrics !== 'object' || Array.isArray(metrics)) {
      throw new ApplicationError('Metrics must be an object', 400);
    }
    
    return await divisionRepository.updateDivisionMetrics(id, metrics, userId);
  } catch (error) {
    logger.error(`Error in updateDivisionMetrics use case for division ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

/**
 * Transfer division to another branch
 * @param {string} id - The division ID
 * @param {string} branchId - The new branch ID
 * @param {string} userId - The ID of the user transferring the division
 * @returns {Promise<Object>} The updated division
 */
const transferDivisionToBranch = async (id, branchId, userId) => {
  try {
    // Check if division exists
    const division = await divisionRepository.getDivisionById(id);
    if (!division) {
      throw new ApplicationError(`Division with ID ${id} not found`, 404);
    }
    
    // Check if branch exists (this would be handled by a branch repository)
    // For now, we'll assume the branch exists
    
    return await divisionRepository.transferDivisionToBranch(id, branchId, userId);
  } catch (error) {
    logger.error(`Error in transferDivisionToBranch use case for division ${id}:`, error);
    throw error instanceof ApplicationError ? error : new ApplicationError(error.message, 500);
  }
};

module.exports = {
  createDivision,
  getDivisionById,
  getDivisionByCode,
  updateDivision,
  deleteDivision,
  listDivisions,
  getDivisionHierarchy,
  getDivisionsByBranch,
  getChildDivisions,
  getDescendantDivisions,
  changeDivisionStatus,
  updateDivisionBudget,
  updateDivisionMetrics,
  transferDivisionToBranch
};
