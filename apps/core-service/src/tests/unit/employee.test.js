/**
 * Employee Unit Tests
 * Tests for the Employee Management Service components
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Employee, EmployeeHistory } = require('../../domain/models');
const employeeRepository = require('../../infrastructure/repositories/employeeRepository');
const employeeHistoryRepository = require('../../infrastructure/repositories/employeeHistoryRepository');
const employeeUseCases = require('../../application/use-cases/employeeUseCases');
const { ApplicationError } = require('../../utils/errors');

// Mock user for testing
const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  username: 'testuser'
};

// Mock data
const mockEmployeeData = {
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
  currentBranch: new mongoose.Types.ObjectId(),
  currentDivision: new mongoose.Types.ObjectId(),
  currentPosition: new mongoose.Types.ObjectId(),
  createdBy: mockUser._id,
  updatedBy: mockUser._id
};

// Setup and teardown
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Employee.deleteMany({});
  await EmployeeHistory.deleteMany({});
});

describe('Employee Model', () => {
  it('should create an employee successfully', async () => {
    const employee = new Employee(mockEmployeeData);
    const savedEmployee = await employee.save();
    
    expect(savedEmployee._id).toBeDefined();
    expect(savedEmployee.employeeId).toBe(mockEmployeeData.employeeId);
    expect(savedEmployee.fullName).toBe('John Doe');
  });
  
  it('should calculate age correctly', async () => {
    const employee = new Employee({
      ...mockEmployeeData,
      dateOfBirth: new Date('1990-01-01')
    });
    
    const currentYear = new Date().getFullYear();
    const expectedAge = currentYear - 1990;
    
    expect(employee.age).toBeGreaterThanOrEqual(expectedAge - 1);
    expect(employee.age).toBeLessThanOrEqual(expectedAge);
  });
  
  it('should calculate years of service correctly', async () => {
    const employee = new Employee({
      ...mockEmployeeData,
      joinDate: new Date('2020-01-01')
    });
    
    const currentYear = new Date().getFullYear();
    const expectedYears = currentYear - 2020;
    
    expect(employee.yearsOfService).toBeGreaterThanOrEqual(expectedYears - 1);
    expect(employee.yearsOfService).toBeLessThanOrEqual(expectedYears);
  });
  
  it('should fail validation if required fields are missing', async () => {
    const employee = new Employee({
      firstName: 'John'
      // Missing required fields
    });
    
    await expect(employee.save()).rejects.toThrow();
  });
});

describe('Employee Repository', () => {
  let savedEmployee;
  
  beforeEach(async () => {
    const employee = new Employee(mockEmployeeData);
    savedEmployee = await employee.save();
  });
  
  it('should create an employee', async () => {
    const newEmployeeData = {
      ...mockEmployeeData,
      employeeId: 'EMP456',
      firstName: 'Jane',
      lastName: 'Smith'
    };
    
    const createdEmployee = await employeeRepository.createEmployee(newEmployeeData, mockUser);
    
    expect(createdEmployee._id).toBeDefined();
    expect(createdEmployee.employeeId).toBe('EMP456');
    expect(createdEmployee.fullName).toBe('Jane Smith');
  });
  
  it('should get employees with pagination', async () => {
    const result = await employeeRepository.getEmployees({}, { page: 1, limit: 10 });
    
    expect(result.data).toBeDefined();
    expect(result.pagination).toBeDefined();
    expect(result.data.length).toBe(1);
    expect(result.pagination.total).toBe(1);
  });
  
  it('should get employee by ID', async () => {
    const employee = await employeeRepository.getEmployeeById(savedEmployee._id);
    
    expect(employee._id.toString()).toBe(savedEmployee._id.toString());
    expect(employee.employeeId).toBe(savedEmployee.employeeId);
  });
  
  it('should get employee by employee ID', async () => {
    const employee = await employeeRepository.getEmployeeByEmployeeId(savedEmployee.employeeId);
    
    expect(employee._id.toString()).toBe(savedEmployee._id.toString());
    expect(employee.employeeId).toBe(savedEmployee.employeeId);
  });
  
  it('should update employee', async () => {
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name'
    };
    
    const updatedEmployee = await employeeRepository.updateEmployee(savedEmployee._id, updateData, mockUser);
    
    expect(updatedEmployee.firstName).toBe('Updated');
    expect(updatedEmployee.lastName).toBe('Name');
    expect(updatedEmployee.fullName).toBe('Updated Name');
  });
  
  it('should delete employee', async () => {
    await employeeRepository.deleteEmployee(savedEmployee._id);
    
    const employees = await Employee.find({});
    expect(employees.length).toBe(0);
  });
  
  it('should add employee document', async () => {
    const documentData = {
      type: 'KTP',
      number: '1234567890123456',
      issuedBy: 'Dukcapil Jakarta',
      issuedDate: new Date('2020-01-01'),
      expiryDate: new Date('2025-01-01')
    };
    
    const updatedEmployee = await employeeRepository.addEmployeeDocument(savedEmployee._id, documentData, mockUser);
    
    expect(updatedEmployee.documents.length).toBe(1);
    expect(updatedEmployee.documents[0].type).toBe('KTP');
    expect(updatedEmployee.documents[0].number).toBe('1234567890123456');
  });
  
  it('should add employee assignment', async () => {
    const assignmentData = {
      branch: new mongoose.Types.ObjectId(),
      division: new mongoose.Types.ObjectId(),
      position: new mongoose.Types.ObjectId(),
      startDate: new Date()
    };
    
    const updatedEmployee = await employeeRepository.addEmployeeAssignment(savedEmployee._id, assignmentData, mockUser);
    
    expect(updatedEmployee.assignmentHistory.length).toBe(1);
    expect(updatedEmployee.currentBranch.toString()).toBe(assignmentData.branch.toString());
    expect(updatedEmployee.currentDivision.toString()).toBe(assignmentData.division.toString());
    expect(updatedEmployee.currentPosition.toString()).toBe(assignmentData.position.toString());
  });
  
  it('should update employee status', async () => {
    const statusData = {
      status: 'ON_LEAVE',
      startDate: new Date(),
      reason: 'Annual leave'
    };
    
    const updatedEmployee = await employeeRepository.updateEmployeeStatus(savedEmployee._id, statusData, mockUser);
    
    expect(updatedEmployee.currentStatus).toBe('ON_LEAVE');
    expect(updatedEmployee.statusHistory.length).toBe(1);
    expect(updatedEmployee.statusHistory[0].status).toBe('ON_LEAVE');
    expect(updatedEmployee.statusHistory[0].reason).toBe('Annual leave');
  });
});

describe('Employee Use Cases', () => {
  let savedEmployee;
  
  beforeEach(async () => {
    const employee = new Employee(mockEmployeeData);
    savedEmployee = await employee.save();
  });
  
  it('should create an employee and record history', async () => {
    const newEmployeeData = {
      ...mockEmployeeData,
      employeeId: 'EMP789',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const createdEmployee = await employeeUseCases.createEmployee(newEmployeeData, mockUser);
    
    expect(createdEmployee._id).toBeDefined();
    expect(createdEmployee.employeeId).toBe('EMP789');
    
    // Check if history was recorded
    const history = await EmployeeHistory.findOne({ employeeId: createdEmployee._id });
    expect(history).toBeDefined();
    expect(history.changeType).toBe('CREATE');
  });
  
  it('should update an employee and record history', async () => {
    const updateData = {
      firstName: 'Updated',
      lastName: 'User'
    };
    
    const updatedEmployee = await employeeUseCases.updateEmployee(savedEmployee._id, updateData, mockUser);
    
    expect(updatedEmployee.firstName).toBe('Updated');
    expect(updatedEmployee.lastName).toBe('User');
    
    // Check if history was recorded
    const history = await EmployeeHistory.findOne({ 
      employeeId: savedEmployee._id,
      changeType: 'UPDATE'
    });
    expect(history).toBeDefined();
    expect(history.changedFields).toContain('firstName');
    expect(history.changedFields).toContain('lastName');
  });
  
  it('should add employee document and record history', async () => {
    const documentData = {
      type: 'NPWP',
      number: '12.345.678.9-123.000',
      issuedBy: 'Dirjen Pajak',
      issuedDate: new Date('2020-01-01')
    };
    
    const updatedEmployee = await employeeUseCases.addEmployeeDocument(savedEmployee._id, documentData, mockUser);
    
    expect(updatedEmployee.documents.length).toBe(1);
    expect(updatedEmployee.documents[0].type).toBe('NPWP');
    
    // Check if history was recorded
    const history = await EmployeeHistory.findOne({ 
      employeeId: savedEmployee._id,
      changeType: 'DOCUMENT_ADDED'
    });
    expect(history).toBeDefined();
  });
  
  it('should update employee status and record history', async () => {
    const statusData = {
      status: 'INACTIVE',
      startDate: new Date(),
      reason: 'Resigned'
    };
    
    const updatedEmployee = await employeeUseCases.updateEmployeeStatus(savedEmployee._id, statusData, mockUser);
    
    expect(updatedEmployee.currentStatus).toBe('INACTIVE');
    
    // Check if history was recorded
    const history = await EmployeeHistory.findOne({ 
      employeeId: savedEmployee._id,
      changeType: 'STATUS_CHANGE'
    });
    expect(history).toBeDefined();
    expect(history.newValue.currentStatus).toBe('INACTIVE');
  });
  
  it('should delete an employee and record history', async () => {
    await employeeUseCases.deleteEmployee(savedEmployee._id, mockUser);
    
    // Check if employee was deleted
    const employee = await Employee.findById(savedEmployee._id);
    expect(employee).toBeNull();
    
    // Check if history was recorded
    const history = await EmployeeHistory.findOne({ 
      employeeId: savedEmployee._id,
      changeType: 'DELETE'
    });
    expect(history).toBeDefined();
  });
});

describe('Employee History Repository', () => {
  let employee;
  let historyEntry;
  
  beforeEach(async () => {
    // Create employee
    const employeeModel = new Employee(mockEmployeeData);
    employee = await employeeModel.save();
    
    // Create history entry
    const historyData = {
      employeeId: employee._id,
      changeType: 'CREATE',
      description: `Employee ${employee.employeeId} created`,
      newValue: employee,
      changedBy: mockUser._id,
      timestamp: new Date()
    };
    
    const historyModel = new EmployeeHistory(historyData);
    historyEntry = await historyModel.save();
  });
  
  it('should create employee history', async () => {
    const historyData = {
      employeeId: employee._id,
      changeType: 'UPDATE',
      description: 'Employee updated',
      changedFields: ['firstName', 'lastName'],
      previousValue: { firstName: 'John', lastName: 'Doe' },
      newValue: { firstName: 'Updated', lastName: 'Name' },
      changedBy: mockUser._id,
      timestamp: new Date()
    };
    
    const createdHistory = await employeeHistoryRepository.createEmployeeHistory(historyData);
    
    expect(createdHistory._id).toBeDefined();
    expect(createdHistory.changeType).toBe('UPDATE');
    expect(createdHistory.changedFields).toContain('firstName');
  });
  
  it('should get employee history', async () => {
    const result = await employeeHistoryRepository.getEmployeeHistory(employee._id);
    
    expect(result.data).toBeDefined();
    expect(result.pagination).toBeDefined();
    expect(result.data.length).toBe(1);
    expect(result.data[0].changeType).toBe('CREATE');
  });
  
  it('should get history by ID', async () => {
    const history = await employeeHistoryRepository.getHistoryById(historyEntry._id);
    
    expect(history._id.toString()).toBe(historyEntry._id.toString());
    expect(history.changeType).toBe(historyEntry.changeType);
  });
  
  it('should get history by change type', async () => {
    const result = await employeeHistoryRepository.getHistoryByChangeType('CREATE');
    
    expect(result.data).toBeDefined();
    expect(result.data.length).toBe(1);
    expect(result.data[0].changeType).toBe('CREATE');
  });
  
  it('should get history by date range', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    
    const result = await employeeHistoryRepository.getHistoryByDateRange(startDate, endDate);
    
    expect(result.data).toBeDefined();
    expect(result.data.length).toBe(1);
  });
  
  it('should get history by user', async () => {
    const result = await employeeHistoryRepository.getHistoryByUser(mockUser._id);
    
    expect(result.data).toBeDefined();
    expect(result.data.length).toBe(1);
    expect(result.data[0].changedBy.toString()).toBe(mockUser._id.toString());
  });
});
