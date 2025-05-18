/**
 * Attendance Use Cases
 * Business logic for attendance management
 */

const { Attendance, Employee, WorkSchedule, EmployeeSchedule, Holiday } = require('../../domain/models');
const { logger } = require('../../utils');
const mongoose = require('mongoose');
const moment = require('moment');

/**
 * Record employee check-in
 * @param {Object} data - Check-in data
 * @param {string} userId - User ID recording the check-in
 * @returns {Promise<Object>} Created attendance record
 */
const recordCheckIn = async (data, userId) => {
  try {
    const { employeeId, location, device, ipAddress, notes } = data;
    
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Check if attendance record already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (existingAttendance && existingAttendance.checkIn && existingAttendance.checkIn.time) {
      throw new Error('Employee has already checked in today');
    }
    
    // Get employee's schedule
    const employeeSchedule = await EmployeeSchedule.findOne({
      employeeId,
      effectiveStartDate: { $lte: new Date() },
      $or: [
        { effectiveEndDate: null },
        { effectiveEndDate: { $gte: new Date() } }
      ],
      status: 'ACTIVE'
    }).populate('scheduleId');
    
    if (!employeeSchedule || !employeeSchedule.scheduleId) {
      throw new Error('No active schedule found for employee');
    }
    
    const workSchedule = employeeSchedule.scheduleId;
    
    // Check if geofencing is enabled and validate location
    let isOutsideGeofence = false;
    if (workSchedule.geofencing && workSchedule.geofencing.enabled) {
      isOutsideGeofence = true;
      
      // Check if location is within any of the allowed geofences
      for (const fence of workSchedule.geofencing.locations) {
        // Calculate distance between check-in location and geofence center
        const checkInPoint = {
          type: 'Point',
          coordinates: location.coordinates
        };
        
        // Use MongoDB's $geoNear to calculate distance
        const geoResult = await Attendance.collection.aggregate([
          {
            $geoNear: {
              near: checkInPoint,
              distanceField: 'distance',
              maxDistance: fence.radius,
              spherical: true,
              query: {
                'geofencing.locations.coordinates': fence.coordinates
              }
            }
          },
          { $limit: 1 }
        ]).toArray();
        
        if (geoResult.length > 0) {
          isOutsideGeofence = false;
          break;
        }
      }
    }
    
    // Determine if check-in is late
    const now = new Date();
    const currentTime = moment(now);
    let isLate = false;
    
    if (workSchedule.type === 'REGULAR') {
      const scheduleStartTime = moment(workSchedule.workingHours.regular.startTime, 'HH:mm');
      const lateThreshold = scheduleStartTime.clone().add(workSchedule.workingHours.regular.lateGracePeriod, 'minutes');
      
      isLate = currentTime.isAfter(lateThreshold);
    } else if (workSchedule.type === 'SHIFT') {
      // For shift workers, check the assigned shift for today
      const todayShift = employeeSchedule.shiftAssignments.find(
        assignment => moment(assignment.date).isSame(moment(now), 'day')
      );
      
      if (todayShift) {
        const shift = workSchedule.workingHours.shifts.find(s => s.code === todayShift.shiftCode);
        if (shift) {
          const shiftStartTime = moment(shift.startTime, 'HH:mm');
          const lateThreshold = shiftStartTime.clone().add(shift.lateGracePeriod, 'minutes');
          
          isLate = currentTime.isAfter(lateThreshold);
        }
      }
    }
    
    // Create or update attendance record
    let attendance;
    if (existingAttendance) {
      // Update existing record
      existingAttendance.checkIn = {
        time: now,
        location: {
          type: 'Point',
          coordinates: location.coordinates
        },
        device,
        ipAddress,
        notes,
        verified: false
      };
      
      existingAttendance.anomalies.isLate = isLate;
      existingAttendance.anomalies.isOutsideGeofence = isOutsideGeofence;
      existingAttendance.updatedBy = mongoose.Types.ObjectId(userId);
      
      attendance = await existingAttendance.save();
    } else {
      // Create new attendance record
      attendance = await Attendance.create({
        employeeId,
        date: today,
        checkIn: {
          time: now,
          location: {
            type: 'Point',
            coordinates: location.coordinates
          },
          device,
          ipAddress,
          notes,
          verified: false
        },
        status: 'PRESENT',
        anomalies: {
          isLate,
          isOutsideGeofence,
          isIncomplete: true
        },
        createdBy: mongoose.Types.ObjectId(userId),
        updatedBy: mongoose.Types.ObjectId(userId)
      });
    }
    
    logger.info(`Employee ${employeeId} checked in at ${now}`);
    return attendance;
  } catch (error) {
    logger.error('Error recording check-in:', error);
    throw error;
  }
};

