/**
 * Leave Controller
 * Handles HTTP requests for leave management
 */

const { leaveUseCases } = require('../../application/use-cases');
const { logger } = require('../../utils');

/**
 * Request leave
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const requestLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaveData = {
      employeeId: req.body.employeeId,
      type: req.body.type,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason,
      isHalfDay: req.body.isHalfDay,
      halfDayPortion: req.body.halfDayPortion,
      attachments: req.body.attachments
    };
    
    const leaveRequest = await leaveUseCases.requestLeave(leaveData, userId);
    
    res.status(201).json({
      success: true,
      data: leaveRequest,
      message: 'Leave request submitted successfully'
    });
  } catch (error) {
    logger.error('Error in requestLeave controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Approve or reject leave request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const approveOrRejectLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const approvalData = {
      leaveId: req.params.leaveId,
      status: req.body.status,
      notes: req.body.notes,
      approverRole: req.body.approverRole,
      approverName: req.body.approverName
    };
    
    const leaveRequest = await leaveUseCases.approveOrRejectLeave(approvalData, userId);
    
    res.status(200).json({
      success: true,
      data: leaveRequest,
      message: `Leave request ${req.body.status.toLowerCase()} successfully`
    });
  } catch (error) {
    logger.error('Error in approveOrRejectLeave controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Cancel leave request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const cancelLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const cancellationData = {
      leaveId: req.params.leaveId,
      reason: req.body.reason
    };
    
    const leaveRequest = await leaveUseCases.cancelLeave(cancellationData, userId);
    
    res.status(200).json({
      success: true,
      data: leaveRequest,
      message: 'Leave request cancelled successfully'
    });
  } catch (error) {
    logger.error('Error in cancelLeave controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get leave requests for an employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmployeeLeaves = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      status: req.query.status,
      type: req.query.type
    };
    
    const leaveRequests = await leaveUseCases.getEmployeeLeaves(employeeId, filters);
    
    res.status(200).json({
      success: true,
      data: leaveRequests,
      count: leaveRequests.length,
      message: 'Leave requests retrieved successfully'
    });
  } catch (error) {
    logger.error('Error in getEmployeeLeaves controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get leave balance for an employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLeaveBalance = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const year = req.query.year ? parseInt(req.query.year) : null;
    
    const leaveBalance = await leaveUseCases.getLeaveBalance(employeeId, year);
    
    res.status(200).json({
      success: true,
      data: leaveBalance,
      message: 'Leave balance retrieved successfully'
    });
  } catch (error) {
    logger.error('Error in getLeaveBalance controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Initialize leave balance for an employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const initializeLeaveBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const balanceData = {
      employeeId: req.body.employeeId,
      year: req.body.year,
      balances: req.body.balances,
      accrualSettings: req.body.accrualSettings
    };
    
    const leaveBalance = await leaveUseCases.initializeLeaveBalance(balanceData, userId);
    
    res.status(201).json({
      success: true,
      data: leaveBalance,
      message: 'Leave balance initialized successfully'
    });
  } catch (error) {
    logger.error('Error in initializeLeaveBalance controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Adjust leave balance
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const adjustLeaveBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const adjustmentData = {
      employeeId: req.params.employeeId,
      year: req.body.year,
      type: req.body.type,
      amount: req.body.amount,
      reason: req.body.reason
    };
    
    const leaveBalance = await leaveUseCases.adjustLeaveBalance(adjustmentData, userId);
    
    res.status(200).json({
      success: true,
      data: leaveBalance,
      message: 'Leave balance adjusted successfully'
    });
  } catch (error) {
    logger.error('Error in adjustLeaveBalance controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Calculate leave accruals
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const calculateLeaveAccruals = async (req, res) => {
  try {
    const userId = req.user.id;
    const calculationData = {
      employeeIds: req.body.employeeIds,
      calculateDate: req.body.calculateDate
    };
    
    const updatedBalances = await leaveUseCases.calculateLeaveAccruals(calculationData, userId);
    
    res.status(200).json({
      success: true,
      data: updatedBalances,
      count: updatedBalances.length,
      message: 'Leave accruals calculated successfully'
    });
  } catch (error) {
    logger.error('Error in calculateLeaveAccruals controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Process year-end leave carryover
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const processLeaveCarryover = async (req, res) => {
  try {
    const userId = req.user.id;
    const carryoverData = {
      fromYear: req.body.fromYear,
      toYear: req.body.toYear,
      employeeIds: req.body.employeeIds
    };
    
    const newBalances = await leaveUseCases.processLeaveCarryover(carryoverData, userId);
    
    res.status(200).json({
      success: true,
      data: newBalances,
      count: newBalances.length,
      message: 'Leave carryover processed successfully'
    });
  } catch (error) {
    logger.error('Error in processLeaveCarryover controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  requestLeave,
  approveOrRejectLeave,
  cancelLeave,
  getEmployeeLeaves,
  getLeaveBalance,
  initializeLeaveBalance,
  adjustLeaveBalance,
  calculateLeaveAccruals,
  processLeaveCarryover
};
