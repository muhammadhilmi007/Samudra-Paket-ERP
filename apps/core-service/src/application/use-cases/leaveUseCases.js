/**
 * Leave Use Cases
 * Business logic for leave management
 */

const { Leave, LeaveBalance, Employee, Holiday } = require('../../domain/models');
const { logger } = require('../../utils');
const mongoose = require('mongoose');
const moment = require('moment');

/**
 * Request leave
 * @param {Object} data - Leave request data
 * @param {string} userId - User ID requesting leave
 * @returns {Promise<Object>} Created leave request
 */
const requestLeave = async (data, userId) => {
  try {
    const { 
      employeeId, 
      type, 
      startDate, 
      endDate, 
      reason, 
      isHalfDay, 
      halfDayPortion, 
      attachments 
    } = data;
    
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Calculate duration in days
    const start = moment(startDate);
    const end = moment(endDate);
    
    if (end.isBefore(start)) {
      throw new Error('End date cannot be before start date');
    }
    
    // Calculate working days (excluding weekends and holidays)
    let duration = 0;
    let currentDate = start.clone();
    
    // Get holidays within the date range
    const holidays = await Holiday.find({
      date: {
        $gte: start.toDate(),
        $lte: end.toDate()
      },
      status: 'ACTIVE'
    });
    
    const holidayDates = holidays.map(h => moment(h.date).format('YYYY-MM-DD'));
    
    while (currentDate.isSameOrBefore(end)) {
      const dayOfWeek = currentDate.day();
      const dateStr = currentDate.format('YYYY-MM-DD');
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Skip holidays
        if (!holidayDates.includes(dateStr)) {
          duration += 1;
        }
      }
      
      currentDate.add(1, 'days');
    }
    
    // Adjust for half day if applicable
    if (isHalfDay) {
      duration = 0.5;
    }
    
    if (duration <= 0) {
      throw new Error('Leave duration must be greater than zero working days');
    }
    
    // Check leave balance
    const currentYear = new Date().getFullYear();
    let leaveBalance = await LeaveBalance.findOne({
      employeeId,
      year: currentYear
    });
    
    if (!leaveBalance) {
      throw new Error('Leave balance not found for the current year');
    }
    
    // Find the balance for the requested leave type
    const typeBalance = leaveBalance.balances.find(b => b.type === type);
    if (!typeBalance) {
      throw new Error(`No balance found for leave type: ${type}`);
    }
    
    // Calculate available balance
    const available = typeBalance.allocated + typeBalance.additional + typeBalance.carriedOver - typeBalance.used - typeBalance.pending;
    
    // Check if sufficient balance is available
    if (available < duration && type !== 'UNPAID') {
      throw new Error(`Insufficient leave balance. Available: ${available} days, Requested: ${duration} days`);
    }
    
    // Check for overlapping leave requests
    const overlappingLeave = await Leave.findOne({
      employeeId,
      status: { $in: ['PENDING', 'APPROVED'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });
    
    if (overlappingLeave) {
      throw new Error('Overlapping leave request found for the selected date range');
    }
    
    // Create leave request
    const leaveRequest = await Leave.create({
      employeeId,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      duration,
      isHalfDay: isHalfDay || false,
      halfDayPortion: halfDayPortion || 'MORNING',
      reason,
      attachments: attachments || [],
      status: 'PENDING',
      approvalHistory: [
        {
          status: 'PENDING',
          approverRole: 'EMPLOYEE',
          approverId: mongoose.Types.ObjectId(userId),
          approverName: `${employee.firstName} ${employee.lastName}`,
          notes: 'Leave request submitted',
          timestamp: new Date()
        }
      ],
      createdBy: mongoose.Types.ObjectId(userId),
      updatedBy: mongoose.Types.ObjectId(userId)
    });
    
    // Update leave balance (add to pending)
    typeBalance.pending += duration;
    await leaveBalance.save();
    
    logger.info(`Leave request created for employee ${employeeId}`);
    return leaveRequest;
  } catch (error) {
    logger.error('Error requesting leave:', error);
    throw error;
  }
};

/**
 * Approve or reject leave request
 * @param {Object} data - Approval data
 * @param {string} userId - User ID approving the request
 * @returns {Promise<Object>} Updated leave request
 */
const approveOrRejectLeave = async (data, userId) => {
  try {
    const { leaveId, status, notes, approverRole, approverName } = data;
    
    // Validate status
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      throw new Error('Invalid status. Must be APPROVED or REJECTED');
    }
    
    // Find leave request
    const leaveRequest = await Leave.findById(leaveId);
    if (!leaveRequest) {
      throw new Error('Leave request not found');
    }
    
    // Check if request is pending
    if (leaveRequest.status !== 'PENDING') {
      throw new Error(`Leave request already ${leaveRequest.status.toLowerCase()}`);
    }
    
    // Update leave request status
    leaveRequest.status = status;
    leaveRequest.approvalHistory.push({
      status,
      approverRole,
      approverId: mongoose.Types.ObjectId(userId),
      approverName,
      notes,
      timestamp: new Date()
    });
    
    leaveRequest.updatedBy = mongoose.Types.ObjectId(userId);
    
    // Update leave balance
    const currentYear = new Date().getFullYear();
    const leaveBalance = await LeaveBalance.findOne({
      employeeId: leaveRequest.employeeId,
      year: currentYear
    });
    
    if (!leaveBalance) {
      throw new Error('Leave balance not found for the current year');
    }
    
    // Find the balance for the leave type
    const typeBalance = leaveBalance.balances.find(b => b.type === leaveRequest.type);
    if (!typeBalance) {
      throw new Error(`No balance found for leave type: ${leaveRequest.type}`);
    }
    
    // Update balance based on approval status
    typeBalance.pending -= leaveRequest.duration;
    
    if (status === 'APPROVED') {
      typeBalance.used += leaveRequest.duration;
    }
    
    await Promise.all([
      leaveRequest.save(),
      leaveBalance.save()
    ]);
    
    logger.info(`Leave request ${status.toLowerCase()} for ID ${leaveId}`);
    return leaveRequest;
  } catch (error) {
    logger.error('Error approving/rejecting leave:', error);
    throw error;
  }
};

