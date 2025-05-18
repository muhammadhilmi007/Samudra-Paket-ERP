/**
 * Controllers Index
 * Export all controllers for easy importing
 */

const divisionController = require('./divisionController');
const positionController = require('./positionController');
const organizationalChangeController = require('./organizationalChangeController');

module.exports = {
  divisionController,
  positionController,
  organizationalChangeController
};
