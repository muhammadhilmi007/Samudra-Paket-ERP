/**
 * Schedule Use Cases
 * Business logic for work schedule and holiday management
 */

const { WorkSchedule, EmployeeSchedule, Holiday, Employee } = require('../../domain/models');
const { logger } = require('../../utils');
const mongoose = require('mongoose');
const moment = require('moment');

/**
 * Create work schedule
 * @param {Object} data - Work schedule data
 * @param {string} userId - User ID creating the schedule
 * @returns {Promise<Object>} Created work schedule
 */
const createWorkSchedule = async (data, userId) => {
  try {
    const {
      name,
      code,
      description,
      type,
      workingDays,
      workingHours,
      overtimeSettings,
      flexibleSettings,
      geofencing,
      branches,
      divisions,
      positions,
      effectiveStartDate,
      effectiveEndDate
    } = data;
    
    // Check if code already exists
    const existingSchedule = await WorkSchedule.findOne({ code });
    if (existingSchedule) {
      throw new Error(`Work schedule with code ${code} already exists`);
    }
    
    // Create work schedule
    const workSchedule = await WorkSchedule.create({
      name,
      code,
      description,
      type,
      status: 'ACTIVE',
      workingDays: workingDays || {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      },
      workingHours: {
        regular: workingHours?.regular || {
          startTime: '08:00',
          endTime: '17:00',
          breakStartTime: '12:00',
          breakEndTime: '13:00',
          lateGracePeriod: 15,
          totalHours: 8
        },
        shifts: workingHours?.shifts || []
      },
      overtimeSettings: overtimeSettings || {
        isAllowed: true,
        maxDailyHours: 3,
        maxWeeklyHours: 15,
        minimumDuration: 30,
        requiresApproval: true
      },
      flexibleSettings: flexibleSettings || {
        coreStartTime: '10:00',
        coreEndTime: '15:00',
        flexStartTimeMin: '07:00',
        flexStartTimeMax: '10:00',
        flexEndTimeMin: '15:00',
        flexEndTimeMax: '19:00',
        minWorkingHours: 8
      },
      geofencing: geofencing || {
        enabled: false,
        locations: []
      },
      branches: branches || [],
      divisions: divisions || [],
      positions: positions || [],
      effectiveStartDate: effectiveStartDate || new Date(),
      effectiveEndDate: effectiveEndDate || null,
      createdBy: mongoose.Types.ObjectId(userId),
      updatedBy: mongoose.Types.ObjectId(userId)
    });
    
    logger.info(`Work schedule created: ${name} (${code})`);
    return workSchedule;
  } catch (error) {
    logger.error('Error creating work schedule:', error);
    throw error;
  }
};

/**
 * Update work schedule
 * @param {string} scheduleId - Work schedule ID
 * @param {Object} data - Updated work schedule data
 * @param {string} userId - User ID updating the schedule
 * @returns {Promise<Object>} Updated work schedule
 */
const updateWorkSchedule = async (scheduleId, data, userId) => {
  try {
    // Find work schedule
    const workSchedule = await WorkSchedule.findById(scheduleId);
    if (!workSchedule) {
      throw new Error('Work schedule not found');
    }
    
    // Check if code is being changed and already exists
    if (data.code && data.code !== workSchedule.code) {
      const existingSchedule = await WorkSchedule.findOne({ code: data.code });
      if (existingSchedule) {
        throw new Error(`Work schedule with code ${data.code} already exists`);
      }
    }
    
    // Update fields
    const updateFields = [
      'name', 'code', 'description', 'type', 'status',
      'workingDays', 'overtimeSettings', 'flexibleSettings',
      'geofencing', 'branches', 'divisions', 'positions',
      'effectiveStartDate', 'effectiveEndDate'
    ];
    
    updateFields.forEach(field => {
      if (data[field] !== undefined) {
        workSchedule[field] = data[field];
      }
    });
    
    // Update working hours
    if (data.workingHours) {
      if (data.workingHours.regular) {
        workSchedule.workingHours.regular = {
          ...workSchedule.workingHours.regular,
          ...data.workingHours.regular
        };
      }
      
      if (data.workingHours.shifts) {
        workSchedule.workingHours.shifts = data.workingHours.shifts;
      }
    }
    
    workSchedule.updatedBy = mongoose.Types.ObjectId(userId);
    
    await workSchedule.save();
    
    logger.info(`Work schedule updated: ${workSchedule.name} (${workSchedule.code})`);
    return workSchedule;
  } catch (error) {
    logger.error('Error updating work schedule:', error);
    throw error;
  }
};