/**
 * Cancel leave request
 * @param {Object} data - Cancellation data
 * @param {string} userId - User ID cancelling the request
 * @returns {Promise<Object>} Updated leave request
 */
const cancelLeave = async (data, userId) => {
  try {
    const { leaveId, reason } = data;
    
    // Find leave request
    const leaveRequest = await Leave.findById(leaveId);
    if (!leaveRequest) {
      throw new Error('Leave request not found');
    }
    
    // Check if request can be cancelled
    if (leaveRequest.status === 'CANCELLED') {
      throw new Error('Leave request already cancelled');
    }
    
    if (leaveRequest.status === 'REJECTED') {
      throw new Error('Cannot cancel rejected leave request');
    }
    
    // Check if leave has already started
    const today = moment().startOf('day');
    const leaveStart = moment(leaveRequest.startDate).startOf('day');
    
    if (today.isAfter(leaveStart) && leaveRequest.status === 'APPROVED') {
      throw new Error('Cannot cancel leave that has already started');
    }
    
    // Get employee for approval history
    const employee = await Employee.findById(leaveRequest.employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Update leave request status
    const previousStatus = leaveRequest.status;
    leaveRequest.status = 'CANCELLED';
    leaveRequest.approvalHistory.push({
      status: 'CANCELLED',
      approverRole: 'EMPLOYEE',
      approverId: mongoose.Types.ObjectId(userId),
      approverName: `${employee.firstName} ${employee.lastName}`,
      notes: reason || 'Leave request cancelled',
      timestamp: new Date()
    });
    
    leaveRequest.updatedBy = mongoose.Types.ObjectId(userId);
    
    // Update leave balance
    const currentYear = new Date().getFullYear();
    const leaveBalance = await LeaveBalance.findOne({
      employeeId: leaveRequest.employeeId,
      year: currentYear
    });
    
    if (!leaveBalance) {
      throw new Error('Leave balance not found for the current year');
    }
    
    // Find the balance for the leave type
    const typeBalance = leaveBalance.balances.find(b => b.type === leaveRequest.type);
    if (!typeBalance) {
      throw new Error(`No balance found for leave type: ${leaveRequest.type}`);
    }
    
    // Update balance based on previous status
    if (previousStatus === 'PENDING') {
      typeBalance.pending -= leaveRequest.duration;
    } else if (previousStatus === 'APPROVED') {
      typeBalance.used -= leaveRequest.duration;
    }
    
    await Promise.all([
      leaveRequest.save(),
      leaveBalance.save()
    ]);
    
    logger.info(`Leave request cancelled for ID ${leaveId}`);
    return leaveRequest;
  } catch (error) {
    logger.error('Error cancelling leave:', error);
    throw error;
  }
};

/**
 * Get leave requests for an employee
 * @param {string} employeeId - Employee ID
 * @param {Object} filters - Filtering options
 * @returns {Promise<Array>} Leave requests
 */
const getEmployeeLeaves = async (employeeId, filters) => {
  try {
    const { startDate, endDate, status, type } = filters;
    
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Build query
    const query = { employeeId };
    
    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    } else if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.endDate = { $lte: new Date(endDate) };
    }
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    // Get leave requests
    const leaveRequests = await Leave.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return leaveRequests;
  } catch (error) {
    logger.error('Error getting employee leaves:', error);
    throw error;
  }
};

