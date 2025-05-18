/**
 * Employee API Test
 * Tests the Employee Management API endpoints
 */

require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const { logger } = require('../utils');

// API URL
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// Test user for authentication
const TEST_USER = {
  username: 'admin',
  password: 'admin123'
};

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sarana-erp';

// Test data
let token = null;
let testEmployeeId = null;
let testDocumentId = null;

/**
 * Connect to MongoDB
 */
const connectToMongoDB = async () => {
  try {
    logger.info(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

/**
 * Authenticate and get token
 */
const authenticate = async () => {
  try {
    logger.info('Authenticating...');
    const response = await axios.post(`${API_URL}/auth/login`, TEST_USER);
    token = response.data.data.token;
    logger.info('Authentication successful');
  } catch (error) {
    logger.error('Authentication failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test creating an employee
 */
const testCreateEmployee = async () => {
  try {
    logger.info('Testing create employee...');
    
    // Get a branch, division, and position for the test
    const branchResponse = await axios.get(`${API_URL}/branches`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const branch = branchResponse.data.data[0];
    
    const divisionResponse = await axios.get(`${API_URL}/divisions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const division = divisionResponse.data.data[0];
    
    const positionResponse = await axios.get(`${API_URL}/positions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const position = positionResponse.data.data[0];
    
    const employeeData = {
      employeeId: `TEST${Date.now().toString().slice(-6)}`,
      firstName: 'Test',
      lastName: 'Employee',
      gender: 'MALE',
      dateOfBirth: '1990-01-01',
      placeOfBirth: 'Jakarta',
      nationality: 'Indonesia',
      maritalStatus: 'SINGLE',
      religion: 'ISLAM',
      addresses: [
        {
          street: 'Jl. Test No. 123',
          city: 'Jakarta',
          district: 'Jakarta Selatan',
          province: 'DKI Jakarta',
          postalCode: '12345',
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
          value: 'test.employee@samudrapaket.id',
          isPrimary: true
        }
      ],
      emergencyContacts: [
        {
          name: 'Emergency Contact',
          relationship: 'Parent',
          contacts: [
            {
              type: 'PHONE',
              value: '081234567891',
              isPrimary: true
            }
          ],
          address: {
            street: 'Jl. Emergency No. 456',
            city: 'Jakarta',
            district: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12345',
            country: 'Indonesia',
            isPrimary: true
          }
        }
      ],
      joinDate: '2023-01-01',
      employmentStatus: 'FULL_TIME',
      currentBranch: branch._id,
      currentDivision: division._id,
      currentPosition: position._id,
      education: [
        {
          level: 'S1',
          institution: 'Universitas Test',
          major: 'Computer Science',
          startYear: 2010,
          endYear: 2014,
          gpa: 3.5
        }
      ]
    };
    
    const response = await axios.post(`${API_URL}/employees`, employeeData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    testEmployeeId = response.data.data._id;
    logger.info(`Employee created with ID: ${testEmployeeId}`);
    logger.info('Create employee test passed');
  } catch (error) {
    logger.error('Create employee test failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test getting all employees
 */
const testGetEmployees = async () => {
  try {
    logger.info('Testing get employees...');
    
    const response = await axios.get(`${API_URL}/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    logger.info(`Retrieved ${response.data.data.length} employees`);
    logger.info('Get employees test passed');
  } catch (error) {
    logger.error('Get employees test failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test getting an employee by ID
 */
const testGetEmployeeById = async () => {
  try {
    logger.info(`Testing get employee by ID: ${testEmployeeId}...`);
    
    const response = await axios.get(`${API_URL}/employees/${testEmployeeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    logger.info(`Retrieved employee: ${response.data.data.fullName}`);
    logger.info('Get employee by ID test passed');
  } catch (error) {
    logger.error('Get employee by ID test failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test updating an employee
 */
const testUpdateEmployee = async () => {
  try {
    logger.info(`Testing update employee: ${testEmployeeId}...`);
    
    const updateData = {
      lastName: 'UpdatedLastName',
      maritalStatus: 'MARRIED'
    };
    
    const response = await axios.put(`${API_URL}/employees/${testEmployeeId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    logger.info(`Updated employee: ${response.data.data.fullName}`);
    logger.info('Update employee test passed');
  } catch (error) {
    logger.error('Update employee test failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test adding a document to an employee
 */
const testAddEmployeeDocument = async () => {
  try {
    logger.info(`Testing add employee document: ${testEmployeeId}...`);
    
    const documentData = {
      type: 'KTP',
      number: '1234567890123456',
      issuedBy: 'Dukcapil Jakarta',
      issuedDate: '2020-01-01',
      expiryDate: '2025-01-01',
      fileUrl: 'https://example.com/ktp.jpg',
      notes: 'Test document'
    };
    
    const response = await axios.post(`${API_URL}/employees/${testEmployeeId}/documents`, documentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    testDocumentId = response.data.data.documents[0]._id;
    logger.info(`Added document with ID: ${testDocumentId}`);
    logger.info('Add employee document test passed');
  } catch (error) {
    logger.error('Add employee document test failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test verifying an employee document
 */
const testVerifyEmployeeDocument = async () => {
  try {
    logger.info(`Testing verify employee document: ${testDocumentId}...`);
    
    const verificationData = {
      status: 'VERIFIED',
      notes: 'Document verified during testing'
    };
    
    const response = await axios.patch(
      `${API_URL}/employees/${testEmployeeId}/documents/${testDocumentId}/verify`,
      verificationData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    logger.info('Document verification status updated');
    logger.info('Verify employee document test passed');
  } catch (error) {
    logger.error('Verify employee document test failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test updating employee status
 */
const testUpdateEmployeeStatus = async () => {
  try {
    logger.info(`Testing update employee status: ${testEmployeeId}...`);
    
    const statusData = {
      status: 'ON_LEAVE',
      startDate: new Date().toISOString(),
      reason: 'Annual leave',
      notes: 'Employee on annual leave for 2 weeks'
    };
    
    const response = await axios.patch(`${API_URL}/employees/${testEmployeeId}/status`, statusData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    logger.info(`Updated employee status to: ${response.data.data.currentStatus}`);
    logger.info('Update employee status test passed');
  } catch (error) {
    logger.error('Update employee status test failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test adding employee skill
 */
const testAddEmployeeSkill = async () => {
  try {
    logger.info(`Testing add employee skill: ${testEmployeeId}...`);
    
    const skillData = {
      name: 'JavaScript',
      category: 'Programming',
      proficiencyLevel: 4,
      yearsOfExperience: 3,
      notes: 'Advanced JavaScript skills'
    };
    
    const response = await axios.post(`${API_URL}/employees/${testEmployeeId}/skills`, skillData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    logger.info('Added employee skill');
    logger.info('Add employee skill test passed');
  } catch (error) {
    logger.error('Add employee skill test failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test getting employee history
 */
const testGetEmployeeHistory = async () => {
  try {
    logger.info(`Testing get employee history: ${testEmployeeId}...`);
    
    const response = await axios.get(`${API_URL}/employees/${testEmployeeId}/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    logger.info(`Retrieved ${response.data.data.length} history entries`);
    logger.info('Get employee history test passed');
  } catch (error) {
    logger.error('Get employee history test failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test deleting an employee
 */
const testDeleteEmployee = async () => {
  try {
    logger.info(`Testing delete employee: ${testEmployeeId}...`);
    
    const response = await axios.delete(`${API_URL}/employees/${testEmployeeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    logger.info('Employee deleted successfully');
    logger.info('Delete employee test passed');
  } catch (error) {
    logger.error('Delete employee test failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Run all tests
 */
const runTests = async () => {
  try {
    logger.info('Starting Employee API tests...');
    
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Authenticate
    await authenticate();
    
    // Run tests
    await testCreateEmployee();
    await testGetEmployees();
    await testGetEmployeeById();
    await testUpdateEmployee();
    await testAddEmployeeDocument();
    await testVerifyEmployeeDocument();
    await testUpdateEmployeeStatus();
    await testAddEmployeeSkill();
    await testGetEmployeeHistory();
    await testDeleteEmployee();
    
    logger.info('All Employee API tests passed!');
    process.exit(0);
  } catch (error) {
    logger.error('Tests failed:', error);
    process.exit(1);
  }
};

// Export the runTests function
module.exports = {
  runTests
};

// Run the tests directly if this file is executed directly
if (require.main === module) {
  runTests();
}
