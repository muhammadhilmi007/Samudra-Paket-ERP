/**
 * Controllers Index
 * Export all controllers for easy importing
 */

const divisionController = require('./divisionController');
const positionController = require('./positionController');
const organizationalChangeController = require('./organizationalChangeController');
const employeeController = require('./employeeController');
const employeeHistoryController = require('./employeeHistoryController');
const branchController = require('./branchController');
const serviceAreaController = require('./serviceAreaController');

// Attendance Management Controllers
const attendanceController = require('./attendanceController');
const leaveController = require('./leaveController');
const scheduleController = require('./scheduleController');

module.exports = {
  divisionController,
  positionController,
  organizationalChangeController,
  employeeController,
  employeeHistoryController,
  branchController,
  serviceAreaController,
  
  // Attendance Management Controllers
  attendanceController,
  leaveController,
  scheduleController
};
