/**
 * Attendance Service Configuration
 * Configuration for the Attendance Service endpoints in the API Gateway
 */

const attendanceServiceConfig = {
  // Base URL for the Core Service where Attendance functionality is implemented
  baseUrl: process.env.CORE_SERVICE_URL || 'http://localhost:3002',
  
  // Endpoints mapping for Attendance functionality
  endpoints: {
    // Attendance endpoints
    checkIn: '/api/attendance/check-in',
    checkOut: '/api/attendance/check-out',
    getEmployeeAttendance: '/api/attendance/employee/:employeeId',
    getAttendanceSummary: '/api/attendance/summary/:employeeId',
    requestAttendanceCorrection: '/api/attendance/correction/:attendanceId',
    reviewAttendanceCorrection: '/api/attendance/correction/:attendanceId/review',
    getAttendanceAnomalies: '/api/attendance/anomalies',
    
    // Leave endpoints
    requestLeave: '/api/leave/request',
    approveOrRejectLeave: '/api/leave/:leaveId/approve-reject',
    cancelLeave: '/api/leave/:leaveId/cancel',
    getEmployeeLeaves: '/api/leave/employee/:employeeId',
    getLeaveBalance: '/api/leave/balance/:employeeId',
    initializeLeaveBalance: '/api/leave/balance/initialize',
    adjustLeaveBalance: '/api/leave/balance/:employeeId/adjust',
    calculateLeaveAccruals: '/api/leave/accruals/calculate',
    processLeaveCarryover: '/api/leave/carryover',
    
    // Schedule endpoints
    createWorkSchedule: '/api/schedule/work-schedule',
    updateWorkSchedule: '/api/schedule/work-schedule/:scheduleId',
    getWorkSchedules: '/api/schedule/work-schedule',
    assignEmployeeSchedule: '/api/schedule/employee-schedule',
    updateEmployeeSchedule: '/api/schedule/employee-schedule/:scheduleId',
    getEmployeeSchedules: '/api/schedule/employee-schedule',
    createHoliday: '/api/schedule/holiday',
    updateHoliday: '/api/schedule/holiday/:holidayId',
    getHolidays: '/api/schedule/holiday',
    generateRecurringHolidays: '/api/schedule/holiday/generate-recurring'
  },
  
  // Required roles for accessing attendance endpoints
  roles: {
    // Attendance roles
    checkIn: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER'],
    checkOut: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER'],
    getEmployeeAttendance: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER', 'MANAGER'],
    getAttendanceSummary: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER', 'MANAGER'],
    requestAttendanceCorrection: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER'],
    reviewAttendanceCorrection: ['ADMIN', 'HR_STAFF', 'HR_MANAGER'],
    getAttendanceAnomalies: ['ADMIN', 'HR_STAFF', 'HR_MANAGER', 'MANAGER'],
    
    // Leave roles
    requestLeave: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER'],
    approveOrRejectLeave: ['ADMIN', 'HR_MANAGER', 'MANAGER'],
    cancelLeave: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER'],
    getEmployeeLeaves: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER', 'MANAGER'],
    getLeaveBalance: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER', 'MANAGER'],
    initializeLeaveBalance: ['ADMIN', 'HR_MANAGER', 'HR_STAFF'],
    adjustLeaveBalance: ['ADMIN', 'HR_MANAGER'],
    calculateLeaveAccruals: ['ADMIN', 'HR_MANAGER'],
    processLeaveCarryover: ['ADMIN', 'HR_MANAGER'],
    
    // Schedule roles
    createWorkSchedule: ['ADMIN', 'HR_MANAGER'],
    updateWorkSchedule: ['ADMIN', 'HR_MANAGER'],
    getWorkSchedules: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER', 'MANAGER'],
    assignEmployeeSchedule: ['ADMIN', 'HR_MANAGER', 'HR_STAFF'],
    updateEmployeeSchedule: ['ADMIN', 'HR_MANAGER', 'HR_STAFF'],
    getEmployeeSchedules: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER', 'MANAGER'],
    createHoliday: ['ADMIN', 'HR_MANAGER'],
    updateHoliday: ['ADMIN', 'HR_MANAGER'],
    getHolidays: ['EMPLOYEE', 'ADMIN', 'HR_STAFF', 'HR_MANAGER', 'MANAGER'],
    generateRecurringHolidays: ['ADMIN', 'HR_MANAGER']
  },
  
  // Cache configuration for attendance endpoints
  cache: {
    // Attendance cache
    getEmployeeAttendance: { ttl: 300 }, // 5 minutes
    getAttendanceSummary: { ttl: 300 }, // 5 minutes
    getAttendanceAnomalies: { ttl: 300 }, // 5 minutes
    
    // Leave cache
    getEmployeeLeaves: { ttl: 300 }, // 5 minutes
    getLeaveBalance: { ttl: 300 }, // 5 minutes
    
    // Schedule cache
    getWorkSchedules: { ttl: 600 }, // 10 minutes
    getEmployeeSchedules: { ttl: 600 }, // 10 minutes
    getHolidays: { ttl: 3600 } // 1 hour
  },
  
  // Circuit breaker configuration
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeout: 30000, // 30 seconds
    timeout: 10000 // 10 seconds
  }
};

module.exports = attendanceServiceConfig;
