/**
 * Attendance Service API Documentation
 * Swagger documentation for Attendance, Leave, and Schedule endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendance:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Attendance record ID
 *         employeeId:
 *           type: string
 *           description: Employee ID
 *         date:
 *           type: string
 *           format: date
 *           description: Attendance date
 *         checkIn:
 *           type: object
 *           properties:
 *             time:
 *               type: string
 *               format: date-time
 *               description: Check-in time
 *             location:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   enum: [Point]
 *                 coordinates:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: [longitude, latitude]
 *             device:
 *               type: string
 *               description: Device information
 *         checkOut:
 *           type: object
 *           properties:
 *             time:
 *               type: string
 *               format: date-time
 *               description: Check-out time
 *             location:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   enum: [Point]
 *                 coordinates:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: [longitude, latitude]
 *             device:
 *               type: string
 *               description: Device information
 *         status:
 *           type: string
 *           enum: [PRESENT, ABSENT, LATE, HALF_DAY, EARLY_DEPARTURE, ON_LEAVE, HOLIDAY, WEEKEND]
 *           description: Attendance status
 *         workHours:
 *           type: number
 *           description: Total work hours
 *         anomalies:
 *           type: object
 *           properties:
 *             isLate:
 *               type: boolean
 *             isEarlyDeparture:
 *               type: boolean
 *             isIncomplete:
 *               type: boolean
 *             isOutsideGeofence:
 *               type: boolean
 *         correctionRequest:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [PENDING, APPROVED, REJECTED]
 *             reason:
 *               type: string
 *             requestedBy:
 *               type: string
 *             requestedAt:
 *               type: string
 *               format: date-time
 *             reviewedBy:
 *               type: string
 *             reviewedAt:
 *               type: string
 *               format: date-time
 *             reviewNotes:
 *               type: string
 *         notes:
 *           type: string
 *           description: Additional notes
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - employeeId
 *         - date
 *         - checkIn
 *
 *     Leave:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Leave request ID
 *         employeeId:
 *           type: string
 *           description: Employee ID
 *         type:
 *           type: string
 *           enum: [ANNUAL, SICK, MATERNITY, PATERNITY, BEREAVEMENT, UNPAID, RELIGIOUS, MARRIAGE, EMERGENCY, OTHER]
 *           description: Leave type
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of leave
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of leave
 *         reason:
 *           type: string
 *           description: Reason for leave
 *         isHalfDay:
 *           type: boolean
 *           description: Whether it's a half-day leave
 *         halfDayPortion:
 *           type: string
 *           enum: [MORNING, AFTERNOON]
 *           description: Which portion of the day for half-day leave
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED]
 *           description: Leave request status
 *         approvals:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               approverRole:
 *                 type: string
 *               approverName:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *               notes:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               fileUrl:
 *                 type: string
 *               fileName:
 *                 type: string
 *               fileType:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - employeeId
 *         - type
 *         - startDate
 *         - endDate
 *         - reason
 *
 *     LeaveBalance:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Leave balance ID
 *         employeeId:
 *           type: string
 *           description: Employee ID
 *         year:
 *           type: integer
 *           description: Year for the balance
 *         balances:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [ANNUAL, SICK, MATERNITY, PATERNITY, BEREAVEMENT, UNPAID, RELIGIOUS, MARRIAGE, EMERGENCY, OTHER]
 *               allocated:
 *                 type: number
 *               used:
 *                 type: number
 *               pending:
 *                 type: number
 *               remaining:
 *                 type: number
 *               additional:
 *                 type: number
 *               carriedOver:
 *                 type: number
 *               adjustments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                     reason:
 *                       type: string
 *                     adjustedBy:
 *                       type: string
 *                     adjustedAt:
 *                       type: string
 *                       format: date-time
 *         accrualSettings:
 *           type: object
 *           properties:
 *             isMonthlyAccrual:
 *               type: boolean
 *             monthlyAccrualAmount:
 *               type: number
 *             maxAccrualLimit:
 *               type: number
 *             isProratedFirstYear:
 *               type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - employeeId
 *         - year
 *         - balances
 *
 *     WorkSchedule:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Work schedule ID
 *         name:
 *           type: string
 *           description: Schedule name
 *         code:
 *           type: string
 *           description: Schedule code
 *         description:
 *           type: string
 *           description: Schedule description
 *         type:
 *           type: string
 *           enum: [REGULAR, SHIFT, FLEXIBLE, CUSTOM]
 *           description: Schedule type
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           description: Schedule status
 *         workingDays:
 *           type: object
 *           properties:
 *             monday:
 *               type: boolean
 *             tuesday:
 *               type: boolean
 *             wednesday:
 *               type: boolean
 *             thursday:
 *               type: boolean
 *             friday:
 *               type: boolean
 *             saturday:
 *               type: boolean
 *             sunday:
 *               type: boolean
 *         workingHours:
 *           type: object
 *           properties:
 *             regular:
 *               type: object
 *               properties:
 *                 startTime:
 *                   type: string
 *                   format: time
 *                 endTime:
 *                   type: string
 *                   format: time
 *             shifts:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   name:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                     format: time
 *                   endTime:
 *                     type: string
 *                     format: time
 *         overtimeSettings:
 *           type: object
 *           properties:
 *             isEnabled:
 *               type: boolean
 *             maxHoursPerDay:
 *               type: number
 *             maxHoursPerWeek:
 *               type: number
 *         flexibleSettings:
 *           type: object
 *           properties:
 *             coreStartTime:
 *               type: string
 *               format: time
 *             coreEndTime:
 *               type: string
 *               format: time
 *             flexibleStartTime:
 *               type: string
 *               format: time
 *             flexibleEndTime:
 *               type: string
 *               format: time
 *         geofencing:
 *           type: object
 *           properties:
 *             isEnabled:
 *               type: boolean
 *             radius:
 *               type: number
 *         branches:
 *           type: array
 *           items:
 *             type: string
 *           description: Applicable branch IDs
 *         divisions:
 *           type: array
 *           items:
 *             type: string
 *           description: Applicable division IDs
 *         positions:
 *           type: array
 *           items:
 *             type: string
 *           description: Applicable position IDs
 *         effectiveStartDate:
 *           type: string
 *           format: date
 *           description: Effective start date
 *         effectiveEndDate:
 *           type: string
 *           format: date
 *           description: Effective end date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - code
 *         - type
 *
 *     EmployeeSchedule:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Employee schedule ID
 *         employeeId:
 *           type: string
 *           description: Employee ID
 *         scheduleId:
 *           type: string
 *           description: Work schedule ID
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           description: Assignment status
 *         effectiveStartDate:
 *           type: string
 *           format: date
 *           description: Effective start date
 *         effectiveEndDate:
 *           type: string
 *           format: date
 *           description: Effective end date
 *         shiftAssignments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               shiftCode:
 *                 type: string
 *               notes:
 *                 type: string
 *         overrides:
 *           type: object
 *           properties:
 *             workingDays:
 *               type: object
 *             workingHours:
 *               type: object
 *         dateOverrides:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               isWorkingDay:
 *                 type: boolean
 *               workingHours:
 *                 type: object
 *                 properties:
 *                   startTime:
 *                     type: string
 *                     format: time
 *                   endTime:
 *                     type: string
 *                     format: time
 *               reason:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - employeeId
 *         - scheduleId
 *         - effectiveStartDate
 *
 *     Holiday:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Holiday ID
 *         name:
 *           type: string
 *           description: Holiday name
 *         date:
 *           type: string
 *           format: date
 *           description: Holiday date
 *         type:
 *           type: string
 *           enum: [NATIONAL, RELIGIOUS, COMPANY, LOCAL, OTHER]
 *           description: Holiday type
 *         description:
 *           type: string
 *           description: Holiday description
 *         isRecurring:
 *           type: boolean
 *           description: Whether the holiday recurs yearly
 *         isHalfDay:
 *           type: boolean
 *           description: Whether it's a half-day holiday
 *         halfDayPortion:
 *           type: string
 *           enum: [MORNING, AFTERNOON]
 *           description: Which portion of the day for half-day holiday
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           description: Holiday status
 *         applicableBranches:
 *           type: array
 *           items:
 *             type: string
 *           description: Applicable branch IDs
 *         applicableDivisions:
 *           type: array
 *           items:
 *             type: string
 *           description: Applicable division IDs
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - date
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   - name: Attendance
 *     description: Attendance management endpoints
 *   - name: Leave
 *     description: Leave management endpoints
 *   - name: Schedule
 *     description: Work schedule and holiday management endpoints
 */