/**
 * Get work schedules
 * @param {Object} filters - Filtering options
 * @returns {Promise<Array>} Work schedules
 */
const getWorkSchedules = async (filters) => {
  try {
    const { status, type, branchId, divisionId, positionId, effectiveDate } = filters;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (effectiveDate) {
      query.effectiveStartDate = { $lte: new Date(effectiveDate) };
      query.$or = [
        { effectiveEndDate: null },
        { effectiveEndDate: { $gte: new Date(effectiveDate) } }
      ];
    }
    
    // Get work schedules
    let workSchedules = await WorkSchedule.find(query)
      .sort({ name: 1 })
      .lean();
    
    // Filter by branch, division, or position if provided
    if (branchId) {
      workSchedules = workSchedules.filter(
        schedule => schedule.branches.some(branch => branch.toString() === branchId)
      );
    }
    
    if (divisionId) {
      workSchedules = workSchedules.filter(
        schedule => schedule.divisions.some(division => division.toString() === divisionId)
      );
    }
    
    if (positionId) {
      workSchedules = workSchedules.filter(
        schedule => schedule.positions.some(position => position.toString() === positionId)
      );
    }
    
    return workSchedules;
  } catch (error) {
    logger.error('Error getting work schedules:', error);
    throw error;
  }
};

/**
 * Assign work schedule to employee
 * @param {Object} data - Assignment data
 * @param {string} userId - User ID making the assignment
 * @returns {Promise<Object>} Created employee schedule
 */
const assignEmployeeSchedule = async (data, userId) => {
  try {
    const {
      employeeId,
      scheduleId,
      effectiveStartDate,
      effectiveEndDate,
      shiftAssignments,
      overrides
    } = data;
    
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Validate work schedule exists
    const workSchedule = await WorkSchedule.findById(scheduleId);
    if (!workSchedule) {
      throw new Error('Work schedule not found');
    }
    
    // Check for overlapping schedule assignments
    const overlappingSchedule = await EmployeeSchedule.findOne({
      employeeId,
      status: 'ACTIVE',
      effectiveStartDate: { $lte: new Date(effectiveEndDate || '9999-12-31') },
      $or: [
        { effectiveEndDate: null },
        { effectiveEndDate: { $gte: new Date(effectiveStartDate) } }
      ]
    });
    
    if (overlappingSchedule) {
      throw new Error('Overlapping schedule assignment found for the selected date range');
    }
    
    // Validate shift assignments if provided
    if (shiftAssignments && shiftAssignments.length > 0) {
      // Ensure work schedule is shift-based
      if (workSchedule.type !== 'SHIFT') {
        throw new Error('Cannot assign shifts to a non-shift work schedule');
      }
      
      // Validate shift codes
      const validShiftCodes = workSchedule.workingHours.shifts.map(shift => shift.code);
      
      for (const assignment of shiftAssignments) {
        if (!validShiftCodes.includes(assignment.shiftCode)) {
          throw new Error(`Invalid shift code: ${assignment.shiftCode}`);
        }
      }
    }
    
    // Create employee schedule
    const employeeSchedule = await EmployeeSchedule.create({
      employeeId,
      scheduleId,
      effectiveStartDate: new Date(effectiveStartDate),
      effectiveEndDate: effectiveEndDate ? new Date(effectiveEndDate) : null,
      shiftAssignments: shiftAssignments || [],
      overrides: overrides || {},
      dateOverrides: [],
      status: 'ACTIVE',
      createdBy: mongoose.Types.ObjectId(userId),
      updatedBy: mongoose.Types.ObjectId(userId)
    });
    
    logger.info(`Work schedule assigned to employee ${employeeId}`);
    return employeeSchedule;
  } catch (error) {
    logger.error('Error assigning employee schedule:', error);
    throw error;
  }
};

/**
 * Update employee schedule
 * @param {string} scheduleId - Employee schedule ID
 * @param {Object} data - Updated schedule data
 * @param {string} userId - User ID updating the schedule
 * @returns {Promise<Object>} Updated employee schedule
 */
