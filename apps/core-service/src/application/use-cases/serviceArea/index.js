/**
 * Service Area Use Cases Index
 * Export all service area use cases for easy importing
 */

// Service Area CRUD
const createServiceArea = require('./createServiceArea');
const getServiceArea = require('./getServiceArea');
const listServiceAreas = require('./listServiceAreas');
const updateServiceArea = require('./updateServiceArea');
const deleteServiceArea = require('./deleteServiceArea');
const getServiceAreaHistory = require('./getServiceAreaHistory');

// Service Area Assignment
const assignServiceAreaToBranch = require('./assignServiceAreaToBranch');
const getServiceAreaAssignment = require('./getServiceAreaAssignment');
const listServiceAreasByBranch = require('./listServiceAreasByBranch');
const listBranchesByServiceArea = require('./listBranchesByServiceArea');
const updateServiceAreaAssignment = require('./updateServiceAreaAssignment');
const removeServiceAreaAssignment = require('./removeServiceAreaAssignment');

// Service Area Pricing
const createServiceAreaPricing = require('./createServiceAreaPricing');
const getServiceAreaPricing = require('./getServiceAreaPricing');
const listServiceAreaPricings = require('./listServiceAreaPricings');
const updateServiceAreaPricing = require('./updateServiceAreaPricing');
const deleteServiceAreaPricing = require('./deleteServiceAreaPricing');
const calculateShippingPrice = require('./calculateShippingPrice');

// Service Area Geospatial
const findServiceAreasByLocation = require('./findServiceAreasByLocation');
const findBranchesServingLocation = require('./findBranchesServingLocation');

module.exports = {
  // Service Area CRUD
  createServiceArea,
  getServiceArea,
  listServiceAreas,
  updateServiceArea,
  deleteServiceArea,
  getServiceAreaHistory,
  
  // Service Area Assignment
  assignServiceAreaToBranch,
  getServiceAreaAssignment,
  listServiceAreasByBranch,
  listBranchesByServiceArea,
  updateServiceAreaAssignment,
  removeServiceAreaAssignment,
  
  // Service Area Pricing
  createServiceAreaPricing,
  getServiceAreaPricing,
  listServiceAreaPricings,
  updateServiceAreaPricing,
  deleteServiceAreaPricing,
  calculateShippingPrice,
  
  // Service Area Geospatial
  findServiceAreasByLocation,
  findBranchesServingLocation
};
