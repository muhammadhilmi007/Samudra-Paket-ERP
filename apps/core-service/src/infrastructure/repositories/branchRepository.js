/**
 * Branch Repository
 * Implements data access methods for the Branch model
 */

const { Branch } = require('../../domain/models');

/**
 * Create a new branch
 * @param {Object} branchData - Branch data
 * @returns {Promise<Branch>} - Returns created branch
 */
const createBranch = async (branchData) => {
  const branch = new Branch(branchData);
  return branch.save();
};

/**
 * Find branch by ID
 * @param {string} id - Branch ID
 * @returns {Promise<Branch>} - Returns branch if found
 */
const findById = async (id) => {
  return Branch.findById(id);
};

/**
 * Find branch by code
 * @param {string} code - Branch code
 * @returns {Promise<Branch>} - Returns branch if found
 */
const findByCode = async (code) => {
  return Branch.findOne({ code: code.toUpperCase() });
};

/**
 * Find all branches with pagination
 * @param {Object} options - Query options
 * @param {Object} options.filter - Filter criteria
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {Object} options.sort - Sort criteria
 * @returns {Promise<Object>} - Returns paginated branches
 */
const findAll = async ({ filter = {}, page = 1, limit = 10, sort = { createdAt: -1 } }) => {
  const skip = (page - 1) * limit;
  
  const [branches, total] = await Promise.all([
    Branch.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Branch.countDocuments(filter)
  ]);
  
  return {
    branches,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Update branch by ID
 * @param {string} id - Branch ID
 * @param {Object} updateData - Data to update
 * @param {Object} options - Update options
 * @returns {Promise<Branch>} - Returns updated branch
 */
const updateById = async (id, updateData, options = { new: true, runValidators: true }) => {
  return Branch.findByIdAndUpdate(id, updateData, options);
};

/**
 * Delete branch by ID
 * @param {string} id - Branch ID
 * @returns {Promise<Branch>} - Returns deleted branch
 */
const deleteById = async (id) => {
  return Branch.findByIdAndDelete(id);
};

/**
 * Get branch hierarchy
 * @param {string} id - Branch ID
 * @returns {Promise<Object>} - Returns branch with children
 */
const getHierarchy = async (id = null) => {
  if (id) {
    // Get specific branch and its descendants
    const branch = await Branch.findById(id);
    if (!branch) {
      throw new Error('Branch not found');
    }
    
    const children = await getChildrenRecursive(branch._id);
    return {
      ...branch.toObject(),
      children
    };
  } else {
    // Get full hierarchy starting from root branches
    const rootBranches = await Branch.find({ parent: null });
    const hierarchy = [];
    
    for (const rootBranch of rootBranches) {
      const children = await getChildrenRecursive(rootBranch._id);
      hierarchy.push({
        ...rootBranch.toObject(),
        children
      });
    }
    
    return hierarchy;
  }
};

/**
 * Helper function to get children recursively
 * @param {string} parentId - Parent branch ID
 * @returns {Promise<Array>} - Returns children with their children
 */
const getChildrenRecursive = async (parentId) => {
  const children = await Branch.find({ parent: parentId });
  const result = [];
  
  for (const child of children) {
    const grandchildren = await getChildrenRecursive(child._id);
    result.push({
      ...child.toObject(),
      children: grandchildren
    });
  }
  
  return result;
};

/**
 * Search branches
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Returns matching branches
 */
const searchBranches = async (query, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  
  // Create search regex
  const searchRegex = new RegExp(query, 'i');
  
  // Create search filter
  const filter = {
    $or: [
      { name: searchRegex },
      { code: searchRegex },
      { 'address.city': searchRegex },
      { 'address.province': searchRegex },
      { 'contactInfo.email': searchRegex },
      { 'contactInfo.phone': searchRegex }
    ]
  };
  
  const [branches, total] = await Promise.all([
    Branch.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit),
    Branch.countDocuments(filter)
  ]);
  
  return {
    branches,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Update branch status
 * @param {string} id - Branch ID
 * @param {string} status - New status
 * @param {string} reason - Reason for status change
 * @param {string} userId - User ID making the change
 * @returns {Promise<Branch>} - Returns updated branch
 */
const updateStatus = async (id, status, reason, userId) => {
  const branch = await Branch.findById(id);
  if (!branch) {
    throw new Error('Branch not found');
  }
  
  return branch.updateStatus(status, reason, userId);
};

/**
 * Update branch metrics
 * @param {string} id - Branch ID
 * @param {Object} metrics - Metrics data
 * @returns {Promise<Branch>} - Returns updated branch
 */
const updateMetrics = async (id, metrics) => {
  return Branch.findByIdAndUpdate(
    id,
    { $set: { 'metrics': metrics } },
    { new: true, runValidators: true }
  );
};

/**
 * Update branch resources
 * @param {string} id - Branch ID
 * @param {Object} resources - Resources data
 * @returns {Promise<Branch>} - Returns updated branch
 */
const updateResources = async (id, resources) => {
  return Branch.findByIdAndUpdate(
    id,
    { $set: { 'resources': resources } },
    { new: true, runValidators: true }
  );
};

/**
 * Add document to branch
 * @param {string} id - Branch ID
 * @param {Object} document - Document data
 * @returns {Promise<Branch>} - Returns updated branch
 */
const addDocument = async (id, document) => {
  return Branch.findByIdAndUpdate(
    id,
    { $push: { documents: document } },
    { new: true, runValidators: true }
  );
};

/**
 * Remove document from branch
 * @param {string} branchId - Branch ID
 * @param {string} documentId - Document ID
 * @returns {Promise<Branch>} - Returns updated branch
 */
const removeDocument = async (branchId, documentId) => {
  return Branch.findByIdAndUpdate(
    branchId,
    { $pull: { documents: { _id: documentId } } },
    { new: true }
  );
};

/**
 * Update branch operational hours
 * @param {string} id - Branch ID
 * @param {Array} operationalHours - Operational hours data
 * @returns {Promise<Branch>} - Returns updated branch
 */
const updateOperationalHours = async (id, operationalHours) => {
  return Branch.findByIdAndUpdate(
    id,
    { $set: { operationalHours } },
    { new: true, runValidators: true }
  );
};

/**
 * Get branches by type
 * @param {string} type - Branch type
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Returns paginated branches
 */
const findByType = async (type, { page = 1, limit = 10 } = {}) => {
  return findAll({
    filter: { type },
    page,
    limit
  });
};

/**
 * Get active branches
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Returns paginated active branches
 */
const findActiveBranches = async ({ page = 1, limit = 10 } = {}) => {
  return findAll({
    filter: { status: 'ACTIVE' },
    page,
    limit
  });
};

module.exports = {
  createBranch,
  findById,
  findByCode,
  findAll,
  updateById,
  deleteById,
  getHierarchy,
  searchBranches,
  updateStatus,
  updateMetrics,
  updateResources,
  addDocument,
  removeDocument,
  updateOperationalHours,
  findByType,
  findActiveBranches
};
