/**
 * Division Repository
 * Handles data access operations for divisions
 */

const { Division, OrganizationalChange } = require('../../domain/models');
const { logger } = require('../../utils');

/**
 * Create a new division
 * @param {Object} divisionData - The division data
 * @param {string} userId - The ID of the user creating the division
 * @returns {Promise<Object>} The created division
 */
const createDivision = async (divisionData, userId) => {
  try {
    // Create the division
    const division = new Division({
      ...divisionData,
      createdBy: userId
    });
    
    const savedDivision = await division.save();
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'DIVISION',
      entityId: savedDivision._id,
      changeType: 'CREATE',
      description: `Division ${savedDivision.name} (${savedDivision.code}) created`,
      newState: savedDivision.toObject(),
      createdBy: userId
    }).save();
    
    return savedDivision;
  } catch (error) {
    logger.error('Error creating division:', error);
    throw error;
  }
};

/**
 * Get a division by ID
 * @param {string} id - The division ID
 * @returns {Promise<Object>} The division
 */
const getDivisionById = async (id) => {
  try {
    return await Division.findById(id);
  } catch (error) {
    logger.error(`Error getting division with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get a division by code
 * @param {string} code - The division code
 * @returns {Promise<Object>} The division
 */
const getDivisionByCode = async (code) => {
  try {
    return await Division.findOne({ code: code.toUpperCase() });
  } catch (error) {
    logger.error(`Error getting division with code ${code}:`, error);
    throw error;
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
    // Get the current state of the division
    const currentDivision = await Division.findById(id);
    if (!currentDivision) {
      throw new Error(`Division with ID ${id} not found`);
    }
    
    // Update the division
    const updatedDivision = await Division.findByIdAndUpdate(
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
      if (JSON.stringify(currentDivision[key]) !== JSON.stringify(updateData[key])) {
        changedFields.push(key);
      }
    }
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'DIVISION',
      entityId: id,
      changeType: 'UPDATE',
      description: `Division ${updatedDivision.name} (${updatedDivision.code}) updated`,
      previousState: currentDivision.toObject(),
      newState: updatedDivision.toObject(),
      changedFields,
      createdBy: userId
    }).save();
    
    return updatedDivision;
  } catch (error) {
    logger.error(`Error updating division with ID ${id}:`, error);
    throw error;
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
    // Get the current state of the division
    const division = await Division.findById(id);
    if (!division) {
      throw new Error(`Division with ID ${id} not found`);
    }
    
    // Delete the division
    const deletedDivision = await Division.findByIdAndDelete(id);
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'DIVISION',
      entityId: id,
      changeType: 'DELETE',
      description: `Division ${division.name} (${division.code}) deleted`,
      previousState: division.toObject(),
      createdBy: userId
    }).save();
    
    return deletedDivision;
  } catch (error) {
    logger.error(`Error deleting division with ID ${id}:`, error);
    throw error;
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
    const skip = (page - 1) * limit;
    const query = {};
    
    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.parent) query.parent = filters.parent;
    if (filters.branch) query.branch = filters.branch;
    if (filters.level !== undefined) query.level = filters.level;
    if (filters.search) {
      query.$or = [
        { name: new RegExp(filters.search, 'i') },
        { code: new RegExp(filters.search, 'i') },
        { description: new RegExp(filters.search, 'i') }
      ];
    }
    
    const total = await Division.countDocuments(query);
    const divisions = await Division.find(query)
      .populate('parent', 'name code')
      .populate('branch', 'name code')
      .skip(skip)
      .limit(limit)
      .sort({ level: 1, code: 1 });
    
    return {
      divisions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error listing divisions:', error);
    throw error;
  }
};

/**
 * Get division hierarchy
 * @returns {Promise<Array>} The division hierarchy
 */
const getDivisionHierarchy = async () => {
  try {
    return await Division.getHierarchy();
  } catch (error) {
    logger.error('Error getting division hierarchy:', error);
    throw error;
  }
};

/**
 * Get divisions by branch
 * @param {string} branchId - The branch ID
 * @returns {Promise<Array>} The divisions in the branch
 */
const getDivisionsByBranch = async (branchId) => {
  try {
    return await Division.find({ branch: branchId }).sort({ level: 1, code: 1 });
  } catch (error) {
    logger.error(`Error getting divisions for branch ${branchId}:`, error);
    throw error;
  }
};

/**
 * Get child divisions
 * @param {string} divisionId - The parent division ID
 * @returns {Promise<Array>} The child divisions
 */
const getChildDivisions = async (divisionId) => {
  try {
    return await Division.findChildren(divisionId);
  } catch (error) {
    logger.error(`Error getting child divisions for division ${divisionId}:`, error);
    throw error;
  }
};

/**
 * Get all descendant divisions
 * @param {string} divisionId - The ancestor division ID
 * @returns {Promise<Array>} The descendant divisions
 */
const getDescendantDivisions = async (divisionId) => {
  try {
    const division = await Division.findById(divisionId);
    if (!division) {
      throw new Error(`Division with ID ${divisionId} not found`);
    }
    
    return await Division.findDescendants(division.path);
  } catch (error) {
    logger.error(`Error getting descendant divisions for division ${divisionId}:`, error);
    throw error;
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
    // Get the current state of the division
    const currentDivision = await Division.findById(id);
    if (!currentDivision) {
      throw new Error(`Division with ID ${id} not found`);
    }
    
    // Update the division status
    const updatedDivision = await Division.findByIdAndUpdate(
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
      entityType: 'DIVISION',
      entityId: id,
      changeType,
      description: `Division ${updatedDivision.name} (${updatedDivision.code}) ${status === 'ACTIVE' ? 'activated' : 'deactivated'}`,
      previousState: currentDivision.toObject(),
      newState: updatedDivision.toObject(),
      changedFields: ['status'],
      createdBy: userId
    }).save();
    
    return updatedDivision;
  } catch (error) {
    logger.error(`Error changing division status with ID ${id}:`, error);
    throw error;
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
    // Get the current state of the division
    const currentDivision = await Division.findById(id);
    if (!currentDivision) {
      throw new Error(`Division with ID ${id} not found`);
    }
    
    // Update the division budget
    const updatedDivision = await Division.findByIdAndUpdate(
      id,
      {
        'budget.annual': budgetData.annual || currentDivision.budget.annual,
        'budget.spent': budgetData.spent || currentDivision.budget.spent,
        'budget.remaining': budgetData.remaining || (budgetData.annual ? budgetData.annual - (budgetData.spent || currentDivision.budget.spent) : currentDivision.budget.remaining),
        'budget.currency': budgetData.currency || currentDivision.budget.currency,
        'budget.fiscalYear': budgetData.fiscalYear || currentDivision.budget.fiscalYear,
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'DIVISION',
      entityId: id,
      changeType: 'UPDATE',
      description: `Division ${updatedDivision.name} (${updatedDivision.code}) budget updated`,
      previousState: { budget: currentDivision.budget },
      newState: { budget: updatedDivision.budget },
      changedFields: ['budget'],
      createdBy: userId
    }).save();
    
    return updatedDivision;
  } catch (error) {
    logger.error(`Error updating division budget with ID ${id}:`, error);
    throw error;
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
    // Get the current state of the division
    const currentDivision = await Division.findById(id);
    if (!currentDivision) {
      throw new Error(`Division with ID ${id} not found`);
    }
    
    // Create a new Map from the current metrics
    const updatedMetrics = new Map(currentDivision.metrics);
    
    // Update the metrics
    for (const [key, value] of Object.entries(metrics)) {
      updatedMetrics.set(key, value);
    }
    
    // Update the division
    const updatedDivision = await Division.findByIdAndUpdate(
      id,
      {
        metrics: updatedMetrics,
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'DIVISION',
      entityId: id,
      changeType: 'UPDATE',
      description: `Division ${updatedDivision.name} (${updatedDivision.code}) metrics updated`,
      previousState: { metrics: Object.fromEntries(currentDivision.metrics) },
      newState: { metrics: Object.fromEntries(updatedMetrics) },
      changedFields: ['metrics'],
      createdBy: userId
    }).save();
    
    return updatedDivision;
  } catch (error) {
    logger.error(`Error updating division metrics with ID ${id}:`, error);
    throw error;
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
    // Get the current state of the division
    const currentDivision = await Division.findById(id);
    if (!currentDivision) {
      throw new Error(`Division with ID ${id} not found`);
    }
    
    // Update the division
    const updatedDivision = await Division.findByIdAndUpdate(
      id,
      {
        branch: branchId,
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );
    
    // Record the organizational change
    await new OrganizationalChange({
      entityType: 'DIVISION',
      entityId: id,
      changeType: 'TRANSFER',
      description: `Division ${updatedDivision.name} (${updatedDivision.code}) transferred to new branch`,
      previousState: { branch: currentDivision.branch },
      newState: { branch: branchId },
      changedFields: ['branch'],
      createdBy: userId
    }).save();
    
    return updatedDivision;
  } catch (error) {
    logger.error(`Error transferring division with ID ${id} to branch ${branchId}:`, error);
    throw error;
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