/**
 * Get leave balance for an employee
 * @param {string} employeeId - Employee ID
 * @param {number} year - Year for balance
 * @returns {Promise<Object>} Leave balance
 */
const getLeaveBalance = async (employeeId, year) => {
  try {
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Default to current year if not specified
    const balanceYear = year || new Date().getFullYear();
    
    // Get leave balance
    const leaveBalance = await LeaveBalance.findOne({
      employeeId,
      year: balanceYear
    });
    
    if (!leaveBalance) {
      throw new Error(`Leave balance not found for year ${balanceYear}`);
    }
    
    // Calculate available balance for each type
    const balanceWithAvailable = {
      ...leaveBalance.toObject(),
      balances: leaveBalance.balances.map(balance => {
        const available = balance.allocated + balance.additional + balance.carriedOver - balance.used - balance.pending;
        return {
          ...balance,
          available
        };
      })
    };
    
    return balanceWithAvailable;
  } catch (error) {
    logger.error('Error getting leave balance:', error);
    throw error;
  }
};

/**
 * Initialize leave balance for an employee
 * @param {Object} data - Leave balance data
 * @param {string} userId - User ID initializing the balance
 * @returns {Promise<Object>} Created leave balance
 */
const initializeLeaveBalance = async (data, userId) => {
  try {
    const { 
      employeeId, 
      year, 
      balances, 
      accrualSettings 
    } = data;
    
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Check if balance already exists
    const existingBalance = await LeaveBalance.findOne({
      employeeId,
      year
    });
    
    if (existingBalance) {
      throw new Error(`Leave balance already exists for employee ${employeeId} for year ${year}`);
    }
    
    // Create leave balance
    const leaveBalance = await LeaveBalance.create({
      employeeId,
      year,
      balances: balances.map(balance => ({
        type: balance.type,
        allocated: balance.allocated || 0,
        additional: balance.additional || 0,
        used: balance.used || 0,
        pending: balance.pending || 0,
        carriedOver: balance.carriedOver || 0,
        carryOverExpiry: balance.carryOverExpiry,
        maxCarryOver: balance.maxCarryOver || 0,
        adjustments: balance.adjustments || []
      })),
      accrualSettings: accrualSettings || {
        isMonthlyAccrual: false,
        monthlyAccrualAmount: 0,
        maxAccrualLimit: 0,
        accrualStartDate: employee.joinDate,
        isProratedFirstYear: true
      },
      accrualHistory: [],
      lastCalculationDate: new Date(),
      createdBy: mongoose.Types.ObjectId(userId),
      updatedBy: mongoose.Types.ObjectId(userId)
    });
    
    logger.info(`Leave balance initialized for employee ${employeeId} for year ${year}`);
    return leaveBalance;
  } catch (error) {
    logger.error('Error initializing leave balance:', error);
    throw error;
  }
};

/**
 * Adjust leave balance
 * @param {Object} data - Adjustment data
 * @param {string} userId - User ID making the adjustment
 * @returns {Promise<Object>} Updated leave balance
 */
