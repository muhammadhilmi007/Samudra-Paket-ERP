/**
 * Employee Seeder
 * Seeds initial employee data
 */

const { Employee, Branch, Division, Position } = require('../../domain/models');
const { logger } = require('../../utils');
const mongoose = require('mongoose');

/**
 * Seed employees
 * @param {string} userId - User ID for tracking who created the seed data
 */
const seedEmployees = async (userId) => {
  try {
    logger.info('Starting employee seeder...');
    
    // Check if employees already exist
    const employeeCount = await Employee.countDocuments();
    if (employeeCount > 0) {
      logger.info(`Skipping employee seeder, ${employeeCount} employees already exist`);
      return;
    }
    
    // Get branches, divisions, and positions for reference
    const branches = await Branch.find({});
    if (branches.length === 0) {
      throw new Error('No branches found. Please run branch seeder first.');
    }
    
    const divisions = await Division.find({});
    if (divisions.length === 0) {
      throw new Error('No divisions found. Please run division seeder first.');
    }
    
    const positions = await Position.find({});
    if (positions.length === 0) {
      throw new Error('No positions found. Please run position seeder first.');
    }
    
    // Helper function to safely find entities
    const findEntityByName = (collection, name, entityType) => {
      // First try exact match
      let entity = collection.find(item => item.name === name);
      
      // If not found, try case-insensitive match
      if (!entity && collection.length > 0) {
        const lowerName = name.toLowerCase();
        entity = collection.find(item => item.name.toLowerCase() === lowerName);
      }
      
      // If still not found, try partial match
      if (!entity && collection.length > 0) {
        const lowerName = name.toLowerCase();
        entity = collection.find(item => 
          item.name.toLowerCase().includes(lowerName) || 
          lowerName.includes(item.name.toLowerCase())
        );
      }
      
      // If still not found, use the first item as fallback
      if (!entity && collection.length > 0) {
        logger.warn(`${entityType} with name "${name}" not found. Using first ${entityType} as fallback.`);
        return collection[0];
      } else if (!entity) {
        logger.error(`No ${entityType} found in the database. Please run ${entityType.toLowerCase()} seeder first.`);
        throw new Error(`No ${entityType} found in the database`);
      }
      
      return entity;
    };
    
    // Log available entities for debugging
    logger.info(`Available branches: ${branches.length}`);
    logger.info(`Available divisions: ${divisions.length}`);
    logger.info(`Available positions: ${positions.length}`);
    
    // Ensure we have at least one branch, division, and position
    const defaultBranch = branches[0];
    const defaultDivision = divisions[0];
    const defaultPosition = positions[0];
    
    if (!defaultBranch || !defaultBranch._id) {
      throw new Error('Default branch is invalid or missing _id');
    }
    
    if (!defaultDivision || !defaultDivision._id) {
      throw new Error('Default division is invalid or missing _id');
    }
    
    if (!defaultPosition || !defaultPosition._id) {
      throw new Error('Default position is invalid or missing _id');
    }
    
    // Create sample employees
    const employees = [
      // Executive Management
      {
        employeeId: 'EMP001',
        firstName: 'Budi',
        lastName: 'Santoso',
        fullName: 'Budi Santoso',
        gender: 'MALE',
        dateOfBirth: new Date('1975-05-15'),
        placeOfBirth: 'Jakarta',
        nationality: 'Indonesia',
        maritalStatus: 'MARRIED',
        religion: 'ISLAM',
        addresses: [
          {
            street: 'Jl. Sudirman No. 123',
            city: 'Jakarta',
            district: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12190',
            country: 'Indonesia',
            isPrimary: true
          }
        ],
        contacts: [
          {
            type: 'PHONE',
            value: '081234567890',
            isPrimary: true
          },
          {
            type: 'EMAIL',
            value: 'budi.santoso@samudrapaket.id',
            isPrimary: true
          }
        ],
        emergencyContacts: [
          {
            name: 'Siti Rahayu',
            relationship: 'Spouse',
            contacts: [
              {
                type: 'PHONE',
                value: '081234567891',
                isPrimary: true
              }
            ],
            address: {
              street: 'Jl. Sudirman No. 123',
              city: 'Jakarta',
              district: 'Jakarta Selatan',
              province: 'DKI Jakarta',
              postalCode: '12190',
              country: 'Indonesia',
              isPrimary: true
            }
          }
        ],
        joinDate: new Date('2020-01-01'),
        employmentStatus: 'FULL_TIME',
        currentStatus: 'ACTIVE',
        currentBranch: branches[0]._id, // Head Office
        currentDivision: findEntityByName(divisions, 'Executive Office', 'Division')._id,
        currentPosition: findEntityByName(positions, 'Chief Executive Officer', 'Position')._id,
        bankName: 'Bank Mandiri',
        bankAccountNumber: '1234567890',
        bankAccountName: 'Budi Santoso',
        taxIdentificationNumber: '09.123.456.7-123.000',
        education: [
          {
            level: 'S2',
            institution: 'Universitas Indonesia',
            major: 'Business Administration',
            startYear: 1998,
            endYear: 2000,
            gpa: 3.8
          },
          {
            level: 'S1',
            institution: 'Institut Teknologi Bandung',
            major: 'Industrial Engineering',
            startYear: 1993,
            endYear: 1997,
            gpa: 3.7
          }
        ],
        documents: [
          {
            type: 'KTP',
            number: '3175012345678901',
            issuedBy: 'Dukcapil Jakarta Selatan',
            issuedDate: new Date('2019-05-15'),
            expiryDate: new Date('2039-05-15'),
            verificationStatus: 'VERIFIED',
            verifiedBy: mongoose.Types.ObjectId(userId),
            verifiedAt: new Date()
          }
        ],
        assignmentHistory: [
          {
            branch: branches[0]._id, // Head Office
            division: findEntityByName(divisions, 'Executive Office', 'Division')._id,
            position: findEntityByName(positions, 'Chief Executive Officer', 'Position')._id,
            startDate: new Date('2020-01-01'),
            isActive: true
          }
        ],
        statusHistory: [
          {
            status: 'ACTIVE',
            startDate: new Date('2020-01-01'),
            changedBy: mongoose.Types.ObjectId(userId)
          }
        ],
        createdBy: mongoose.Types.ObjectId(userId),
        updatedBy: mongoose.Types.ObjectId(userId)
      },
      
      // Operations
      {
        employeeId: 'EMP002',
        firstName: 'Dewi',
        lastName: 'Lestari',
        fullName: 'Dewi Lestari',
        gender: 'FEMALE',
        dateOfBirth: new Date('1980-08-20'),
        placeOfBirth: 'Surabaya',
        nationality: 'Indonesia',
        maritalStatus: 'MARRIED',
        religion: 'ISLAM',
        addresses: [
          {
            street: 'Jl. Gatot Subroto No. 45',
            city: 'Jakarta',
            district: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12180',
            country: 'Indonesia',
            isPrimary: true
          }
        ],
        contacts: [
          {
            type: 'PHONE',
            value: '081234567892',
            isPrimary: true
          },
          {
            type: 'EMAIL',
            value: 'dewi.lestari@samudrapaket.id',
            isPrimary: true
          }
        ],
        emergencyContacts: [
          {
            name: 'Andi Wijaya',
            relationship: 'Spouse',
            contacts: [
              {
                type: 'PHONE',
                value: '081234567893',
                isPrimary: true
              }
            ],
            address: {
              street: 'Jl. Gatot Subroto No. 45',
              city: 'Jakarta',
              district: 'Jakarta Selatan',
              province: 'DKI Jakarta',
              postalCode: '12180',
              country: 'Indonesia',
              isPrimary: true
            }
          }
        ],
        joinDate: new Date('2020-02-01'),
        employmentStatus: 'FULL_TIME',
        currentStatus: 'ACTIVE',
        currentBranch: branches[0]._id, // Head Office
        currentDivision: findEntityByName(divisions, 'Operations', 'Division')._id,
        currentPosition: findEntityByName(positions, 'Chief Operations Officer', 'Position')._id,
        bankName: 'BCA',
        bankAccountNumber: '1234567891',
        bankAccountName: 'Dewi Lestari',
        taxIdentificationNumber: '09.123.456.7-123.001',
        education: [
          {
            level: 'S1',
            institution: 'Universitas Gadjah Mada',
            major: 'Industrial Engineering',
            startYear: 1998,
            endYear: 2002,
            gpa: 3.6
          }
        ],
        documents: [
          {
            type: 'KTP',
            number: '3175012345678902',
            issuedBy: 'Dukcapil Jakarta Selatan',
            issuedDate: new Date('2019-08-20'),
            expiryDate: new Date('2039-08-20'),
            verificationStatus: 'VERIFIED',
            verifiedBy: mongoose.Types.ObjectId(userId),
            verifiedAt: new Date()
          }
        ],
        assignmentHistory: [
          {
            branch: branches[0]._id, // Head Office
            division: findEntityByName(divisions, 'Operations', 'Division')._id,
            position: findEntityByName(positions, 'Chief Operations Officer', 'Position')._id,
            startDate: new Date('2020-02-01'),
            isActive: true
          }
        ],
        statusHistory: [
          {
            status: 'ACTIVE',
            startDate: new Date('2020-02-01'),
            changedBy: mongoose.Types.ObjectId(userId)
          }
        ],
        createdBy: mongoose.Types.ObjectId(userId),
        updatedBy: mongoose.Types.ObjectId(userId)
      },
      
      // Finance
      {
        employeeId: 'EMP003',
        firstName: 'Agus',
        lastName: 'Widodo',
        fullName: 'Agus Widodo',
        gender: 'MALE',
        dateOfBirth: new Date('1982-04-10'),
        placeOfBirth: 'Bandung',
        nationality: 'Indonesia',
        maritalStatus: 'MARRIED',
        religion: 'ISLAM',
        joinDate: new Date('2020-03-01'),
        employmentStatus: 'FULL_TIME',
        currentStatus: 'ACTIVE',
        currentBranch: branches[0]._id, // Head Office
        currentDivision: findEntityByName(divisions, 'Finance', 'Division')._id,
        currentPosition: findEntityByName(positions, 'Chief Financial Officer', 'Position')._id,
        addresses: [
          {
            street: 'Jl. Tebet Raya No. 78',
            city: 'Jakarta',
            district: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12810',
            country: 'Indonesia',
            isPrimary: true
          }
        ],
        contacts: [
          {
            type: 'PHONE',
            value: '081234567894',
            isPrimary: true
          },
          {
            type: 'EMAIL',
            value: 'agus.widodo@samudrapaket.id',
            isPrimary: true
          }
        ],
        emergencyContacts: [
          {
            name: 'Rina Susanti',
            relationship: 'Spouse',
            contacts: [
              {
                type: 'PHONE',
                value: '081234567895',
                isPrimary: true
              }
            ],
            address: {
              street: 'Jl. Tebet Raya No. 78',
              city: 'Jakarta',
              district: 'Jakarta Selatan',
              province: 'DKI Jakarta',
              postalCode: '12810',
              country: 'Indonesia',
              isPrimary: true
            }
          }
        ],
        education: [
          {
            level: 'S2',
            institution: 'Universitas Indonesia',
            major: 'Accounting',
            startYear: 2005,
            endYear: 2007,
            gpa: 3.9
          },
          {
            level: 'S1',
            institution: 'Universitas Padjadjaran',
            major: 'Accounting',
            startYear: 2000,
            endYear: 2004,
            gpa: 3.8
          }
        ],
        documents: [
          {
            type: 'KTP',
            number: '3175012345678903',
            issuedBy: 'Dukcapil Jakarta Selatan',
            issuedDate: new Date('2019-04-10'),
            expiryDate: new Date('2039-04-10'),
            verificationStatus: 'VERIFIED',
            verifiedBy: mongoose.Types.ObjectId(userId),
            verifiedAt: new Date()
          }
        ],
        assignmentHistory: [
          {
            branch: branches[0]._id, // Head Office
            division: findEntityByName(divisions, 'Finance', 'Division')._id,
            position: findEntityByName(positions, 'Chief Financial Officer', 'Position')._id,
            startDate: new Date('2020-03-01'),
            isActive: true
          }
        ],
        statusHistory: [
          {
            status: 'ACTIVE',
            startDate: new Date('2020-03-01'),
            changedBy: mongoose.Types.ObjectId(userId)
          }
        ],
        createdBy: mongoose.Types.ObjectId(userId),
        updatedBy: mongoose.Types.ObjectId(userId)
      },
      
      // Human Resources
      {
        employeeId: 'EMP004',
        firstName: 'Siti',
        lastName: 'Rahmawati',
        fullName: 'Siti Rahmawati',
        gender: 'FEMALE',
        dateOfBirth: new Date('1985-07-25'),
        placeOfBirth: 'Yogyakarta',
        nationality: 'Indonesia',
        maritalStatus: 'MARRIED',
        religion: 'ISLAM',
        addresses: [
          {
            street: 'Jl. Kemang Raya No. 56',
            city: 'Jakarta',
            district: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12730',
            country: 'Indonesia',
            isPrimary: true
          }
        ],
        contacts: [
          {
            type: 'PHONE',
            value: '081234567896',
            isPrimary: true
          },
          {
            type: 'EMAIL',
            value: 'siti.rahmawati@samudrapaket.id',
            isPrimary: true
          }
        ],
        emergencyContacts: [
          {
            name: 'Doni Pratama',
            relationship: 'Spouse',
            contacts: [
              {
                type: 'PHONE',
                value: '081234567897',
                isPrimary: true
              }
            ],
            address: {
              street: 'Jl. Kemang Raya No. 56',
              city: 'Jakarta',
              district: 'Jakarta Selatan',
              province: 'DKI Jakarta',
              postalCode: '12730',
              country: 'Indonesia',
              isPrimary: true
            }
          }
        ],
        joinDate: new Date('2020-04-01'),
        employmentStatus: 'FULL_TIME',
        currentStatus: 'ACTIVE',
        currentBranch: branches[0]._id, // Head Office
        currentDivision: findEntityByName(divisions, 'Human Resources', 'Division')._id,
        currentPosition: findEntityByName(positions, 'HR Manager', 'Position')._id,
        bankName: 'BRI',
        bankAccountNumber: '1234567893',
        bankAccountName: 'Siti Rahmawati',
        taxIdentificationNumber: '09.123.456.7-123.003',
        education: [
          {
            level: 'S1',
            institution: 'Universitas Gadjah Mada',
            major: 'Psychology',
            startYear: 2003,
            endYear: 2007,
            gpa: 3.7
          }
        ],
        documents: [
          {
            type: 'KTP',
            number: '3175012345678904',
            issuedBy: 'Dukcapil Jakarta Selatan',
            issuedDate: new Date('2019-07-25'),
            expiryDate: new Date('2039-07-25'),
            verificationStatus: 'VERIFIED',
            verifiedBy: mongoose.Types.ObjectId(userId),
            verifiedAt: new Date()
          }
        ],
        assignmentHistory: [
          {
            branch: branches[0]._id, // Head Office
            division: findEntityByName(divisions, 'Human Resources', 'Division')._id,
            position: findEntityByName(positions, 'HR Manager', 'Position')._id,
            startDate: new Date('2020-04-01'),
            isActive: true
          }
        ],
        statusHistory: [
          {
            status: 'ACTIVE',
            startDate: new Date('2020-04-01'),
            changedBy: mongoose.Types.ObjectId(userId)
          }
        ],
        createdBy: mongoose.Types.ObjectId(userId),
        updatedBy: mongoose.Types.ObjectId(userId)
      },
      
      // IT
      {
        employeeId: 'EMP005',
        firstName: 'Rudi',
        lastName: 'Hermawan',
        fullName: 'Rudi Hermawan',
        gender: 'MALE',
        dateOfBirth: new Date('1988-11-15'),
        placeOfBirth: 'Semarang',
        nationality: 'Indonesia',
        maritalStatus: 'MARRIED',
        religion: 'CHRISTIAN',
        addresses: [
          {
            street: 'Jl. Casablanca No. 34',
            city: 'Jakarta',
            district: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12870',
            country: 'Indonesia',
            isPrimary: true
          }
        ],
        contacts: [
          {
            type: 'PHONE',
            value: '081234567898',
            isPrimary: true
          },
          {
            type: 'EMAIL',
            value: 'rudi.hermawan@samudrapaket.id',
            isPrimary: true
          }
        ],
        emergencyContacts: [
          {
            name: 'Maya Putri',
            relationship: 'Spouse',
            contacts: [
              {
                type: 'PHONE',
                value: '081234567899',
                isPrimary: true
              }
            ],
            address: {
              street: 'Jl. Casablanca No. 34',
              city: 'Jakarta',
              district: 'Jakarta Selatan',
              province: 'DKI Jakarta',
              postalCode: '12870',
              country: 'Indonesia',
              isPrimary: true
            }
          }
        ],
        joinDate: new Date('2020-05-01'),
        employmentStatus: 'FULL_TIME',
        currentStatus: 'ACTIVE',
        currentBranch: branches[0]._id, // Head Office
        currentDivision: findEntityByName(divisions, 'Information Technology', 'Division')._id,
        currentPosition: findEntityByName(positions, 'IT Manager', 'Position')._id,
        bankName: 'CIMB Niaga',
        bankAccountNumber: '1234567894',
        bankAccountName: 'Rudi Hermawan',
        taxIdentificationNumber: '09.123.456.7-123.004',
        education: [
          {
            level: 'S1',
            institution: 'Institut Teknologi Bandung',
            major: 'Computer Science',
            startYear: 2006,
            endYear: 2010,
            gpa: 3.8
          }
        ],
        documents: [
          {
            type: 'KTP',
            number: '3175012345678905',
            issuedBy: 'Dukcapil Jakarta Selatan',
            issuedDate: new Date('2019-11-15'),
            expiryDate: new Date('2039-11-15'),
            verificationStatus: 'VERIFIED',
            verifiedBy: mongoose.Types.ObjectId(userId),
            verifiedAt: new Date()
          }
        ],
        assignmentHistory: [
          {
            branch: branches[0]._id, // Head Office
            division: findEntityByName(divisions, 'Information Technology', 'Division')._id,
            position: findEntityByName(positions, 'IT Manager', 'Position')._id,
            startDate: new Date('2020-05-01'),
            isActive: true
          }
        ],
        statusHistory: [
          {
            status: 'ACTIVE',
            startDate: new Date('2020-05-01'),
            changedBy: mongoose.Types.ObjectId(userId)
          }
        ],
        createdBy: mongoose.Types.ObjectId(userId),
        updatedBy: mongoose.Types.ObjectId(userId)
      }
    ];
    
    // Validate all employees before insertion
    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];
      // Check required fields
      if (!emp.joinDate) {
        logger.error(`Employee ${emp.employeeId} (${emp.fullName}) is missing joinDate`);
        throw new Error(`Employee ${emp.employeeId} is missing required field: joinDate`);
      }
      if (!emp.employmentStatus) {
        logger.error(`Employee ${emp.employeeId} (${emp.fullName}) is missing employmentStatus`);
        throw new Error(`Employee ${emp.employeeId} is missing required field: employmentStatus`);
      }
      if (!emp.currentBranch) {
        logger.error(`Employee ${emp.employeeId} (${emp.fullName}) is missing currentBranch`);
        emp.currentBranch = defaultBranch._id;
        logger.info(`Set default branch for ${emp.employeeId}`);
      }
      if (!emp.currentDivision) {
        logger.error(`Employee ${emp.employeeId} (${emp.fullName}) is missing currentDivision`);
        emp.currentDivision = defaultDivision._id;
        logger.info(`Set default division for ${emp.employeeId}`);
      }
      if (!emp.currentPosition) {
        logger.error(`Employee ${emp.employeeId} (${emp.fullName}) is missing currentPosition`);
        emp.currentPosition = defaultPosition._id;
        logger.info(`Set default position for ${emp.employeeId}`);
      }
    }
    
    // Insert employees with proper error handling
    try {
      await Employee.insertMany(employees);
      logger.info(`Successfully seeded ${employees.length} employees`);
    } catch (error) {
      logger.error('Error inserting employees:', error.message);
      if (error.errors) {
        // Log validation errors in detail
        Object.keys(error.errors).forEach(field => {
          logger.error(`Validation error for field '${field}': ${error.errors[field].message}`);
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error('Error seeding employees:', error);
    throw error;
  }
};

module.exports = {
  seedEmployees
};