const updateEmployeeSchedule = async (scheduleId, data, userId) => {
  try {
    // Find employee schedule
    const employeeSchedule = await EmployeeSchedule.findById(scheduleId);
    if (!employeeSchedule) {
      throw new Error('Employee schedule not found');
    }
    
    // Update fields
    const updateFields = [
      'effectiveStartDate', 'effectiveEndDate', 'status', 'overrides'
    ];
    
    updateFields.forEach(field => {
      if (data[field] !== undefined) {
        employeeSchedule[field] = data[field];
      }
    });
    
    // Update shift assignments if provided
    if (data.shiftAssignments) {
      // Get work schedule to validate shift codes
      const workSchedule = await WorkSchedule.findById(employeeSchedule.scheduleId);
      if (!workSchedule) {
        throw new Error('Work schedule not found');
      }
      
      // Ensure work schedule is shift-based
      if (workSchedule.type !== 'SHIFT') {
        throw new Error('Cannot assign shifts to a non-shift work schedule');
      }
      
      // Validate shift codes
      const validShiftCodes = workSchedule.workingHours.shifts.map(shift => shift.code);
      
      for (const assignment of data.shiftAssignments) {
        if (!validShiftCodes.includes(assignment.shiftCode)) {
          throw new Error(`Invalid shift code: ${assignment.shiftCode}`);
        }
      }
      
      employeeSchedule.shiftAssignments = data.shiftAssignments;
    }
    
    // Update date overrides if provided
    if (data.dateOverrides) {
      employeeSchedule.dateOverrides = data.dateOverrides;
    }
    
    employeeSchedule.updatedBy = mongoose.Types.ObjectId(userId);
    
    await employeeSchedule.save();
    
    logger.info(`Employee schedule updated for ID ${scheduleId}`);
    return employeeSchedule;
  } catch (error) {
    logger.error('Error updating employee schedule:', error);
    throw error;
  }
};

/**
 * Get employee schedules
 * @param {Object} filters - Filtering options
 * @returns {Promise<Array>} Employee schedules
 */
