/**
 * Attendance Controller
 * Handles HTTP requests for attendance management
 */

const { attendanceUseCases } = require('../../application/use-cases');
const { logger } = require('../../utils');

/**
 * Record employee check-in
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const recordCheckIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const checkInData = {
      employeeId: req.body.employeeId,
      location: {
        coordinates: req.body.location.coordinates
      },
      device: req.body.device,
      ipAddress: req.ip || req.connection.remoteAddress,
      notes: req.body.notes
    };
    
    const attendance = await attendanceUseCases.recordCheckIn(checkInData, userId);
    
    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Check-in recorded successfully'
    });
  } catch (error) {
    logger.error('Error in recordCheckIn controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Record employee check-out
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const recordCheckOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const checkOutData = {
      employeeId: req.body.employeeId,
      location: {
        coordinates: req.body.location.coordinates
      },
      device: req.body.device,
      ipAddress: req.ip || req.connection.remoteAddress,
      notes: req.body.notes
    };
    
    const attendance = await attendanceUseCases.recordCheckOut(checkOutData, userId);
    
    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Check-out recorded successfully'
    });
  } catch (error) {
    logger.error('Error in recordCheckOut controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get attendance records for an employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmployeeAttendance = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      status: req.query.status
    };
    
    const attendanceRecords = await attendanceUseCases.getEmployeeAttendance(employeeId, filters);
    
    res.status(200).json({
      success: true,
      data: attendanceRecords,
      count: attendanceRecords.length,
      message: 'Attendance records retrieved successfully'
    });
  } catch (error) {
    logger.error('Error in getEmployeeAttendance controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get attendance summary for an employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAttendanceSummary = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const summary = await attendanceUseCases.getAttendanceSummary(employeeId, filters);
    
    res.status(200).json({
      success: true,
      data: summary,
      message: 'Attendance summary retrieved successfully'
    });
  } catch (error) {
    logger.error('Error in getAttendanceSummary controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Request attendance correction
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const requestAttendanceCorrection = async (req, res) => {
  try {
    const userId = req.user.id;
    const correctionData = {
      attendanceId: req.params.attendanceId,
      reason: req.body.reason
    };
    
    const attendance = await attendanceUseCases.requestAttendanceCorrection(correctionData, userId);
    
    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Attendance correction requested successfully'
    });
  } catch (error) {
    logger.error('Error in requestAttendanceCorrection controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Review attendance correction request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const reviewAttendanceCorrection = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewData = {
      attendanceId: req.params.attendanceId,
      status: req.body.status,
      reviewNotes: req.body.reviewNotes,
      correctedData: req.body.correctedData
    };
    
    const attendance = await attendanceUseCases.reviewAttendanceCorrection(reviewData, userId);
    
    res.status(200).json({
      success: true,
      data: attendance,
      message: `Attendance correction ${req.body.status.toLowerCase()} successfully`
    });
  } catch (error) {
    logger.error('Error in reviewAttendanceCorrection controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get attendance anomalies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAttendanceAnomalies = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      branchId: req.query.branchId,
      divisionId: req.query.divisionId,
      anomalyType: req.query.anomalyType
    };
    
    const anomalies = await attendanceUseCases.getAttendanceAnomalies(filters);
    
    res.status(200).json({
      success: true,
      data: anomalies,
      count: anomalies.length,
      message: 'Attendance anomalies retrieved successfully'
    });
  } catch (error) {
    logger.error('Error in getAttendanceAnomalies controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  recordCheckIn,
  recordCheckOut,
  getEmployeeAttendance,
  getAttendanceSummary,
  requestAttendanceCorrection,
  reviewAttendanceCorrection,
  getAttendanceAnomalies
};
