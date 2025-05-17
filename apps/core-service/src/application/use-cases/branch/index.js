/**
 * Branch Use Cases Index
 * Export all branch use cases for easy importing
 */

const createBranch = require('./createBranch');
const updateBranch = require('./updateBranch');
const getBranch = require('./getBranch');
const listBranches = require('./listBranches');
const deleteBranch = require('./deleteBranch');
const getBranchHierarchy = require('./getBranchHierarchy');
const updateBranchStatus = require('./updateBranchStatus');
const updateBranchMetrics = require('./updateBranchMetrics');
const updateBranchResources = require('./updateBranchResources');
const { addDocument, removeDocument } = require('./manageBranchDocuments');
const updateBranchOperationalHours = require('./updateBranchOperationalHours');

module.exports = {
  createBranch,
  updateBranch,
  getBranch,
  listBranches,
  deleteBranch,
  getBranchHierarchy,
  updateBranchStatus,
  updateBranchMetrics,
  updateBranchResources,
  addDocument,
  removeDocument,
  updateBranchOperationalHours
};