const getEmployeeSchedules = async (filters) => {
  try {
    const { employeeId, scheduleId, status, effectiveDate } = filters;
    
    // Build query
    const query = {};
    
    if (employeeId) {
      query.employeeId = employeeId;
    }
    
    if (scheduleId) {
      query.scheduleId = scheduleId;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (effectiveDate) {
      query.effectiveStartDate = { $lte: new Date(effectiveDate) };
      query.$or = [
        { effectiveEndDate: null },
        { effectiveEndDate: { $gte: new Date(effectiveDate) } }
      ];
    }
    
    // Get employee schedules
    const employeeSchedules = await EmployeeSchedule.find(query)
      .populate('employeeId', 'employeeId firstName lastName fullName')
      .populate('scheduleId', 'name code type')
      .sort({ 'employeeId.employeeId': 1, effectiveStartDate: -1 })
      .lean();
    
    return employeeSchedules;
  } catch (error) {
    logger.error('Error getting employee schedules:', error);
    throw error;
  }
};

/**
 * Create holiday
 * @param {Object} data - Holiday data
 * @param {string} userId - User ID creating the holiday
 * @returns {Promise<Object>} Created holiday
 */
const createHoliday = async (data, userId) => {
  try {
    const {
      name,
      date,
      type,
      description,
      isRecurring,
      isHalfDay,
      halfDayPortion,
      applicableBranches,
      applicableDivisions
    } = data;
    
    // Calculate month and day for recurring holidays
    const holidayDate = moment(date);
    const month = holidayDate.month() + 1; // moment months are 0-indexed
    const day = holidayDate.date();
    
    // Create holiday
    const holiday = await Holiday.create({
      name,
      date: new Date(date),
      type: type || 'NATIONAL',
      description,
      isRecurring: isRecurring !== undefined ? isRecurring : true,
      month,
      day,
      isHalfDay: isHalfDay || false,
      halfDayPortion: halfDayPortion || 'AFTERNOON',
      applicableBranches: applicableBranches || [],
      applicableDivisions: applicableDivisions || [],
      status: 'ACTIVE',
      createdBy: mongoose.Types.ObjectId(userId),
      updatedBy: mongoose.Types.ObjectId(userId)
    });
    
    logger.info(`Holiday created: ${name} on ${holidayDate.format('YYYY-MM-DD')}`);
    return holiday;
  } catch (error) {
    logger.error('Error creating holiday:', error);
    throw error;
  }
};

/**
 * Update holiday
 * @param {string} holidayId - Holiday ID
 * @param {Object} data - Updated holiday data
 * @param {string} userId - User ID updating the holiday
 * @returns {Promise<Object>} Updated holiday
 */
const updateHoliday = async (holidayId, data, userId) => {
  try {
    // Find holiday
    const holiday = await Holiday.findById(holidayId);
    if (!holiday) {
      throw new Error('Holiday not found');
    }
    
    // Update fields
    const updateFields = [
      'name', 'type', 'description', 'isRecurring',
      'isHalfDay', 'halfDayPortion', 'applicableBranches',
      'applicableDivisions', 'status'
    ];
    
    updateFields.forEach(field => {
      if (data[field] !== undefined) {
        holiday[field] = data[field];
      }
    });
    
    // Update date if provided
    if (data.date) {
      const holidayDate = moment(data.date);
      holiday.date = new Date(data.date);
      holiday.month = holidayDate.month() + 1;
      holiday.day = holidayDate.date();
    }
    
    holiday.updatedBy = mongoose.Types.ObjectId(userId);
    
    await holiday.save();
    
    logger.info(`Holiday updated: ${holiday.name}`);
    return holiday;
  } catch (error) {
    logger.error('Error updating holiday:', error);
    throw error;
  }
};

/**
 * Get holidays
 * @param {Object} filters - Filtering options
 * @returns {Promise<Array>} Holidays
 */
const getHolidays = async (filters) => {
  try {
    const { startDate, endDate, type, status, branchId, divisionId } = filters;
    
    // Build query
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    // Get holidays
    let holidays = await Holiday.find(query)
      .sort({ date: 1 })
      .lean();
    
    // Filter by branch or division if provided
    if (branchId) {
      holidays = holidays.filter(
        holiday => 
          holiday.applicableBranches.length === 0 || 
          holiday.applicableBranches.some(branch => branch.toString() === branchId)
      );
    }
    
    if (divisionId) {
      holidays = holidays.filter(
        holiday => 
          holiday.applicableDivisions.length === 0 || 
          holiday.applicableDivisions.some(division => division.toString() === divisionId)
      );
    }
    
    return holidays;
  } catch (error) {
    logger.error('Error getting holidays:', error);
    throw error;
  }
};

/**
 * Generate recurring holidays for a year
 * @param {Object} data - Generation data
 * @param {string} userId - User ID generating the holidays
 * @returns {Promise<Array>} Created holidays
 */
const generateRecurringHolidays = async (data, userId) => {
  try {
    const { year } = data;
    
    if (!year) {
      throw new Error('Year is required');
    }
    
    // Get recurring holidays
    const recurringHolidays = await Holiday.find({
      isRecurring: true,
      status: 'ACTIVE'
    });
    
    if (recurringHolidays.length === 0) {
      logger.info('No recurring holidays found');
      return [];
    }
    
    // Check if holidays already exist for the year
    const existingHolidays = await Holiday.find({
      date: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    });
    
    const existingDates = existingHolidays.map(h => moment(h.date).format('YYYY-MM-DD'));
    
    // Generate holidays for the year
    const newHolidays = [];
    
    for (const template of recurringHolidays) {
      // Create date for the new year
      const holidayDate = moment()
        .year(year)
        .month(template.month - 1) // moment months are 0-indexed
        .date(template.day)
        .startOf('day');
      
      // Skip if date already exists
      if (existingDates.includes(holidayDate.format('YYYY-MM-DD'))) {
        logger.info(`Holiday already exists for ${holidayDate.format('YYYY-MM-DD')}`);
        continue;
      }
      
      // Create new holiday
      const newHoliday = await Holiday.create({
        name: template.name,
        date: holidayDate.toDate(),
        type: template.type,
        description: template.description,
        isRecurring: true,
        month: template.month,
        day: template.day,
        isHalfDay: template.isHalfDay,
        halfDayPortion: template.halfDayPortion,
        applicableBranches: template.applicableBranches,
        applicableDivisions: template.applicableDivisions,
        status: 'ACTIVE',
        createdBy: mongoose.Types.ObjectId(userId),
        updatedBy: mongoose.Types.ObjectId(userId)
      });
      
      newHolidays.push(newHoliday);
    }
    
    logger.info(`Generated ${newHolidays.length} recurring holidays for year ${year}`);
    return newHolidays;
  } catch (error) {
    logger.error('Error generating recurring holidays:', error);
    throw error;
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
