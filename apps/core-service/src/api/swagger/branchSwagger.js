/**
 * Branch Swagger Documentation
 * Defines Swagger documentation for branch management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BranchInput:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - type
 *         - address
 *         - contactInfo
 *       properties:
 *         code:
 *           type: string
 *           description: Unique branch code
 *           example: "JKT001"
 *         name:
 *           type: string
 *           description: Branch name
 *           example: "Jakarta Pusat"
 *         type:
 *           type: string
 *           enum: [HEAD_OFFICE, REGIONAL, BRANCH]
 *           description: Branch type
 *           example: "BRANCH"
 *         parent:
 *           type: string
 *           description: Parent branch ID (null for root branches)
 *           example: "60d21b4667d0d8992e610c85"
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, PENDING, CLOSED]
 *           description: Branch status
 *           default: "ACTIVE"
 *           example: "ACTIVE"
 *         address:
 *           type: object
 *           required:
 *             - street
 *             - city
 *             - province
 *             - postalCode
 *           properties:
 *             street:
 *               type: string
 *               description: Street address
 *               example: "Jl. Sudirman No. 123"
 *             city:
 *               type: string
 *               description: City
 *               example: "Jakarta Pusat"
 *             province:
 *               type: string
 *               description: Province
 *               example: "DKI Jakarta"
 *             postalCode:
 *               type: string
 *               description: Postal code
 *               example: "10110"
 *             country:
 *               type: string
 *               description: Country
 *               default: "Indonesia"
 *               example: "Indonesia"
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                   description: Latitude coordinate
 *                   example: -6.2088
 *                 longitude:
 *                   type: number
 *                   description: Longitude coordinate
 *                   example: 106.8456
 *         contactInfo:
 *           type: object
 *           required:
 *             - phone
 *             - email
 *           properties:
 *             phone:
 *               type: string
 *               description: Phone number
 *               example: "+6221-5555-1234"
 *             email:
 *               type: string
 *               format: email
 *               description: Email address
 *               example: "jakarta.pusat@samudrapp.com"
 *             fax:
 *               type: string
 *               description: Fax number
 *               example: "+6221-5555-5678"
 *             website:
 *               type: string
 *               description: Website URL
 *               example: "https://jakarta.samudrapp.com"
 *         operationalHours:
 *           type: array
 *           description: Operational hours for each day of the week
 *           items:
 *             type: object
 *             required:
 *               - day
 *               - isOpen
 *             properties:
 *               day:
 *                 type: string
 *                 enum: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
 *                 description: Day of the week
 *                 example: "MONDAY"
 *               isOpen:
 *                 type: boolean
 *                 description: Whether branch is open on this day
 *                 example: true
 *               openTime:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *                 description: Opening time (HH:MM)
 *                 example: "08:00"
 *               closeTime:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *                 description: Closing time (HH:MM)
 *                 example: "17:00"
 *         resources:
 *           type: object
 *           properties:
 *             employeeCount:
 *               type: number
 *               description: Number of employees
 *               example: 25
 *             vehicleCount:
 *               type: number
 *               description: Number of vehicles
 *               example: 10
 *             storageCapacity:
 *               type: number
 *               description: Storage capacity in cubic meters
 *               example: 500
 *
 *     BranchUpdateInput:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: Unique branch code
 *           example: "JKT001"
 *         name:
 *           type: string
 *           description: Branch name
 *           example: "Jakarta Pusat"
 *         type:
 *           type: string
 *           enum: [HEAD_OFFICE, REGIONAL, BRANCH]
 *           description: Branch type
 *           example: "BRANCH"
 *         parent:
 *           type: string
 *           description: Parent branch ID (null for root branches)
 *           example: "60d21b4667d0d8992e610c85"
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, PENDING, CLOSED]
 *           description: Branch status
 *           example: "ACTIVE"
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               description: Street address
 *               example: "Jl. Sudirman No. 123"
 *             city:
 *               type: string
 *               description: City
 *               example: "Jakarta Pusat"
 *             province:
 *               type: string
 *               description: Province
 *               example: "DKI Jakarta"
 *             postalCode:
 *               type: string
 *               description: Postal code
 *               example: "10110"
 *             country:
 *               type: string
 *               description: Country
 *               example: "Indonesia"
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                   description: Latitude coordinate
 *                   example: -6.2088
 *                 longitude:
 *                   type: number
 *                   description: Longitude coordinate
 *                   example: 106.8456
 *         contactInfo:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               description: Phone number
 *               example: "+6221-5555-1234"
 *             email:
 *               type: string
 *               format: email
 *               description: Email address
 *               example: "jakarta.pusat@samudrapp.com"
 *             fax:
 *               type: string
 *               description: Fax number
 *               example: "+6221-5555-5678"
 *             website:
 *               type: string
 *               description: Website URL
 *               example: "https://jakarta.samudrapp.com"
 *
 *     BranchMetricsInput:
 *       type: object
 *       properties:
 *         monthlyShipmentVolume:
 *           type: number
 *           description: Monthly shipment volume
 *           example: 1500
 *         monthlyRevenue:
 *           type: number
 *           description: Monthly revenue in IDR
 *           example: 75000000
 *         customerSatisfactionScore:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: Customer satisfaction score (0-5)
 *           example: 4.5
 *         deliverySuccessRate:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Delivery success rate in percentage
 *           example: 98.5
 *
 *     BranchResourcesInput:
 *       type: object
 *       properties:
 *         employeeCount:
 *           type: number
 *           minimum: 0
 *           description: Number of employees
 *           example: 25
 *         vehicleCount:
 *           type: number
 *           minimum: 0
 *           description: Number of vehicles
 *           example: 10
 *         storageCapacity:
 *           type: number
 *           minimum: 0
 *           description: Storage capacity in cubic meters
 *           example: 500
 *
 *     BranchDocumentInput:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - fileUrl
 *       properties:
 *         name:
 *           type: string
 *           description: Document name
 *           example: "Business License"
 *         type:
 *           type: string
 *           enum: [LICENSE, PERMIT, CERTIFICATE, CONTRACT, OTHER]
 *           description: Document type
 *           example: "LICENSE"
 *         fileUrl:
 *           type: string
 *           description: Document file URL
 *           example: "https://storage.samudrapp.com/documents/license-jkt001.pdf"
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Document expiry date
 *           example: "2026-12-31"
 *
 *     BranchOperationalHoursInput:
 *       type: array
 *       description: Operational hours for each day of the week
 *       items:
 *         type: object
 *         required:
 *           - day
 *           - isOpen
 *         properties:
 *           day:
 *             type: string
 *             enum: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
 *             description: Day of the week
 *             example: "MONDAY"
 *           isOpen:
 *             type: boolean
 *             description: Whether branch is open on this day
 *             example: true
 *           openTime:
 *             type: string
 *             pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *             description: Opening time (HH:MM)
 *             example: "08:00"
 *           closeTime:
 *             type: string
 *             pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *             description: Closing time (HH:MM)
 *             example: "17:00"
 *
 *     BranchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Success status
 *           example: true
 *         message:
 *           type: string
 *           description: Response message
 *           example: "Branch created successfully"
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Branch ID
 *               example: "60d21b4667d0d8992e610c85"
 *             code:
 *               type: string
 *               description: Branch code
 *               example: "JKT001"
 *             name:
 *               type: string
 *               description: Branch name
 *               example: "Jakarta Pusat"
 *             type:
 *               type: string
 *               description: Branch type
 *               example: "BRANCH"
 *             parent:
 *               type: string
 *               description: Parent branch ID
 *               example: "60d21b4667d0d8992e610c85"
 *             level:
 *               type: number
 *               description: Branch level in hierarchy
 *               example: 1
 *             path:
 *               type: string
 *               description: Branch path in hierarchy
 *               example: "HO.JKT001"
 *             status:
 *               type: string
 *               description: Branch status
 *               example: "ACTIVE"
 *             address:
 *               type: object
 *               properties:
 *                 street:
 *                   type: string
 *                   example: "Jl. Sudirman No. 123"
 *                 city:
 *                   type: string
 *                   example: "Jakarta Pusat"
 *                 province:
 *                   type: string
 *                   example: "DKI Jakarta"
 *                 postalCode:
 *                   type: string
 *                   example: "10110"
 *                 country:
 *                   type: string
 *                   example: "Indonesia"
 *                 coordinates:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       example: -6.2088
 *                     longitude:
 *                       type: number
 *                       example: 106.8456
 *             contactInfo:
 *               type: object
 *               properties:
 *                 phone:
 *                   type: string
 *                   example: "+6221-5555-1234"
 *                 email:
 *                   type: string
 *                   example: "jakarta.pusat@samudrapp.com"
 *                 fax:
 *                   type: string
 *                   example: "+6221-5555-5678"
 *                 website:
 *                   type: string
 *                   example: "https://jakarta.samudrapp.com"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2023-01-01T00:00:00.000Z"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: "2023-01-01T00:00:00.000Z"
 *
 *     BranchListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Branch'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *               example: 50
 *             page:
 *               type: number
 *               example: 1
 *             limit:
 *               type: number
 *               example: 10
 *             totalPages:
 *               type: number
 *               example: 5
 *
 *     BranchHierarchyResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *               code:
 *                 type: string
 *                 example: "HO"
 *               name:
 *                 type: string
 *                 example: "Head Office"
 *               type:
 *                 type: string
 *                 example: "HEAD_OFFICE"
 *               level:
 *                 type: number
 *                 example: 0
 *               children:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c86"
 *                     code:
 *                       type: string
 *                       example: "JKT"
 *                     name:
 *                       type: string
 *                       example: "Jakarta Regional"
 *                     type:
 *                       type: string
 *                       example: "REGIONAL"
 *                     level:
 *                       type: number
 *                       example: 1
 *                     children:
 *                       type: array
 *                       items:
 *                         type: object
 *
 *     Branch:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Branch ID
 *           example: "60d21b4667d0d8992e610c85"
 *         code:
 *           type: string
 *           description: Branch code
 *           example: "JKT001"
 *         name:
 *           type: string
 *           description: Branch name
 *           example: "Jakarta Pusat"
 *         type:
 *           type: string
 *           description: Branch type
 *           example: "BRANCH"
 *         parent:
 *           type: string
 *           description: Parent branch ID
 *           example: "60d21b4667d0d8992e610c85"
 *         level:
 *           type: number
 *           description: Branch level in hierarchy
 *           example: 1
 *         path:
 *           type: string
 *           description: Branch path in hierarchy
 *           example: "HO.JKT001"
 *         status:
 *           type: string
 *           description: Branch status
 *           example: "ACTIVE"
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               example: "Jl. Sudirman No. 123"
 *             city:
 *               type: string
 *               example: "Jakarta Pusat"
 *             province:
 *               type: string
 *               example: "DKI Jakarta"
 *             postalCode:
 *               type: string
 *               example: "10110"
 *             country:
 *               type: string
 *               example: "Indonesia"
 *         contactInfo:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               example: "+6221-5555-1234"
 *             email:
 *               type: string
 *               example: "jakarta.pusat@samudrapp.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// This file only contains JSDoc comments for Swagger documentation
module.exports = {};