/**
 * Record employee check-out
 * @param {Object} data - Check-out data
 * @param {string} userId - User ID recording the check-out
 * @returns {Promise<Object>} Updated attendance record
 */
const recordCheckOut = async (data, userId) => {
  try {
    const { employeeId, location, device, ipAddress, notes } = data;
    
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Find today's attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (!attendance) {
      throw new Error('No check-in record found for today');
    }
    
    if (!attendance.checkIn || !attendance.checkIn.time) {
      throw new Error('Employee has not checked in today');
    }
    
    if (attendance.checkOut && attendance.checkOut.time) {
      throw new Error('Employee has already checked out today');
    }
    
    // Get employee's schedule
    const employeeSchedule = await EmployeeSchedule.findOne({
      employeeId,
      effectiveStartDate: { $lte: new Date() },
      $or: [
        { effectiveEndDate: null },
        { effectiveEndDate: { $gte: new Date() } }
      ],
      status: 'ACTIVE'
    }).populate('scheduleId');
    
    if (!employeeSchedule || !employeeSchedule.scheduleId) {
      throw new Error('No active schedule found for employee');
    }
    
    const workSchedule = employeeSchedule.scheduleId;
    
    // Check if geofencing is enabled and validate location
    let isOutsideGeofence = false;
    if (workSchedule.geofencing && workSchedule.geofencing.enabled) {
      isOutsideGeofence = true;
      
      // Check if location is within any of the allowed geofences
      for (const fence of workSchedule.geofencing.locations) {
        // Calculate distance between check-out location and geofence center
        const checkOutPoint = {
          type: 'Point',
          coordinates: location.coordinates
        };
        
        // Use MongoDB's $geoNear to calculate distance
        const geoResult = await Attendance.collection.aggregate([
          {
            $geoNear: {
              near: checkOutPoint,
              distanceField: 'distance',
              maxDistance: fence.radius,
              spherical: true,
              query: {
                'geofencing.locations.coordinates': fence.coordinates
              }
            }
          },
          { $limit: 1 }
        ]).toArray();
        
        if (geoResult.length > 0) {
          isOutsideGeofence = false;
          break;
        }
      }
    }
    
    // Determine if check-out is early
    const now = new Date();
    const currentTime = moment(now);
    let isEarlyDeparture = false;
    
    if (workSchedule.type === 'REGULAR') {
      const scheduleEndTime = moment(workSchedule.workingHours.regular.endTime, 'HH:mm');
      isEarlyDeparture = currentTime.isBefore(scheduleEndTime);
    } else if (workSchedule.type === 'SHIFT') {
      // For shift workers, check the assigned shift for today
      const todayShift = employeeSchedule.shiftAssignments.find(
        assignment => moment(assignment.date).isSame(moment(now), 'day')
      );
      
      if (todayShift) {
        const shift = workSchedule.workingHours.shifts.find(s => s.code === todayShift.shiftCode);
        if (shift) {
          const shiftEndTime = moment(shift.endTime, 'HH:mm');
          isEarlyDeparture = currentTime.isBefore(shiftEndTime);
        }
      }
    }
    
    // Calculate work duration
    const checkInTime = moment(attendance.checkIn.time);
    const workDuration = currentTime.diff(checkInTime, 'minutes');
    
    // Calculate overtime
    let overtimeDuration = 0;
    if (workSchedule.type === 'REGULAR') {
      const scheduleEndTime = moment(workSchedule.workingHours.regular.endTime, 'HH:mm');
      if (currentTime.isAfter(scheduleEndTime)) {
        overtimeDuration = currentTime.diff(scheduleEndTime, 'minutes');
      }
    } else if (workSchedule.type === 'SHIFT') {
      // For shift workers, check the assigned shift for today
      const todayShift = employeeSchedule.shiftAssignments.find(
        assignment => moment(assignment.date).isSame(moment(now), 'day')
      );
      
      if (todayShift) {
        const shift = workSchedule.workingHours.shifts.find(s => s.code === todayShift.shiftCode);
        if (shift) {
          const shiftEndTime = moment(shift.endTime, 'HH:mm');
          if (currentTime.isAfter(shiftEndTime)) {
            overtimeDuration = currentTime.diff(shiftEndTime, 'minutes');
          }
        }
      }
    }
    
    // Apply minimum overtime duration threshold
    if (overtimeDuration < workSchedule.overtimeSettings.minimumDuration) {
      overtimeDuration = 0;
    }
    
    // Update attendance record
    attendance.checkOut = {
      time: now,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      device,
      ipAddress,
      notes,
      verified: false
    };
    
    attendance.workDuration = workDuration;
    attendance.overtimeDuration = overtimeDuration;
    attendance.anomalies.isEarlyDeparture = isEarlyDeparture;
    attendance.anomalies.isOutsideGeofence = attendance.anomalies.isOutsideGeofence || isOutsideGeofence;
    attendance.anomalies.isIncomplete = false;
    attendance.updatedBy = mongoose.Types.ObjectId(userId);
    
    await attendance.save();
    
    logger.info(`Employee ${employeeId} checked out at ${now}`);
    return attendance;
  } catch (error) {
    logger.error('Error recording check-out:', error);
    throw error;
  }
};

