/**
 * Use Cases Index
 * Export all use cases for easy importing
 */

const divisionUseCases = require('./divisionUseCases');
const positionUseCases = require('./positionUseCases');
const organizationalChangeUseCases = require('./organizationalChangeUseCases');
const employeeUseCases = require('./employeeUseCases');

// Attendance Management Use Cases
const attendanceUseCases = require('./attendanceUseCases');
const leaveUseCases = require('./leaveUseCases');
const scheduleUseCases = require('./scheduleUseCases');

module.exports = {
  divisionUseCases,
  positionUseCases,
  organizationalChangeUseCases,
  employeeUseCases,
  
  // Attendance Management Use Cases
  attendanceUseCases,
  leaveUseCases,
  scheduleUseCases
};