/**
 * @swagger
 * paths:
 *   /api/attendance/check-in:
 *     post:
 *       summary: Record employee check-in
 *       tags: [Attendance]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - employeeId
 *                 - location
 *               properties:
 *                 employeeId:
 *                   type: string
 *                   description: Employee ID
 *                 location:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: number
 *                       description: [longitude, latitude]
 *                 device:
 *                   type: string
 *                   description: Device information
 *                 notes:
 *                   type: string
 *                   description: Additional notes
 *       responses:
 *         200:
 *           description: Check-in recorded successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   data:
 *                     $ref: '#/components/schemas/Attendance'
 *                   message:
 *                     type: string
 *         400:
 *           description: Bad request
 *         401:
 *           description: Unauthorized
 *
 *   /api/attendance/check-out:
 *     post:
 *       summary: Record employee check-out
 *       tags: [Attendance]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - employeeId
 *                 - location
 *               properties:
 *                 employeeId:
 *                   type: string
 *                   description: Employee ID
 *                 location:
 *                   type: object
 *                   properties:
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: number
 *                       description: [longitude, latitude]
 *                 device:
 *                   type: string
 *                   description: Device information
 *                 notes:
 *                   type: string
 *                   description: Additional notes
 *       responses:
 *         200:
 *           description: Check-out recorded successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   data:
 *                     $ref: '#/components/schemas/Attendance'
 *                   message:
 *                     type: string
 *         400:
 *           description: Bad request
 *         401:
 *           description: Unauthorized
 *
 *   /api/leave/request:
 *     post:
 *       summary: Request leave
 *       tags: [Leave]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - employeeId
 *                 - type
 *                 - startDate
 *                 - endDate
 *                 - reason
 *               properties:
 *                 employeeId:
 *                   type: string
 *                   description: Employee ID
 *                 type:
 *                   type: string
 *                   enum: [ANNUAL, SICK, MATERNITY, PATERNITY, BEREAVEMENT, UNPAID, RELIGIOUS, MARRIAGE, EMERGENCY, OTHER]
 *                   description: Leave type
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   description: Start date of leave
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   description: End date of leave
 *                 reason:
 *                   type: string
 *                   description: Reason for leave
 *                 isHalfDay:
 *                   type: boolean
 *                   description: Whether it's a half-day leave
 *                 halfDayPortion:
 *                   type: string
 *                   enum: [MORNING, AFTERNOON]
 *                   description: Which portion of the day for half-day leave
 *                 attachments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileUrl:
 *                         type: string
 *                       fileName:
 *                         type: string
 *                       fileType:
 *                         type: string
 *                   description: Supporting documents
 *       responses:
 *         201:
 *           description: Leave request submitted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   data:
 *                     $ref: '#/components/schemas/Leave'
 *                   message:
 *                     type: string
 *         400:
 *           description: Bad request
 *         401:
 *           description: Unauthorized
 *
 *   /api/schedule/work-schedule:
 *     post:
 *       summary: Create work schedule
 *       tags: [Schedule]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - code
 *                 - type
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Schedule name
 *                 code:
 *                   type: string
 *                   description: Schedule code
 *                 description:
 *                   type: string
 *                   description: Schedule description
 *                 type:
 *                   type: string
 *                   enum: [REGULAR, SHIFT, FLEXIBLE, CUSTOM]
 *                   description: Schedule type
 *                 workingDays:
 *                   type: object
 *                   description: Working days configuration
 *                 workingHours:
 *                   type: object
 *                   description: Working hours configuration
 *                 overtimeSettings:
 *                   type: object
 *                   description: Overtime settings
 *                 flexibleSettings:
 *                   type: object
 *                   description: Flexible time settings
 *                 geofencing:
 *                   type: object
 *                   description: Geofencing settings
 *                 branches:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Applicable branch IDs
 *                 divisions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Applicable division IDs
 *                 positions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Applicable position IDs
 *                 effectiveStartDate:
 *                   type: string
 *                   format: date
 *                   description: Effective start date
 *                 effectiveEndDate:
 *                   type: string
 *                   format: date
 *                   description: Effective end date
 *       responses:
 *         201:
 *           description: Work schedule created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   data:
 *                     $ref: '#/components/schemas/WorkSchedule'
 *                   message:
 *                     type: string
 *         400:
 *           description: Bad request
 *         401:
 *           description: Unauthorized
 *         403:
 *           description: Forbidden
 */

module.exports = {};