/**
 * Get attendance records for an employee
 * @param {string} employeeId - Employee ID
 * @param {Object} filters - Filtering options
 * @returns {Promise<Array>} Attendance records
 */
const getEmployeeAttendance = async (employeeId, filters) => {
  try {
    const { startDate, endDate, status } = filters;
    
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Build query
    const query = { employeeId };
    
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
    
    if (status) {
      query.status = status;
    }
    
    // Get attendance records
    const attendanceRecords = await Attendance.find(query)
      .sort({ date: -1 })
      .lean();
    
    return attendanceRecords;
  } catch (error) {
    logger.error('Error getting employee attendance:', error);
    throw error;
  }
};

/**
 * Get attendance summary for an employee
 * @param {string} employeeId - Employee ID
 * @param {Object} filters - Filtering options
 * @returns {Promise<Object>} Attendance summary
 */
const getAttendanceSummary = async (employeeId, filters) => {
  try {
    const { startDate, endDate } = filters;
    
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Build query
    const query = { employeeId };
    
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
    
    // Get attendance records
    const attendanceRecords = await Attendance.find(query).lean();
    
    // Calculate summary
    const summary = {
      totalDays: attendanceRecords.length,
      present: 0,
      absent: 0,
      late: 0,
      earlyDeparture: 0,
      onLeave: 0,
      holiday: 0,
      weekend: 0,
      totalWorkDuration: 0,
      totalOvertimeDuration: 0
    };
    
    attendanceRecords.forEach(record => {
      // Count by status
      summary[record.status.toLowerCase()]++;
      
      // Count anomalies
      if (record.anomalies.isLate) summary.late++;
      if (record.anomalies.isEarlyDeparture) summary.earlyDeparture++;
      
      // Sum durations
      summary.totalWorkDuration += record.workDuration || 0;
      summary.totalOvertimeDuration += record.overtimeDuration || 0;
    });
    
    // Convert minutes to hours for better readability
    summary.totalWorkDurationHours = (summary.totalWorkDuration / 60).toFixed(2);
    summary.totalOvertimeDurationHours = (summary.totalOvertimeDuration / 60).toFixed(2);
    
    return summary;
  } catch (error) {
    logger.error('Error getting attendance summary:', error);
    throw error;
  }
};

/**
 * Request attendance correction
 * @param {Object} data - Correction request data
 * @param {string} userId - User ID requesting the correction
 * @returns {Promise<Object>} Updated attendance record
 */
const requestAttendanceCorrection = async (data, userId) => {
  try {
    const { attendanceId, reason } = data;
    
    // Find attendance record
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    
    // Check if correction already requested
    if (attendance.correctionRequest && attendance.correctionRequest.requested) {
      throw new Error('Correction already requested for this attendance record');
    }
    
    // Update attendance record with correction request
    attendance.correctionRequest = {
      requested: true,
      requestedBy: mongoose.Types.ObjectId(userId),
      requestedAt: new Date(),
      reason,
      status: 'PENDING'
    };
    
    attendance.updatedBy = mongoose.Types.ObjectId(userId);
    
    await attendance.save();
    
    logger.info(`Attendance correction requested for record ${attendanceId}`);
    return attendance;
  } catch (error) {
    logger.error('Error requesting attendance correction:', error);
    throw error;
  }
};