const adjustLeaveBalance = async (data, userId) => {
  try {
    const { 
      employeeId, 
      year, 
      type, 
      amount, 
      reason 
    } = data;
    
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Get leave balance
    const leaveBalance = await LeaveBalance.findOne({
      employeeId,
      year
    });
    
    if (!leaveBalance) {
      throw new Error(`Leave balance not found for year ${year}`);
    }
    
    // Find the balance for the leave type
    const typeBalance = leaveBalance.balances.find(b => b.type === type);
    if (!typeBalance) {
      throw new Error(`No balance found for leave type: ${type}`);
    }
    
    // Add adjustment
    typeBalance.adjustments.push({
      amount,
      reason,
      date: new Date(),
      approvedBy: mongoose.Types.ObjectId(userId)
    });
    
    // Update additional balance
    typeBalance.additional += amount;
    
    // Add to accrual history
    leaveBalance.accrualHistory.push({
      date: new Date(),
      leaveType: type,
      amount,
      reason: 'ADJUSTMENT',
      notes: reason
    });
    
    leaveBalance.updatedBy = mongoose.Types.ObjectId(userId);
    
    await leaveBalance.save();
    
    logger.info(`Leave balance adjusted for employee ${employeeId} for year ${year}`);
    return leaveBalance;
  } catch (error) {
    logger.error('Error adjusting leave balance:', error);
    throw error;
  }
};

/**
 * Calculate leave accruals
 * @param {Object} data - Calculation data
 * @param {string} userId - User ID running the calculation
 * @returns {Promise<Array>} Updated leave balances
 */
const calculateLeaveAccruals = async (data, userId) => {
  try {
    const { employeeIds, calculateDate } = data;
    
    // Default to current date if not specified
    const calculationDate = calculateDate ? new Date(calculateDate) : new Date();
    const currentYear = calculationDate.getFullYear();
    
    // Build query for leave balances
    const query = {
      year: currentYear,
      'accrualSettings.isMonthlyAccrual': true
    };
    
    if (employeeIds && employeeIds.length > 0) {
      query.employeeId = { $in: employeeIds };
    }
    
    // Get leave balances with monthly accrual enabled
    const leaveBalances = await LeaveBalance.find(query).populate('employeeId');
    
    if (leaveBalances.length === 0) {
      logger.info('No leave balances found for accrual calculation');
      return [];
    }
    
    // Process each leave balance
    const updatedBalances = [];
    
    for (const balance of leaveBalances) {
      // Skip if employee not found
      if (!balance.employeeId) {
        logger.warn(`Employee not found for leave balance ID ${balance._id}`);
        continue;
      }
      
      // Skip if last calculation was in the current month
      const lastCalculation = moment(balance.lastCalculationDate);
      const currentMonth = moment(calculationDate).format('YYYY-MM');
      
      if (lastCalculation.format('YYYY-MM') === currentMonth) {
        logger.info(`Accrual already calculated for employee ${balance.employeeId._id} for month ${currentMonth}`);
        continue;
      }
      
      // Calculate accrual for each leave type with monthly accrual
      for (const typeBalance of balance.balances) {
        // Skip if not annual leave (typically only annual leave accrues monthly)
        if (typeBalance.type !== 'ANNUAL') {
          continue;
        }
        
        // Calculate accrual amount
        let accrualAmount = balance.accrualSettings.monthlyAccrualAmount;
        
        // Check if first year and prorated
        if (balance.accrualSettings.isProratedFirstYear) {
          const joinDate = moment(balance.employeeId.joinDate);
          const currentYear = moment(calculationDate).year();
          
          if (joinDate.year() === currentYear) {
            // Prorate based on join date
            const monthsWorked = moment(calculationDate).diff(joinDate, 'months') + 1;
            const totalMonths = 12 - joinDate.month();
            
            accrualAmount = (balance.accrualSettings.monthlyAccrualAmount * totalMonths) / 12;
          }
        }
        
        // Check if exceeding max accrual limit
        const currentTotal = typeBalance.allocated + typeBalance.additional + typeBalance.carriedOver;
        
        if (balance.accrualSettings.maxAccrualLimit > 0 && 
            currentTotal + accrualAmount > balance.accrualSettings.maxAccrualLimit) {
          accrualAmount = Math.max(0, balance.accrualSettings.maxAccrualLimit - currentTotal);
        }
        
        if (accrualAmount <= 0) {
          continue;
        }
        
        // Add accrual to balance
        typeBalance.additional += accrualAmount;
        
        // Add to accrual history
        balance.accrualHistory.push({
          date: calculationDate,
          leaveType: typeBalance.type,
          amount: accrualAmount,
          reason: 'MONTHLY_ACCRUAL',
          notes: `Monthly accrual for ${moment(calculationDate).format('MMMM YYYY')}`
        });
      }
      
      // Update last calculation date
      balance.lastCalculationDate = calculationDate;
      balance.updatedBy = mongoose.Types.ObjectId(userId);
      
      await balance.save();
      updatedBalances.push(balance);
    }
    
    logger.info(`Leave accruals calculated for ${updatedBalances.length} employees`);
    return updatedBalances;
  } catch (error) {
    logger.error('Error calculating leave accruals:', error);
    throw error;
  }
};

