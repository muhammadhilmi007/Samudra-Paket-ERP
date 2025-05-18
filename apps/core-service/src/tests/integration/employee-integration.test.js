/**
 * Employee Integration Tests
 * Integration tests for the Employee Management Service
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const bodyParser = require('body-parser');
const { Employee, EmployeeHistory, Branch, Division, Position } = require('../../domain/models');
const employeeRoutes = require('../../api/routes/employeeRoutes');
const { authenticate, authorize } = require('../../api/middlewares/auth');
const validator = require('../../api/middlewares/validator');
const errorHandler = require('../../api/middlewares/errorHandler');

// Mock data
let mockBranch;
let mockDivision;
let mockPosition;
let mockEmployee;
let mockToken;
let mockUserId;

// Mock authentication middleware
jest.mock('../../api/middlewares/auth', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = {
      _id: mockUserId,
      username: 'testuser',
      role: 'admin'
    };
    next();
  }),
  authorize: jest.fn(() => (req, res, next) => next())
}));

// Setup express app for testing
const app = express();
app.use(bodyParser.json());
app.use('/api/employees', employeeRoutes);
app.use(errorHandler);

// Setup and teardown
let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  // Create mock user ID
  mockUserId = new mongoose.Types.ObjectId();
  
  // Create mock token
  mockToken = 'mock-token';
  
  // Create mock branch, division, and position
  mockBranch = await Branch.create({
    name: 'Test Branch',
    code: 'TB',
    address: {
      street: 'Test Street',
      city: 'Test City',
      district: 'Test District',
      province: 'Test Province',
      postalCode: '12345',
      country: 'Indonesia'
    },
    status: 'ACTIVE',
    createdBy: mockUserId
  });
  
  mockDivision = await Division.create({
    name: 'Test Division',
    code: 'TD',
    description: 'Test Division Description',
    status: 'ACTIVE',
    level: 0,
    path: 'TD',
    createdBy: mockUserId
  });
  
  mockPosition = await Position.create({
    name: 'Test Position',
    code: 'TP',
    division: mockDivision._id,
    description: 'Test Position Description',
    level: 0,
    status: 'ACTIVE',
    createdBy: mockUserId
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Employee.deleteMany({});
  await EmployeeHistory.deleteMany({});
  
  // Create mock employee
  mockEmployee = await Employee.create({
    employeeId: 'EMP123',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    gender: 'MALE',
    dateOfBirth: new Date('1990-01-01'),
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
        value: 'john.doe@example.com',
        isPrimary: true
      }
    ],
    emergencyContacts: [
      {
        name: 'Jane Doe',
        relationship: 'Spouse',
        contacts: [
          {
            type: 'PHONE',
            value: '081234567891',
            isPrimary: true
          }
        ],
        address: {
          street: 'Jl. Test No. 123',
          city: 'Jakarta',
          district: 'Jakarta Selatan',
          province: 'DKI Jakarta',
          postalCode: '12345',
          country: 'Indonesia',
          isPrimary: true
        }
      }
    ],
    joinDate: new Date('2023-01-01'),
    employmentStatus: 'FULL_TIME',
    currentStatus: 'ACTIVE',
    currentBranch: mockBranch._id,
    currentDivision: mockDivision._id,
    currentPosition: mockPosition._id,
    createdBy: mockUserId,
    updatedBy: mockUserId
  });
});

describe('Employee API Integration Tests', () => {
  describe('GET /api/employees', () => {
    it('should get all employees', async () => {
      const response = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${mockToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].employeeId).toBe('EMP123');
    });
    
    it('should filter employees by name', async () => {
      const response = await request(app)
        .get('/api/employees?name=John')
        .set('Authorization', `Bearer ${mockToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      
      const emptyResponse = await request(app)
        .get('/api/employees?name=NonExistent')
        .set('Authorization', `Bearer ${mockToken}`);
      
      expect(emptyResponse.status).toBe(200);
      expect(emptyResponse.body.data.length).toBe(0);
    });
  });
  
  describe('GET /api/employees/:id', () => {
    it('should get employee by ID', async () => {
      const response = await request(app)
        .get(`/api/employees/${mockEmployee._id}`)
        .set('Authorization', `Bearer ${mockToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.employeeId).toBe('EMP123');
      expect(response.body.data.fullName).toBe('John Doe');
    });
    
    it('should return 404 for non-existent employee', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/employees/${nonExistentId}`)
        .set('Authorization', `Bearer ${mockToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const newEmployeeData = {
        employeeId: 'EMP456',
        firstName: 'Jane',
        lastName: 'Smith',
        gender: 'FEMALE',
        dateOfBirth: '1992-05-15',
        placeOfBirth: 'Bandung',
        nationality: 'Indonesia',
        maritalStatus: 'SINGLE',
        religion: 'ISLAM',
        addresses: [
          {
            street: 'Jl. Test No. 456',
            city: 'Bandung',
            district: 'Bandung Selatan',
            province: 'Jawa Barat',
            postalCode: '40123',
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
            value: 'jane.smith@example.com',
            isPrimary: true
          }
        ],
        emergencyContacts: [
          {
            name: 'John Smith',
            relationship: 'Parent',
            contacts: [
              {
                type: 'PHONE',
                value: '081234567893',
                isPrimary: true
              }
            ],
            address: {
              street: 'Jl. Test No. 456',
              city: 'Bandung',
              district: 'Bandung Selatan',
              province: 'Jawa Barat',
              postalCode: '40123',
              country: 'Indonesia',
              isPrimary: true
            }
          }
        ],
        joinDate: '2023-02-01',
        employmentStatus: 'FULL_TIME',
        currentBranch: mockBranch._id,
        currentDivision: mockDivision._id,
        currentPosition: mockPosition._id
      };
      
      const response = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(newEmployeeData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.employeeId).toBe('EMP456');
      expect(response.body.data.fullName).toBe('Jane Smith');
      
      // Check if employee was created in database
      const createdEmployee = await Employee.findOne({ employeeId: 'EMP456' });
      expect(createdEmployee).toBeTruthy();
      expect(createdEmployee.fullName).toBe('Jane Smith');
      
      // Check if history was recorded
      const history = await EmployeeHistory.findOne({ 
        employeeId: createdEmployee._id,
        changeType: 'CREATE'
      });
      expect(history).toBeTruthy();
    });
    
    it('should return validation error for invalid data', async () => {
      const invalidData = {
        firstName: 'Jane',
        // Missing required fields
      };
      
      const response = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('PUT /api/employees/:id', () => {
    it('should update an employee', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        maritalStatus: 'MARRIED'
      };
      
      const response = await request(app)
        .put(`/api/employees/${mockEmployee._id}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('Updated');
      expect(response.body.data.lastName).toBe('Name');
      expect(response.body.data.fullName).toBe('Updated Name');
      expect(response.body.data.maritalStatus).toBe('MARRIED');
      
      // Check if employee was updated in database
      const updatedEmployee = await Employee.findById(mockEmployee._id);
      expect(updatedEmployee.firstName).toBe('Updated');
      expect(updatedEmployee.lastName).toBe('Name');
      expect(updatedEmployee.maritalStatus).toBe('MARRIED');
      
      // Check if history was recorded
      const history = await EmployeeHistory.findOne({ 
        employeeId: mockEmployee._id,
        changeType: 'UPDATE'
      });
      expect(history).toBeTruthy();
    });
  });
  
  describe('DELETE /api/employees/:id', () => {
    it('should delete an employee', async () => {
      const response = await request(app)
        .delete(`/api/employees/${mockEmployee._id}`)
        .set('Authorization', `Bearer ${mockToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Check if employee was deleted from database
      const deletedEmployee = await Employee.findById(mockEmployee._id);
      expect(deletedEmployee).toBeNull();
      
      // Check if history was recorded
      const history = await EmployeeHistory.findOne({ 
        employeeId: mockEmployee._id,
        changeType: 'DELETE'
      });
      expect(history).toBeTruthy();
    });
  });
  
  describe('POST /api/employees/:id/documents', () => {
    it('should add a document to an employee', async () => {
      const documentData = {
        type: 'KTP',
        number: '1234567890123456',
        issuedBy: 'Dukcapil Jakarta',
        issuedDate: '2020-01-01',
        expiryDate: '2025-01-01'
      };
      
      const response = await request(app)
        .post(`/api/employees/${mockEmployee._id}/documents`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send(documentData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.documents).toBeInstanceOf(Array);
      expect(response.body.data.documents.length).toBe(1);
      expect(response.body.data.documents[0].type).toBe('KTP');
      expect(response.body.data.documents[0].number).toBe('1234567890123456');
      
      // Check if document was added in database
      const updatedEmployee = await Employee.findById(mockEmployee._id);
      expect(updatedEmployee.documents.length).toBe(1);
      expect(updatedEmployee.documents[0].type).toBe('KTP');
      
      // Check if history was recorded
      const history = await EmployeeHistory.findOne({ 
        employeeId: mockEmployee._id,
        changeType: 'DOCUMENT_ADDED'
      });
      expect(history).toBeTruthy();
    });
  });
  
  describe('PATCH /api/employees/:id/status', () => {
    it('should update employee status', async () => {
      const statusData = {
        status: 'ON_LEAVE',
        startDate: new Date().toISOString(),
        reason: 'Annual leave',
        notes: 'Employee on annual leave for 2 weeks'
      };
      
      const response = await request(app)
        .patch(`/api/employees/${mockEmployee._id}/status`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send(statusData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.currentStatus).toBe('ON_LEAVE');
      expect(response.body.data.statusHistory).toBeInstanceOf(Array);
      expect(response.body.data.statusHistory.length).toBe(1);
      expect(response.body.data.statusHistory[0].status).toBe('ON_LEAVE');
      expect(response.body.data.statusHistory[0].reason).toBe('Annual leave');
      
      // Check if status was updated in database
      const updatedEmployee = await Employee.findById(mockEmployee._id);
      expect(updatedEmployee.currentStatus).toBe('ON_LEAVE');
      expect(updatedEmployee.statusHistory.length).toBe(1);
      
      // Check if history was recorded
      const history = await EmployeeHistory.findOne({ 
        employeeId: mockEmployee._id,
        changeType: 'STATUS_CHANGE'
      });
      expect(history).toBeTruthy();
    });
  });
  
  describe('POST /api/employees/:id/skills', () => {
    it('should add a skill to an employee', async () => {
      const skillData = {
        name: 'JavaScript',
        category: 'Programming',
        proficiencyLevel: 4,
        yearsOfExperience: 3,
        notes: 'Advanced JavaScript skills'
      };
      
      const response = await request(app)
        .post(`/api/employees/${mockEmployee._id}/skills`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send(skillData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.skills).toBeInstanceOf(Array);
      expect(response.body.data.skills.length).toBe(1);
      expect(response.body.data.skills[0].name).toBe('JavaScript');
      expect(response.body.data.skills[0].proficiencyLevel).toBe(4);
      
      // Check if skill was added in database
      const updatedEmployee = await Employee.findById(mockEmployee._id);
      expect(updatedEmployee.skills.length).toBe(1);
      expect(updatedEmployee.skills[0].name).toBe('JavaScript');
      
      // Check if history was recorded
      const history = await EmployeeHistory.findOne({ 
        employeeId: mockEmployee._id,
        changeType: 'SKILL_ADDED'
      });
      expect(history).toBeTruthy();
    });
  });
});