/**
 * Review attendance correction request
 * @param {Object} data - Review data
 * @param {string} userId - User ID reviewing the request
 * @returns {Promise<Object>} Updated attendance record
 */
const reviewAttendanceCorrection = async (data, userId) => {
  try {
    const { attendanceId, status, reviewNotes, correctedData } = data;
    
    // Find attendance record
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    
    // Check if correction request exists
    if (!attendance.correctionRequest || !attendance.correctionRequest.requested) {
      throw new Error('No correction request found for this attendance record');
    }
    
    // Check if request already reviewed
    if (attendance.correctionRequest.status !== 'PENDING') {
      throw new Error('Correction request already reviewed');
    }
    
    // Update correction request
    attendance.correctionRequest.status = status;
    attendance.correctionRequest.reviewedBy = mongoose.Types.ObjectId(userId);
    attendance.correctionRequest.reviewedAt = new Date();
    attendance.correctionRequest.reviewNotes = reviewNotes;
    
    // If approved, update attendance data
    if (status === 'APPROVED' && correctedData) {
      // Update check-in data if provided
      if (correctedData.checkIn) {
        attendance.checkIn = {
          ...attendance.checkIn,
          ...correctedData.checkIn,
          verified: true,
          verifiedBy: mongoose.Types.ObjectId(userId)
        };
      }
      
      // Update check-out data if provided
      if (correctedData.checkOut) {
        attendance.checkOut = {
          ...attendance.checkOut,
          ...correctedData.checkOut,
          verified: true,
          verifiedBy: mongoose.Types.ObjectId(userId)
        };
      }
      
      // Recalculate work duration if both check-in and check-out are present
      if (attendance.checkIn && attendance.checkIn.time && attendance.checkOut && attendance.checkOut.time) {
        const checkInTime = moment(attendance.checkIn.time);
        const checkOutTime = moment(attendance.checkOut.time);
        attendance.workDuration = checkOutTime.diff(checkInTime, 'minutes');
        attendance.anomalies.isIncomplete = false;
      }
      
      // Update status if provided
      if (correctedData.status) {
        attendance.status = correctedData.status;
      }
      
      // Update anomalies if provided
      if (correctedData.anomalies) {
        attendance.anomalies = {
          ...attendance.anomalies,
          ...correctedData.anomalies
        };
      }
    }
    
    attendance.updatedBy = mongoose.Types.ObjectId(userId);
    
    await attendance.save();
    
    logger.info(`Attendance correction ${status.toLowerCase()} for record ${attendanceId}`);
    return attendance;
  } catch (error) {
    logger.error('Error reviewing attendance correction:', error);
    throw error;
  }
};

/**
 * Get attendance anomalies
 * @param {Object} filters - Filtering options
 * @returns {Promise<Array>} Attendance anomalies
 */
const getAttendanceAnomalies = async (filters) => {
  try {
    const { startDate, endDate, branchId, divisionId, anomalyType } = filters;
    
    // Build query
    const query = {
      $or: [
        { 'anomalies.isLate': true },
        { 'anomalies.isEarlyDeparture': true },
        { 'anomalies.isIncomplete': true },
        { 'anomalies.isOutsideGeofence': true }
      ]
    };
    
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
    
    // Filter by specific anomaly type if provided
    if (anomalyType) {
      query.$or = undefined;
      query[`anomalies.${anomalyType}`] = true;
    }
    
    // Get attendance records with anomalies
    const anomalies = await Attendance.find(query)
      .populate({
        path: 'employeeId',
        select: 'employeeId firstName lastName fullName currentBranch currentDivision',
        populate: [
          { path: 'currentBranch', select: 'name code' },
          { path: 'currentDivision', select: 'name code' }
        ]
      })
      .sort({ date: -1 })
      .lean();
    
    // Filter by branch and division if provided
    let filteredAnomalies = anomalies;
    
    if (branchId) {
      filteredAnomalies = filteredAnomalies.filter(
        a => a.employeeId.currentBranch && a.employeeId.currentBranch._id.toString() === branchId
      );
    }
    
    if (divisionId) {
      filteredAnomalies = filteredAnomalies.filter(
        a => a.employeeId.currentDivision && a.employeeId.currentDivision._id.toString() === divisionId
      );
    }
    
    return filteredAnomalies;
  } catch (error) {
    logger.error('Error getting attendance anomalies:', error);
    throw error;
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