/**
 * Process year-end leave carryover
 * @param {Object} data - Carryover data
 * @param {string} userId - User ID processing the carryover
 * @returns {Promise<Array>} Created leave balances for new year
 */
const processLeaveCarryover = async (data, userId) => {
  try {
    const { fromYear, toYear, employeeIds } = data;
    
    if (!fromYear || !toYear) {
      throw new Error('From year and to year are required');
    }
    
    if (toYear <= fromYear) {
      throw new Error('To year must be greater than from year');
    }
    
    // Build query for leave balances
    const query = { year: fromYear };
    
    if (employeeIds && employeeIds.length > 0) {
      query.employeeId = { $in: employeeIds };
    }
    
    // Get leave balances for the from year
    const fromBalances = await LeaveBalance.find(query).populate('employeeId');
    
    if (fromBalances.length === 0) {
      logger.info(`No leave balances found for year ${fromYear}`);
      return [];
    }
    
    // Process each employee's balance
    const newBalances = [];
    
    for (const fromBalance of fromBalances) {
      // Skip if employee not found
      if (!fromBalance.employeeId) {
        logger.warn(`Employee not found for leave balance ID ${fromBalance._id}`);
        continue;
      }
      
      // Check if balance already exists for the to year
      const existingToBalance = await LeaveBalance.findOne({
        employeeId: fromBalance.employeeId._id,
        year: toYear
      });
      
      if (existingToBalance) {
        logger.info(`Leave balance already exists for employee ${fromBalance.employeeId._id} for year ${toYear}`);
        continue;
      }
      
      // Calculate carryover for each leave type
      const newBalanceTypes = [];
      
      for (const fromType of fromBalance.balances) {
        // Calculate available balance
        const available = fromType.allocated + fromType.additional + fromType.carriedOver - fromType.used - fromType.pending;
        
        // Calculate carryover amount (subject to max carryover limit)
        let carryoverAmount = Math.min(available, fromType.maxCarryOver || 0);
        
        // Set expiry date for carried over days (typically 3-6 months into new year)
        const carryOverExpiry = moment().year(toYear).month(5).endOf('month').toDate(); // June 30th of new year
        
        newBalanceTypes.push({
          type: fromType.type,
          allocated: fromType.type === 'ANNUAL' ? 12 : 0, // Default annual allocation
          additional: 0,
          used: 0,
          pending: 0,
          carriedOver: carryoverAmount,
          carryOverExpiry,
          maxCarryOver: fromType.maxCarryOver || 0,
          adjustments: []
        });
      }
      
      // Create new balance for the to year
      const newBalance = await LeaveBalance.create({
        employeeId: fromBalance.employeeId._id,
        year: toYear,
        balances: newBalanceTypes,
        accrualSettings: fromBalance.accrualSettings,
        accrualHistory: [
          {
            date: new Date(),
            leaveType: 'ANNUAL',
            amount: 12, // Default annual allocation
            reason: 'ANNUAL_ALLOCATION',
            notes: `Annual allocation for year ${toYear}`
          }
        ],
        lastCalculationDate: new Date(),
        createdBy: mongoose.Types.ObjectId(userId),
        updatedBy: mongoose.Types.ObjectId(userId)
      });
      
      newBalances.push(newBalance);
      
      // Add carryover records to accrual history
      for (const newType of newBalance.balances) {
        if (newType.carriedOver > 0) {
          newBalance.accrualHistory.push({
            date: new Date(),
            leaveType: newType.type,
            amount: newType.carriedOver,
            reason: 'CARRYOVER',
            notes: `Carried over from year ${fromYear}`
          });
        }
      }
      
      await newBalance.save();
    }
    
    logger.info(`Leave carryover processed for ${newBalances.length} employees from year ${fromYear} to ${toYear}`);
    return newBalances;
  } catch (error) {
    logger.error('Error processing leave carryover:', error);
    throw error;
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
