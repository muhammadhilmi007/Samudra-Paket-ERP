/**
 * Branch Controller
 * Handles HTTP requests for branch management
 */

const branchUseCases = require('../../application/use-cases/branch');
const { logger } = require('../../utils');

/**
 * Create a new branch
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const createBranch = async (req, res) => {
  try {
    const branchData = req.body;
    const userId = req.user.id;
    
    const branch = await branchUseCases.createBranch(branchData, userId);
    
    return res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch
    });
  } catch (error) {
    logger.error(`Error in createBranch controller: ${error.message}`, { error });
    
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create branch',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Get branch by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getBranch = async (req, res) => {
  try {
    const { id } = req.params;
    
    const branch = await branchUseCases.getBranch(id);
    
    return res.status(200).json({
      success: true,
      data: branch
    });
  } catch (error) {
    logger.error(`Error in getBranch controller: ${error.message}`, { error, branchId: req.params.id });
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to get branch',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Update branch by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    
    const branch = await branchUseCases.updateBranch(id, updateData, userId);
    
    return res.status(200).json({
      success: true,
      message: 'Branch updated successfully',
      data: branch
    });
  } catch (error) {
    logger.error(`Error in updateBranch controller: ${error.message}`, { error, branchId: req.params.id });
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update branch',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Delete branch by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    
    await branchUseCases.deleteBranch(id);
    
    return res.status(200).json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    logger.error(`Error in deleteBranch controller: ${error.message}`, { error, branchId: req.params.id });
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('children')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to delete branch',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * List branches with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const listBranches = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, parent, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (parent) filter.parent = parent;
    
    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const result = await branchUseCases.listBranches({
      filter,
      page,
      limit,
      sort
    });
    
    return res.status(200).json({
      success: true,
      data: result.branches,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in listBranches controller: ${error.message}`, { error, query: req.query });
    
    return res.status(500).json({
      success: false,
      message: 'Failed to list branches',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Get branch hierarchy
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getBranchHierarchy = async (req, res) => {
  try {
    const { id } = req.params;
    
    const hierarchy = await branchUseCases.getBranchHierarchy(id || null);
    
    return res.status(200).json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    logger.error(`Error in getBranchHierarchy controller: ${error.message}`, { error, branchId: req.params.id });
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to get branch hierarchy',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Update branch status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updateBranchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const userId = req.user.id;
    
    const branch = await branchUseCases.updateBranchStatus(id, status, reason, userId);
    
    return res.status(200).json({
      success: true,
      message: `Branch status updated to ${status}`,
      data: branch
    });
  } catch (error) {
    logger.error(`Error in updateBranchStatus controller: ${error.message}`, { error, branchId: req.params.id });
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('Invalid status')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update branch status',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Update branch metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updateBranchMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const metrics = req.body;
    const userId = req.user.id;
    
    const branch = await branchUseCases.updateBranchMetrics(id, metrics, userId);
    
    return res.status(200).json({
      success: true,
      message: 'Branch metrics updated successfully',
      data: branch
    });
  } catch (error) {
    logger.error(`Error in updateBranchMetrics controller: ${error.message}`, { error, branchId: req.params.id });
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update branch metrics',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Update branch resources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updateBranchResources = async (req, res) => {
  try {
    const { id } = req.params;
    const resources = req.body;
    const userId = req.user.id;
    
    const branch = await branchUseCases.updateBranchResources(id, resources, userId);
    
    return res.status(200).json({
      success: true,
      message: 'Branch resources updated successfully',
      data: branch
    });
  } catch (error) {
    logger.error(`Error in updateBranchResources controller: ${error.message}`, { error, branchId: req.params.id });
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update branch resources',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Add document to branch
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const addBranchDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = req.body;
    const userId = req.user.id;
    
    const branch = await branchUseCases.addDocument(id, document, userId);
    
    return res.status(200).json({
      success: true,
      message: 'Document added to branch successfully',
      data: branch
    });
  } catch (error) {
    logger.error(`Error in addBranchDocument controller: ${error.message}`, { error, branchId: req.params.id });
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to add document to branch',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Remove document from branch
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const removeBranchDocument = async (req, res) => {
  try {
    const { id, documentId } = req.params;
    const userId = req.user.id;
    
    await branchUseCases.removeDocument(id, documentId, userId);
    
    return res.status(200).json({
      success: true,
      message: 'Document removed from branch successfully'
    });
  } catch (error) {
    logger.error(`Error in removeBranchDocument controller: ${error.message}`, { error, branchId: req.params.id, documentId: req.params.documentId });
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to remove document from branch',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Update branch operational hours
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updateBranchOperationalHours = async (req, res) => {
  try {
    const { id } = req.params;
    const operationalHours = req.body;
    const userId = req.user.id;
    
    const branch = await branchUseCases.updateBranchOperationalHours(id, operationalHours, userId);
    
    return res.status(200).json({
      success: true,
      message: 'Branch operational hours updated successfully',
      data: branch
    });
  } catch (error) {
    logger.error(`Error in updateBranchOperationalHours controller: ${error.message}`, { error, branchId: req.params.id });
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update branch operational hours',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  createBranch,
  getBranch,
  updateBranch,
  deleteBranch,
  listBranches,
  getBranchHierarchy,
  updateBranchStatus,
  updateBranchMetrics,
  updateBranchResources,
  addBranchDocument,
  removeBranchDocument,
  updateBranchOperationalHours
};
