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
const Division = require('./Division');
const Position = require('./Position');
const OrganizationalChange = require('./OrganizationalChange');
const Employee = require('./Employee');
const EmployeeHistory = require('./EmployeeHistory');

// Attendance Management Models
const Attendance = require('./Attendance');
const Leave = require('./Leave');
const LeaveBalance = require('./LeaveBalance');
const WorkSchedule = require('./WorkSchedule');
const EmployeeSchedule = require('./EmployeeSchedule');
const Holiday = require('./Holiday');

module.exports = {
  Branch,
  ServiceArea,
  BranchServiceArea,
  ServiceAreaPricing,
  ServiceAreaHistory,
  GeospatialPoint,
  Division,
  Position,
  OrganizationalChange,
  Employee,
  EmployeeHistory,
  
  // Attendance Management Models
  Attendance,
  Leave,
  LeaveBalance,
  WorkSchedule,
  EmployeeSchedule,
  Holiday
};
