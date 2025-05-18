/**
 * Repositories Index
 * Export all repositories for easy importing
 */

const branchRepository = require('./branchRepository');
const divisionRepository = require('./divisionRepository');
const positionRepository = require('./positionRepository');
const organizationalChangeRepository = require('./organizationalChangeRepository');
const serviceAreaRepository = require('./serviceAreaRepository');
const geospatialPointRepository = require('./geospatialPointRepository');

module.exports = {
  branchRepository,
  divisionRepository,
  positionRepository,
  organizationalChangeRepository,
  serviceAreaRepository,
  geospatialPointRepository
};
