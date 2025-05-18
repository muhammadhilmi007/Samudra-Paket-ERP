/**
 * Attendance Seeder
 * Seeds attendance, leave, work schedule, and holiday data for development and testing
 */

const mongoose = require('mongoose');
const moment = require('moment');
const { 
  Attendance, 
  Leave, 
  LeaveBalance, 
  WorkSchedule, 
  EmployeeSchedule, 
  Holiday,
  Employee 
} = require('../../domain/models');
const { logger } = require('../../utils');

/**
 * Seed work schedules
 * @param {string} userId - User ID for created/updated by fields
 * @returns {Promise<Array>} Array of created work schedules
 */
const seedWorkSchedules = async (userId) => {
  try {
    logger.info('Seeding work schedules...');
    
    // Delete existing work schedules
    await WorkSchedule.deleteMany({});
    
    // Create work schedules
    const workSchedules = [
      {
        name: 'Regular Office Hours',
        code: 'REG-01',
        description: 'Standard 8-hour work schedule from Monday to Friday',
        type: 'REGULAR',
        status: 'ACTIVE',
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        workingHours: {
          regular: {
            startTime: '08:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
            lateGracePeriod: 15,
            totalHours: 8
          }
        },
        overtimeSettings: {
          isEnabled: true,
          maxHoursPerDay: 3,
          maxHoursPerWeek: 15
        },
        effectiveStartDate: new Date('2025-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Shift Work Schedule',
        code: 'SHIFT-01',
        description: 'Rotating shift schedule for warehouse operations',
        type: 'SHIFT',
        status: 'ACTIVE',
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        },
        workingHours: {
          shifts: [
            {
              code: 'MORNING',
              name: 'Morning Shift',
              startTime: '06:00',
              endTime: '14:00'
            },
            {
              code: 'AFTERNOON',
              name: 'Afternoon Shift',
              startTime: '14:00',
              endTime: '22:00'
            },
            {
              code: 'NIGHT',
              name: 'Night Shift',
              startTime: '22:00',
              endTime: '06:00'
            }
          ]
        },
        overtimeSettings: {
          isEnabled: true,
          maxHoursPerDay: 4,
          maxHoursPerWeek: 20
        },
        effectiveStartDate: new Date('2025-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Flexible Hours',
        code: 'FLEX-01',
        description: 'Flexible working hours with core hours',
        type: 'FLEXIBLE',
        status: 'ACTIVE',
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        workingHours: {
          regular: {
            startTime: '09:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
            lateGracePeriod: 15,
            totalHours: 8
          }
        },
        flexibleSettings: {
          coreStartTime: '10:00',
          coreEndTime: '15:00',
          flexibleStartTime: '07:00',
          flexibleEndTime: '19:00'
        },
        effectiveStartDate: new Date('2025-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Add createdBy and updatedBy fields to each work schedule
    const workSchedulesWithUser = workSchedules.map(schedule => ({
      ...schedule,
      createdBy: mongoose.Types.ObjectId(userId),
      updatedBy: mongoose.Types.ObjectId(userId)
    }));
    
    const createdSchedules = await WorkSchedule.insertMany(workSchedulesWithUser);
    logger.info(`${createdSchedules.length} work schedules seeded successfully`);
    return createdSchedules;
  } catch (error) {
    logger.error('Error seeding work schedules:', error);
    throw error;
  }
};

/**
 * Seed holidays
 * @param {string} userId - User ID for created/updated by fields
 * @returns {Promise<Array>} Array of created holidays
 */
const seedHolidays = async (userId) => {
  try {
    logger.info('Seeding holidays...');
    
    // Delete existing holidays
    await Holiday.deleteMany({});
    
    // Create holidays for 2025
    const holidays = [
      {
        name: 'New Year\'s Day',
        date: new Date('2025-01-01'),
        type: 'NATIONAL',
        description: 'New Year\'s Day celebration',
        isRecurring: true,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Independence Day',
        date: new Date('2025-08-17'),
        type: 'NATIONAL',
        description: 'Indonesian Independence Day',
        isRecurring: true,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Eid al-Fitr',
        date: new Date('2025-04-03'),
        type: 'RELIGIOUS',
        description: 'Eid al-Fitr celebration',
        isRecurring: false,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Eid al-Fitr Holiday',
        date: new Date('2025-04-04'),
        type: 'RELIGIOUS',
        description: 'Eid al-Fitr extended holiday',
        isRecurring: false,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Christmas Day',
        date: new Date('2025-12-25'),
        type: 'RELIGIOUS',
        description: 'Christmas Day celebration',
        isRecurring: true,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Company Anniversary',
        date: new Date('2025-06-15'),
        type: 'COMPANY',
        description: 'Company foundation anniversary',
        isRecurring: true,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Add createdBy and updatedBy fields to each holiday
    const holidaysWithUser = holidays.map(holiday => ({
      ...holiday,
      createdBy: mongoose.Types.ObjectId(userId),
      updatedBy: mongoose.Types.ObjectId(userId)
    }));
    
    const createdHolidays = await Holiday.insertMany(holidaysWithUser);
    logger.info(`${createdHolidays.length} holidays seeded successfully`);
    return createdHolidays;
  } catch (error) {
    logger.error('Error seeding holidays:', error);
    throw error;
  }
};

/**
 * Seed employee schedules
 * @param {Array} workSchedules - Array of work schedules
 * @param {string} userId - User ID for created/updated by fields
 * @returns {Promise<Array>} Array of created employee schedules
 */
const seedEmployeeSchedules = async (workSchedules, userId) => {
  try {
    logger.info('Seeding employee schedules...');
    
    // Delete existing employee schedules
    await EmployeeSchedule.deleteMany({});
    
    // Get employees
    const employees = await Employee.find({}).limit(10);
    
    if (employees.length === 0) {
      logger.warn('No employees found for schedule assignment');
      return [];
    }
    
    // Create employee schedules
    const employeeSchedules = [];
    
    // Assign regular schedule to office employees
    const officeEmployees = employees.filter(e => 
      e.position && ['HR_STAFF', 'ADMIN', 'MANAGER', 'FINANCE_STAFF'].includes(e.position.name)
    );
    
    const regularSchedule = workSchedules.find(s => s.code === 'REG-01');
    if (regularSchedule && officeEmployees.length > 0) {
      for (const employee of officeEmployees) {
        employeeSchedules.push({
          employeeId: employee._id,
          scheduleId: regularSchedule._id,
          status: 'ACTIVE',
          effectiveStartDate: new Date('2025-01-01'),
          createdBy: mongoose.Types.ObjectId(userId),
          updatedBy: mongoose.Types.ObjectId(userId),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    // Assign shift schedule to operational employees
    const operationalEmployees = employees.filter(e => 
      e.position && ['COURIER', 'DRIVER', 'WAREHOUSE_STAFF'].includes(e.position.name)
    );
    
    const shiftSchedule = workSchedules.find(s => s.code === 'SHIFT-01');
    if (shiftSchedule && operationalEmployees.length > 0) {
      for (const employee of operationalEmployees) {
        employeeSchedules.push({
          employeeId: employee._id,
          scheduleId: shiftSchedule._id,
          status: 'ACTIVE',
          effectiveStartDate: new Date('2025-01-01'),
          shiftAssignments: [
            {
              date: new Date('2025-01-01'),
              shiftCode: 'MORNING',
              notes: 'Regular assignment'
            },
            {
              date: new Date('2025-01-02'),
              shiftCode: 'AFTERNOON',
              notes: 'Regular assignment'
            },
            {
              date: new Date('2025-01-03'),
              shiftCode: 'NIGHT',
              notes: 'Regular assignment'
            }
          ],
          createdBy: mongoose.Types.ObjectId(userId),
          updatedBy: mongoose.Types.ObjectId(userId),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    // Assign flexible schedule to management employees
    const managementEmployees = employees.filter(e => 
      e.position && ['CEO', 'CTO', 'CFO', 'COO', 'BRANCH_MANAGER'].includes(e.position.name)
    );
    
    const flexibleSchedule = workSchedules.find(s => s.code === 'FLEX-01');
    if (flexibleSchedule && managementEmployees.length > 0) {
      for (const employee of managementEmployees) {
        employeeSchedules.push({
          employeeId: employee._id,
          scheduleId: flexibleSchedule._id,
          status: 'ACTIVE',
          effectiveStartDate: new Date('2025-01-01'),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (employeeSchedules.length === 0) {
      logger.warn('No employee schedules to seed');
      return [];
    }
    
    const createdSchedules = await EmployeeSchedule.insertMany(employeeSchedules);
    logger.info(`${createdSchedules.length} employee schedules seeded successfully`);
    return createdSchedules;
  } catch (error) {
    logger.error('Error seeding employee schedules:', error);
    throw error;
  }
};

/**
 * Seed leave balances
 * @param {string} userId - User ID for created/updated by fields
 * @returns {Promise<Array>} Array of created leave balances
 */
const seedLeaveBalances = async (userId) => {
  try {
    logger.info('Seeding leave balances...');
    
    // Delete existing leave balances
    await LeaveBalance.deleteMany({});
    
    // Get employees
    const employees = await Employee.find({}).limit(10);
    
    if (employees.length === 0) {
      logger.warn('No employees found for leave balance initialization');
      return [];
    }
    
    // Create leave balances
    const leaveBalances = [];
    const currentYear = new Date().getFullYear();
    
    for (const employee of employees) {
      // Calculate service years for annual leave allocation
      const joinDate = employee.joinDate || new Date('2024-01-01');
      const serviceYears = moment().diff(moment(joinDate), 'years');
      
      // Determine annual leave allocation based on service years
      let annualLeaveAllocation = 12; // Default
      if (serviceYears >= 5) {
        annualLeaveAllocation = 15;
      } else if (serviceYears >= 10) {
        annualLeaveAllocation = 18;
      }
      
      leaveBalances.push({
        employeeId: employee._id,
        year: currentYear,
        balances: [
          {
            type: 'ANNUAL',
            allocated: annualLeaveAllocation,
            used: 0,
            pending: 0,
            remaining: annualLeaveAllocation,
            additional: 0,
            carriedOver: 0
          },
          {
            type: 'SICK',
            allocated: 12,
            used: 0,
            pending: 0,
            remaining: 12,
            additional: 0,
            carriedOver: 0
          },
          {
            type: 'RELIGIOUS',
            allocated: 2,
            used: 0,
            pending: 0,
            remaining: 2,
            additional: 0,
            carriedOver: 0
          }
        ],
        accrualSettings: {
          isMonthlyAccrual: false,
          isProratedFirstYear: true
        },
        createdBy: mongoose.Types.ObjectId(userId),
        updatedBy: mongoose.Types.ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    const createdBalances = await LeaveBalance.insertMany(leaveBalances);
    logger.info(`${createdBalances.length} leave balances seeded successfully`);
    return createdBalances;
  } catch (error) {
    logger.error('Error seeding leave balances:', error);
    throw error;
  }
};

/**
 * Seed leave requests
 * @param {string} userId - User ID for created/updated by fields
 * @returns {Promise<Array>} Array of created leave requests
 */
const seedLeaveRequests = async (userId) => {
  try {
    logger.info('Seeding leave requests...');
    
    // Delete existing leave requests
    await Leave.deleteMany({});
    
    // Get employees
    const employees = await Employee.find({}).limit(10);
    
    if (employees.length === 0) {
      logger.warn('No employees found for leave requests');
      return [];
    }
    
    // Create leave requests
    const leaveRequests = [];
    const currentYear = new Date().getFullYear();
    
    // Create some approved leaves
    for (let i = 0; i < 5; i++) {
      if (employees[i]) {
        const startDate = moment().add(i + 1, 'weeks').startOf('week').toDate();
        const endDate = moment(startDate).add(2, 'days').toDate();
        
        leaveRequests.push({
          employeeId: employees[i]._id,
          type: 'ANNUAL',
          startDate,
          endDate,
          reason: 'Family vacation',
          status: 'APPROVED',
          approvals: [
            {
              approverRole: 'MANAGER',
              approverName: 'John Manager',
              status: 'APPROVED',
              notes: 'Approved as requested',
              timestamp: new Date()
            }
          ],
          createdBy: mongoose.Types.ObjectId(userId),
          updatedBy: mongoose.Types.ObjectId(userId),
          createdAt: moment().subtract(10, 'days').toDate(),
          updatedAt: moment().subtract(8, 'days').toDate()
        });
      }
    }
    
    // Create some pending leaves
    for (let i = 5; i < 8; i++) {
      if (employees[i]) {
        const startDate = moment().add(i, 'weeks').startOf('week').toDate();
        const endDate = moment(startDate).add(1, 'days').toDate();
        
        leaveRequests.push({
          employeeId: employees[i]._id,
          type: 'SICK',
          startDate,
          endDate,
          reason: 'Medical appointment',
          status: 'PENDING',
          createdBy: mongoose.Types.ObjectId(userId),
          updatedBy: mongoose.Types.ObjectId(userId),
          createdAt: moment().subtract(2, 'days').toDate(),
          updatedAt: moment().subtract(2, 'days').toDate()
        });
      }
    }
    
    // Create some rejected leaves
    for (let i = 8; i < 10; i++) {
      if (employees[i]) {
        const startDate = moment().add(i - 5, 'weeks').startOf('week').toDate();
        const endDate = moment(startDate).add(5, 'days').toDate();
        
        leaveRequests.push({
          employeeId: employees[i]._id,
          type: 'ANNUAL',
          startDate,
          endDate,
          reason: 'Personal matters',
          status: 'REJECTED',
          approvals: [
            {
              approverRole: 'MANAGER',
              approverName: 'Jane Manager',
              status: 'REJECTED',
              notes: 'Critical project deadline during this period',
              timestamp: new Date()
            }
          ],
          createdAt: moment().subtract(15, 'days').toDate(),
          updatedAt: moment().subtract(12, 'days').toDate()
        });
      }
    }
    
    const createdLeaves = await Leave.insertMany(leaveRequests);
    logger.info(`${createdLeaves.length} leave requests seeded successfully`);
    return createdLeaves;
  } catch (error) {
    logger.error('Error seeding leave requests:', error);
    throw error;
  }
};

/**
 * Seed attendance records
 * @param {string} userId - User ID for created/updated by fields
 * @returns {Promise<Array>} Array of created attendance records
 */
const seedAttendanceRecords = async (userId) => {
  try {
    logger.info('Seeding attendance records...');
    
    // Delete existing attendance records
    await Attendance.deleteMany({});
    
    // Get employees
    const employees = await Employee.find({}).limit(10);
    
    if (employees.length === 0) {
      logger.warn('No employees found for attendance records');
      return [];
    }
    
    // Create attendance records for the past 7 days
    const attendanceRecords = [];
    
    for (let day = 6; day >= 0; day--) {
      const date = moment().subtract(day, 'days').toDate();
      const dayOfWeek = moment(date).day();
      
      // Skip weekends (Saturday and Sunday)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }
      
      for (const employee of employees) {
        // Random check-in time between 7:30 AM and 8:30 AM
        const checkInHour = 7 + (Math.random() > 0.7 ? 1 : 0);
        const checkInMinute = Math.floor(Math.random() * 60);
        const checkInTime = moment(date).hour(checkInHour).minute(checkInMinute).toDate();
        
        // Random check-out time between 5:00 PM and 6:00 PM
        const checkOutHour = 17 + (Math.random() > 0.5 ? 0 : 1);
        const checkOutMinute = Math.floor(Math.random() * 60);
        const checkOutTime = moment(date).hour(checkOutHour).minute(checkOutMinute).toDate();
        
        // Calculate work hours
        const workHours = moment(checkOutTime).diff(moment(checkInTime), 'hours', true);
        
        // Determine if there are any anomalies
        const isLate = checkInHour >= 8 && checkInMinute > 15;
        const isEarlyDeparture = checkOutHour < 17;
        
        attendanceRecords.push({
          employeeId: employee._id,
          date,
          checkIn: {
            time: checkInTime,
            location: {
              type: 'Point',
              coordinates: [106.8456 + (Math.random() * 0.01), -6.2088 + (Math.random() * 0.01)]
            },
            device: 'Mobile App'
          },
          checkOut: {
            time: checkOutTime,
            location: {
              type: 'Point',
              coordinates: [106.8456 + (Math.random() * 0.01), -6.2088 + (Math.random() * 0.01)]
            },
            device: 'Mobile App'
          },
          status: 'PRESENT',
          workHours,
          anomalies: {
            isLate,
            isEarlyDeparture,
            isIncomplete: false,
            isOutsideGeofence: Math.random() > 0.9
          },
          notes: '',
          createdBy: mongoose.Types.ObjectId(userId),
          updatedBy: mongoose.Types.ObjectId(userId),
          createdAt: date,
          updatedAt: date
        });
      }
    }
    
    const createdAttendance = await Attendance.insertMany(attendanceRecords);
    logger.info(`${createdAttendance.length} attendance records seeded successfully`);
    return createdAttendance;
  } catch (error) {
    logger.error('Error seeding attendance records:', error);
    throw error;
  }
};

/**
 * Seed all attendance-related data
 * @param {string} userId - User ID for created/updated by fields
 * @returns {Promise<void>}
 */
const seedAttendanceData = async (userId) => {
  try {
    logger.info('Starting attendance data seeding...');
    
    // Seed work schedules
    const workSchedules = await seedWorkSchedules(userId);
    
    // Seed holidays
    await seedHolidays(userId);
    
    // Seed employee schedules
    await seedEmployeeSchedules(workSchedules, userId);
    
    // Seed leave balances
    await seedLeaveBalances(userId);
    
    // Seed leave requests
    await seedLeaveRequests(userId);
    
    // Seed attendance records
    await seedAttendanceRecords(userId);
    
    logger.info('Attendance data seeding completed successfully');
  } catch (error) {
    logger.error('Error seeding attendance data:', error);
    throw error;
  }
};

/**
 * Destroy all attendance-related data
 * @returns {Promise<void>}
 */
const destroyAttendanceData = async () => {
  try {
    logger.info('Destroying attendance data...');
    
    await Attendance.deleteMany({});
    await Leave.deleteMany({});
    await LeaveBalance.deleteMany({});
    await WorkSchedule.deleteMany({});
    await EmployeeSchedule.deleteMany({});
    await Holiday.deleteMany({});
    
    logger.info('Attendance data destroyed successfully');
  } catch (error) {
    logger.error('Error destroying attendance data:', error);
    throw error;
  }
};

module.exports = {
  seedAttendanceData,
  destroyAttendanceData
};
