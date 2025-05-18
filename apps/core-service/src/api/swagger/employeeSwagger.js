/**
 * Employee API Schemas
 * Swagger schemas for Employee Management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City name
 *         district:
 *           type: string
 *           description: District name
 *         province:
 *           type: string
 *           description: Province name
 *         postalCode:
 *           type: string
 *           description: Postal code
 *         country:
 *           type: string
 *           description: Country name
 *         isPrimary:
 *           type: boolean
 *           description: Whether this is the primary address
 *       required:
 *         - street
 *         - city
 *         - province
 *         - country
 *
 *     Contact:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [PHONE, EMAIL, MOBILE, FAX, OTHER]
 *           description: Type of contact
 *         value:
 *           type: string
 *           description: Contact value (phone number, email address, etc.)
 *         isPrimary:
 *           type: boolean
 *           description: Whether this is the primary contact
 *       required:
 *         - type
 *         - value
 *
 *     EmergencyContact:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of emergency contact
 *         relationship:
 *           type: string
 *           description: Relationship to employee
 *         contacts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Contact'
 *           description: Contact information for emergency contact
 *         address:
 *           $ref: '#/components/schemas/Address'
 *           description: Address of emergency contact
 *       required:
 *         - name
 *         - relationship
 *         - contacts
 *
 *     Document:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: Type of document (KTP, NPWP, etc.)
 *         number:
 *           type: string
 *           description: Document number
 *         issuedBy:
 *           type: string
 *           description: Issuing authority
 *         issuedDate:
 *           type: string
 *           format: date
 *           description: Date document was issued
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Date document expires
 *         fileUrl:
 *           type: string
 *           description: URL to document file
 *         verified:
 *           type: boolean
 *           description: Whether document has been verified
 *         verifiedBy:
 *           type: string
 *           description: User ID of verifier
 *         verifiedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time of verification
 *       required:
 *         - type
 *         - number
 *
 *     Assignment:
 *       type: object
 *       properties:
 *         branch:
 *           type: string
 *           description: Branch ID
 *         division:
 *           type: string
 *           description: Division ID
 *         position:
 *           type: string
 *           description: Position ID
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of assignment
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of assignment
 *         isActive:
 *           type: boolean
 *           description: Whether assignment is active
 *         notes:
 *           type: string
 *           description: Notes about assignment
 *       required:
 *         - branch
 *         - division
 *         - position
 *         - startDate
 *
 *     StatusHistory:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, ON_LEAVE, TERMINATED]
 *           description: Employee status
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of status
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of status
 *         reason:
 *           type: string
 *           description: Reason for status change
 *         notes:
 *           type: string
 *           description: Additional notes
 *       required:
 *         - status
 *         - startDate
 *
 *     Skill:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Skill name
 *         category:
 *           type: string
 *           description: Skill category
 *         proficiencyLevel:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Proficiency level (1-5)
 *         yearsOfExperience:
 *           type: number
 *           description: Years of experience with skill
 *         notes:
 *           type: string
 *           description: Additional notes
 *       required:
 *         - name
 *         - proficiencyLevel
 *
 *     Education:
 *       type: object
 *       properties:
 *         institution:
 *           type: string
 *           description: Educational institution
 *         degree:
 *           type: string
 *           description: Degree obtained
 *         field:
 *           type: string
 *           description: Field of study
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of education
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of education
 *         grade:
 *           type: string
 *           description: Grade or GPA
 *       required:
 *         - institution
 *         - degree
 *         - startDate
 *
 *     Training:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Training name
 *         provider:
 *           type: string
 *           description: Training provider
 *         description:
 *           type: string
 *           description: Training description
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of training
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of training
 *         certificateNumber:
 *           type: string
 *           description: Certificate number
 *         certificateUrl:
 *           type: string
 *           description: URL to certificate file
 *       required:
 *         - name
 *         - startDate
 *
 *     PerformanceEvaluation:
 *       type: object
 *       properties:
 *         evaluationDate:
 *           type: string
 *           format: date
 *           description: Date of evaluation
 *         evaluator:
 *           type: string
 *           description: User ID of evaluator
 *         overallRating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Overall rating (1-5)
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for category (1-5)
 *               comments:
 *                 type: string
 *                 description: Comments for category
 *           description: Evaluation categories
 *         strengths:
 *           type: string
 *           description: Employee strengths
 *         areasForImprovement:
 *           type: string
 *           description: Areas for improvement
 *         goals:
 *           type: string
 *           description: Goals for next period
 *         comments:
 *           type: string
 *           description: Additional comments
 *       required:
 *         - evaluationDate
 *         - evaluator
 *         - overallRating
 *
 *     CareerDevelopment:
 *       type: object
 *       properties:
 *         planDate:
 *           type: string
 *           format: date
 *           description: Date plan was created
 *         shortTermGoals:
 *           type: string
 *           description: Short-term career goals
 *         longTermGoals:
 *           type: string
 *           description: Long-term career goals
 *         developmentActivities:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               activity:
 *                 type: string
 *                 description: Development activity
 *               targetDate:
 *                 type: string
 *                 format: date
 *                 description: Target date for completion
 *               status:
 *                 type: string
 *                 enum: [PLANNED, IN_PROGRESS, COMPLETED, CANCELLED]
 *                 description: Activity status
 *               completionDate:
 *                 type: string
 *                 format: date
 *                 description: Date activity was completed
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *           description: Development activities
 *       required:
 *         - planDate
 *
 *     Contract:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [PROBATION, FIXED_TERM, PERMANENT]
 *           description: Contract type
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of contract
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of contract
 *         documentUrl:
 *           type: string
 *           description: URL to contract document
 *         terms:
 *           type: string
 *           description: Contract terms
 *         salary:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *               description: Salary amount
 *             currency:
 *               type: string
 *               default: IDR
 *               description: Currency code
 *           description: Salary information
 *       required:
 *         - type
 *         - startDate
 *
 *     EmployeeInput:
 *       type: object
 *       properties:
 *         employeeId:
 *           type: string
 *           description: Employee ID
 *         firstName:
 *           type: string
 *           description: First name
 *         lastName:
 *           type: string
 *           description: Last name
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           description: Gender
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth
 *         placeOfBirth:
 *           type: string
 *           description: Place of birth
 *         nationality:
 *           type: string
 *           description: Nationality
 *         maritalStatus:
 *           type: string
 *           enum: [SINGLE, MARRIED, DIVORCED, WIDOWED]
 *           description: Marital status
 *         religion:
 *           type: string
 *           enum: [ISLAM, CHRISTIAN, CATHOLIC, HINDU, BUDDHIST, CONFUCIAN, OTHER]
 *           description: Religion
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *           description: Addresses
 *         contacts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Contact'
 *           description: Contact information
 *         emergencyContacts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EmergencyContact'
 *           description: Emergency contacts
 *         joinDate:
 *           type: string
 *           format: date
 *           description: Date employee joined
 *         employmentStatus:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERN]
 *           description: Employment status
 *         currentBranch:
 *           type: string
 *           description: Current branch ID
 *         currentDivision:
 *           type: string
 *           description: Current division ID
 *         currentPosition:
 *           type: string
 *           description: Current position ID
 *       required:
 *         - employeeId
 *         - firstName
 *         - gender
 *         - dateOfBirth
 *         - joinDate
 *         - employmentStatus
 *         - currentBranch
 *         - currentDivision
 *         - currentPosition
 *
 *     EmployeeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Success status
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: MongoDB ID
 *             employeeId:
 *               type: string
 *               description: Employee ID
 *             firstName:
 *               type: string
 *               description: First name
 *             lastName:
 *               type: string
 *               description: Last name
 *             fullName:
 *               type: string
 *               description: Full name
 *             gender:
 *               type: string
 *               enum: [MALE, FEMALE, OTHER]
 *               description: Gender
 *             dateOfBirth:
 *               type: string
 *               format: date
 *               description: Date of birth
 *             placeOfBirth:
 *               type: string
 *               description: Place of birth
 *             nationality:
 *               type: string
 *               description: Nationality
 *             maritalStatus:
 *               type: string
 *               enum: [SINGLE, MARRIED, DIVORCED, WIDOWED]
 *               description: Marital status
 *             religion:
 *               type: string
 *               enum: [ISLAM, CHRISTIAN, CATHOLIC, HINDU, BUDDHIST, CONFUCIAN, OTHER]
 *               description: Religion
 *             addresses:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *               description: Addresses
 *             contacts:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *               description: Contact information
 *             emergencyContacts:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmergencyContact'
 *               description: Emergency contacts
 *             joinDate:
 *               type: string
 *               format: date
 *               description: Date employee joined
 *             employmentStatus:
 *               type: string
 *               enum: [FULL_TIME, PART_TIME, CONTRACT, INTERN]
 *               description: Employment status
 *             currentStatus:
 *               type: string
 *               enum: [ACTIVE, INACTIVE, ON_LEAVE, TERMINATED]
 *               description: Current status
 *             userId:
 *               type: string
 *               description: Associated user ID
 *             currentBranch:
 *               type: object
 *               description: Current branch
 *             currentDivision:
 *               type: object
 *               description: Current division
 *             currentPosition:
 *               type: object
 *               description: Current position
 *             documents:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *               description: Documents
 *             assignments:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *               description: Assignment history
 *             statusHistory:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StatusHistory'
 *               description: Status history
 *             skills:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 *               description: Skills
 *             education:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Education'
 *               description: Education history
 *             trainings:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Training'
 *               description: Training history
 *             performanceEvaluations:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PerformanceEvaluation'
 *               description: Performance evaluations
 *             careerDevelopment:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CareerDevelopment'
 *               description: Career development plans
 *             contracts:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contract'
 *               description: Contracts
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: Creation timestamp
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: Last update timestamp
 *
 *     EmployeeListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Success status
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EmployeeResponse'
 *           description: List of employees
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: Total number of records
 *             limit:
 *               type: integer
 *               description: Number of records per page
 *             page:
 *               type: integer
 *               description: Current page number
 *             pages:
 *               type: integer
 *               description: Total number of pages
 *           description: Pagination information
 */

module.exports = {};
