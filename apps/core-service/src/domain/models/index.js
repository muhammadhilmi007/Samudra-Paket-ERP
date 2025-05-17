/**
 * Models Index
 * Export all models for easy importing
 */

const Branch = require('./Branch');
const ServiceArea = require('./ServiceArea');
const BranchServiceArea = require('./BranchServiceArea');
const ServiceAreaPricing = require('./ServiceAreaPricing');
const ServiceAreaHistory = require('./ServiceAreaHistory');
const GeospatialPoint = require('./GeospatialPoint');

module.exports = {
  Branch,
  ServiceArea,
  BranchServiceArea,
  ServiceAreaPricing,
  ServiceAreaHistory,
  GeospatialPoint
};
