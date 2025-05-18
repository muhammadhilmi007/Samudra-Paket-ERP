/**
 * Schedule Controller
 * Handles HTTP requests for work schedule and holiday management
 */

const { scheduleUseCases } = require('../../application/use-cases');
const { logger } = require('../../utils');

/**
 * Create work schedule
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createWorkSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const scheduleData = {
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
      type: req.body.type,
      workingDays: req.body.workingDays,
      workingHours: req.body.workingHours,
      overtimeSettings: req.body.overtimeSettings,
      flexibleSettings: req.body.flexibleSettings,
      geofencing: req.body.geofencing,
      branches: req.body.branches,
      divisions: req.body.divisions,
      positions: req.body.positions,
      effectiveStartDate: req.body.effectiveStartDate,
      effectiveEndDate: req.body.effectiveEndDate
    };
    
    const workSchedule = await scheduleUseCases.createWorkSchedule(scheduleData, userId);
    
    res.status(201).json({
      success: true,
      data: workSchedule,
      message: 'Work schedule created successfully'
    });
  } catch (error) {
    logger.error('Error in createWorkSchedule controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update work schedule
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateWorkSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const scheduleId = req.params.scheduleId;
    const updateData = req.body;
    
    const workSchedule = await scheduleUseCases.updateWorkSchedule(scheduleId, updateData, userId);
    
    res.status(200).json({
      success: true,
      data: workSchedule,
      message: 'Work schedule updated successfully'
    });
  } catch (error) {
    logger.error('Error in updateWorkSchedule controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get work schedules
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getWorkSchedules = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      type: req.query.type,
      branchId: req.query.branchId,
      divisionId: req.query.divisionId,
      positionId: req.query.positionId,
      effectiveDate: req.query.effectiveDate
    };
    
    const workSchedules = await scheduleUseCases.getWorkSchedules(filters);
    
    res.status(200).json({
      success: true,
      data: workSchedules,
      count: workSchedules.length,
      message: 'Work schedules retrieved successfully'
    });
  } catch (error) {
    logger.error('Error in getWorkSchedules controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Assign work schedule to employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const assignEmployeeSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const assignmentData = {
      employeeId: req.body.employeeId,
      scheduleId: req.body.scheduleId,
      effectiveStartDate: req.body.effectiveStartDate,
      effectiveEndDate: req.body.effectiveEndDate,
      shiftAssignments: req.body.shiftAssignments,
      overrides: req.body.overrides
    };
    
    const employeeSchedule = await scheduleUseCases.assignEmployeeSchedule(assignmentData, userId);
    
    res.status(201).json({
      success: true,
      data: employeeSchedule,
      message: 'Work schedule assigned to employee successfully'
    });
  } catch (error) {
    logger.error('Error in assignEmployeeSchedule controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update employee schedule
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateEmployeeSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const scheduleId = req.params.scheduleId;
    const updateData = req.body;
    
    const employeeSchedule = await scheduleUseCases.updateEmployeeSchedule(scheduleId, updateData, userId);
    
    res.status(200).json({
      success: true,
      data: employeeSchedule,
      message: 'Employee schedule updated successfully'
    });
  } catch (error) {
    logger.error('Error in updateEmployeeSchedule controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get employee schedules
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmployeeSchedules = async (req, res) => {
  try {
    const filters = {
      employeeId: req.query.employeeId,
      scheduleId: req.query.scheduleId,
      status: req.query.status,
      effectiveDate: req.query.effectiveDate
    };
    
    const employeeSchedules = await scheduleUseCases.getEmployeeSchedules(filters);
    
    res.status(200).json({
      success: true,
      data: employeeSchedules,
      count: employeeSchedules.length,
      message: 'Employee schedules retrieved successfully'
    });
  } catch (error) {
    logger.error('Error in getEmployeeSchedules controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create holiday
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createHoliday = async (req, res) => {
  try {
    const userId = req.user.id;
    const holidayData = {
      name: req.body.name,
      date: req.body.date,
      type: req.body.type,
      description: req.body.description,
      isRecurring: req.body.isRecurring,
      isHalfDay: req.body.isHalfDay,
      halfDayPortion: req.body.halfDayPortion,
      applicableBranches: req.body.applicableBranches,
      applicableDivisions: req.body.applicableDivisions
    };
    
    const holiday = await scheduleUseCases.createHoliday(holidayData, userId);
    
    res.status(201).json({
      success: true,
      data: holiday,
      message: 'Holiday created successfully'
    });
  } catch (error) {
    logger.error('Error in createHoliday controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update holiday
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateHoliday = async (req, res) => {
  try {
    const userId = req.user.id;
    const holidayId = req.params.holidayId;
    const updateData = req.body;
    
    const holiday = await scheduleUseCases.updateHoliday(holidayId, updateData, userId);
    
    res.status(200).json({
      success: true,
      data: holiday,
      message: 'Holiday updated successfully'
    });
  } catch (error) {
    logger.error('Error in updateHoliday controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get holidays
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getHolidays = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      type: req.query.type,
      status: req.query.status,
      branchId: req.query.branchId,
      divisionId: req.query.divisionId
    };
    
    const holidays = await scheduleUseCases.getHolidays(filters);
    
    res.status(200).json({
      success: true,
      data: holidays,
      count: holidays.length,
      message: 'Holidays retrieved successfully'
    });
  } catch (error) {
    logger.error('Error in getHolidays controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Generate recurring holidays for a year
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateRecurringHolidays = async (req, res) => {
  try {
    const userId = req.user.id;
    const generationData = {
      year: req.body.year
    };
    
    const holidays = await scheduleUseCases.generateRecurringHolidays(generationData, userId);
    
    res.status(201).json({
      success: true,
      data: holidays,
      count: holidays.length,
      message: 'Recurring holidays generated successfully'
    });
  } catch (error) {
    logger.error('Error in generateRecurringHolidays controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createWorkSchedule,
  updateWorkSchedule,
  getWorkSchedules,
  assignEmployeeSchedule,
  updateEmployeeSchedule,
  getEmployeeSchedules,
  createHoliday,
  updateHoliday,
  getHolidays,
  generateRecurringHolidays
};
