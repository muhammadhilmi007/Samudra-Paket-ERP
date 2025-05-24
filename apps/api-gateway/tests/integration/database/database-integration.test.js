/**
 * Database Integration Testing
 * Tests database operations and data integrity
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai');
const sinon = require('sinon');

// Import models
const Employee = require('../../../models/Employee');
const Branch = require('../../../models/Branch');
const Shipment = require('../../../models/Shipment');
const User = require('../../../models/User');

// Import repositories
const EmployeeRepository = require('../../../infrastructure/repositories/EmployeeRepository');
const BranchRepository = require('../../../infrastructure/repositories/BranchRepository');
const ShipmentRepository = require('../../../infrastructure/repositories/ShipmentRepository');
const UserRepository = require('../../../infrastructure/repositories/UserRepository');

// Test data
const testEmployee = {
  fullName: 'Test Employee',
  employeeId: 'EMP-TEST-001',
  position: 'Software Engineer',
  department: 'Engineering',
  email: 'test.employee@example.com',
  phone: '081234567890',
  joinDate: new Date(),
  status: 'active'
};

const testBranch = {
  name: 'Test Branch',
  code: 'TST-01',
  address: 'Test Address',
  phone: '021-5551234',
  email: 'test.branch@example.com',
  manager: 'Test Manager',
  status: 'active',
  type: 'branch',
  coordinates: { lat: -6.2088, lng: 106.8456 }
};

const testShipment = {
  trackingNumber: 'TRK-TEST-001',
  sender: {
    name: 'Test Sender',
    address: 'Sender Address',
    phone: '081234567890'
  },
  recipient: {
    name: 'Test Recipient',
    address: 'Recipient Address',
    phone: '081234567891'
  },
  status: 'pending',
  service: 'regular',
  weight: 1.5,
  dimensions: {
    length: 10,
    width: 10,
    height: 10
  },
  price: 15000
};

const testUser = {
  name: 'Test User',
  email: 'test.user@example.com',
  password: 'Password123!',
  role: 'employee'
};

describe('Database Integration Tests', () => {
  let mongoServer;
  let employeeRepo, branchRepo, shipmentRepo, userRepo;

  before(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to in-memory database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Initialize repositories
    employeeRepo = new EmployeeRepository();
    branchRepo = new BranchRepository();
    shipmentRepo = new ShipmentRepository();
    userRepo = new UserRepository();
  });

  after(async () => {
    // Disconnect and stop MongoDB server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all collections before each test
    await Employee.deleteMany({});
    await Branch.deleteMany({});
    await Shipment.deleteMany({});
    await User.deleteMany({});
  });

  describe('Employee Repository Tests', () => {
    it('should create an employee', async () => {
      const employee = await employeeRepo.create(testEmployee);
      
      expect(employee).to.have.property('id');
      expect(employee.fullName).to.equal(testEmployee.fullName);
      expect(employee.employeeId).to.equal(testEmployee.employeeId);
      expect(employee.position).to.equal(testEmployee.position);
      
      // Verify employee was saved to database
      const savedEmployee = await Employee.findById(employee.id);
      expect(savedEmployee).to.not.be.null;
      expect(savedEmployee.fullName).to.equal(testEmployee.fullName);
    });

    it('should find employee by ID', async () => {
      const createdEmployee = await employeeRepo.create(testEmployee);
      const foundEmployee = await employeeRepo.findById(createdEmployee.id);
      
      expect(foundEmployee).to.not.be.null;
      expect(foundEmployee.id).to.equal(createdEmployee.id);
      expect(foundEmployee.fullName).to.equal(testEmployee.fullName);
    });

    it('should update employee', async () => {
      const createdEmployee = await employeeRepo.create(testEmployee);
      const updatedData = {
        fullName: 'Updated Employee Name',
        position: 'Senior Developer'
      };
      
      const updatedEmployee = await employeeRepo.update(createdEmployee.id, updatedData);
      
      expect(updatedEmployee).to.not.be.null;
      expect(updatedEmployee.fullName).to.equal(updatedData.fullName);
      expect(updatedEmployee.position).to.equal(updatedData.position);
      expect(updatedEmployee.email).to.equal(testEmployee.email); // Unchanged field
      
      // Verify update was saved to database
      const savedEmployee = await Employee.findById(createdEmployee.id);
      expect(savedEmployee.fullName).to.equal(updatedData.fullName);
    });

    it('should delete employee', async () => {
      const createdEmployee = await employeeRepo.create(testEmployee);
      await employeeRepo.delete(createdEmployee.id);
      
      // Verify employee was deleted from database
      const deletedEmployee = await Employee.findById(createdEmployee.id);
      expect(deletedEmployee).to.be.null;
    });

    it('should find employees with pagination', async () => {
      // Create multiple employees
      const employees = [];
      for (let i = 0; i < 15; i++) {
        employees.push({
          ...testEmployee,
          fullName: `Test Employee ${i}`,
          employeeId: `EMP-TEST-${i.toString().padStart(3, '0')}`,
          email: `test.employee${i}@example.com`
        });
      }
      
      await Employee.insertMany(employees);
      
      // Test pagination - page 1
      const page1Result = await employeeRepo.findAll({ page: 1, limit: 10 });
      expect(page1Result.data).to.have.length(10);
      expect(page1Result.pagination.total).to.equal(15);
      expect(page1Result.pagination.page).to.equal(1);
      expect(page1Result.pagination.limit).to.equal(10);
      expect(page1Result.pagination.pages).to.equal(2);
      
      // Test pagination - page 2
      const page2Result = await employeeRepo.findAll({ page: 2, limit: 10 });
      expect(page2Result.data).to.have.length(5);
      expect(page2Result.pagination.page).to.equal(2);
    });

    it('should find employees with filtering', async () => {
      // Create employees with different departments
      await Employee.insertMany([
        { ...testEmployee, department: 'Engineering' },
        { ...testEmployee, fullName: 'HR Employee', department: 'HR', email: 'hr@example.com' },
        { ...testEmployee, fullName: 'Finance Employee', department: 'Finance', email: 'finance@example.com' }
      ]);
      
      // Test filtering by department
      const result = await employeeRepo.findAll({ department: 'Engineering' });
      expect(result.data).to.have.length(1);
      expect(result.data[0].department).to.equal('Engineering');
      
      // Test filtering by name
      const nameResult = await employeeRepo.findAll({ search: 'HR' });
      expect(nameResult.data).to.have.length(1);
      expect(nameResult.data[0].fullName).to.equal('HR Employee');
    });
  });

  describe('Branch Repository Tests', () => {
    it('should create a branch', async () => {
      const branch = await branchRepo.create(testBranch);
      
      expect(branch).to.have.property('id');
      expect(branch.name).to.equal(testBranch.name);
      expect(branch.code).to.equal(testBranch.code);
      
      // Verify branch was saved to database
      const savedBranch = await Branch.findById(branch.id);
      expect(savedBranch).to.not.be.null;
      expect(savedBranch.name).to.equal(testBranch.name);
    });

    it('should find branch by ID', async () => {
      const createdBranch = await branchRepo.create(testBranch);
      const foundBranch = await branchRepo.findById(createdBranch.id);
      
      expect(foundBranch).to.not.be.null;
      expect(foundBranch.id).to.equal(createdBranch.id);
      expect(foundBranch.name).to.equal(testBranch.name);
    });

    it('should update branch', async () => {
      const createdBranch = await branchRepo.create(testBranch);
      const updatedData = {
        name: 'Updated Branch Name',
        manager: 'New Manager'
      };
      
      const updatedBranch = await branchRepo.update(createdBranch.id, updatedData);
      
      expect(updatedBranch).to.not.be.null;
      expect(updatedBranch.name).to.equal(updatedData.name);
      expect(updatedBranch.manager).to.equal(updatedData.manager);
      expect(updatedBranch.code).to.equal(testBranch.code); // Unchanged field
      
      // Verify update was saved to database
      const savedBranch = await Branch.findById(createdBranch.id);
      expect(savedBranch.name).to.equal(updatedData.name);
    });

    it('should delete branch', async () => {
      const createdBranch = await branchRepo.create(testBranch);
      await branchRepo.delete(createdBranch.id);
      
      // Verify branch was deleted from database
      const deletedBranch = await Branch.findById(createdBranch.id);
      expect(deletedBranch).to.be.null;
    });
  });

  describe('Shipment Repository Tests', () => {
    it('should create a shipment', async () => {
      const shipment = await shipmentRepo.create(testShipment);
      
      expect(shipment).to.have.property('id');
      expect(shipment.trackingNumber).to.equal(testShipment.trackingNumber);
      expect(shipment.sender.name).to.equal(testShipment.sender.name);
      expect(shipment.recipient.name).to.equal(testShipment.recipient.name);
      
      // Verify shipment was saved to database
      const savedShipment = await Shipment.findById(shipment.id);
      expect(savedShipment).to.not.be.null;
      expect(savedShipment.trackingNumber).to.equal(testShipment.trackingNumber);
    });

    it('should find shipment by tracking number', async () => {
      await shipmentRepo.create(testShipment);
      const foundShipment = await shipmentRepo.findByTrackingNumber(testShipment.trackingNumber);
      
      expect(foundShipment).to.not.be.null;
      expect(foundShipment.trackingNumber).to.equal(testShipment.trackingNumber);
      expect(foundShipment.sender.name).to.equal(testShipment.sender.name);
    });

    it('should update shipment status', async () => {
      const createdShipment = await shipmentRepo.create(testShipment);
      const updatedStatus = 'in_transit';
      
      const updatedShipment = await shipmentRepo.updateStatus(createdShipment.id, updatedStatus);
      
      expect(updatedShipment).to.not.be.null;
      expect(updatedShipment.status).to.equal(updatedStatus);
      
      // Verify update was saved to database
      const savedShipment = await Shipment.findById(createdShipment.id);
      expect(savedShipment.status).to.equal(updatedStatus);
    });
  });

  describe('User Repository Tests', () => {
    it('should create a user with hashed password', async () => {
      const user = await userRepo.create(testUser);
      
      expect(user).to.have.property('id');
      expect(user.name).to.equal(testUser.name);
      expect(user.email).to.equal(testUser.email);
      expect(user.role).to.equal(testUser.role);
      
      // Password should be hashed
      expect(user.password).to.not.equal(testUser.password);
      
      // Verify user was saved to database
      const savedUser = await User.findById(user.id);
      expect(savedUser).to.not.be.null;
      expect(savedUser.email).to.equal(testUser.email);
    });

    it('should find user by email', async () => {
      await userRepo.create(testUser);
      const foundUser = await userRepo.findByEmail(testUser.email);
      
      expect(foundUser).to.not.be.null;
      expect(foundUser.email).to.equal(testUser.email);
      expect(foundUser.name).to.equal(testUser.name);
    });

    it('should validate user password', async () => {
      const user = await userRepo.create(testUser);
      
      // Valid password
      const isValidPassword = await userRepo.validatePassword(user.id, testUser.password);
      expect(isValidPassword).to.be.true;
      
      // Invalid password
      const isInvalidPassword = await userRepo.validatePassword(user.id, 'WrongPassword123!');
      expect(isInvalidPassword).to.be.false;
    });
  });

  describe('Transaction and Rollback Tests', () => {
    it('should commit transaction when all operations succeed', async () => {
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Create employee and branch in a transaction
        const employee = await Employee.create([testEmployee], { session }).then(res => res[0]);
        const branch = await Branch.create([testBranch], { session }).then(res => res[0]);
        
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        
        // Verify both documents were saved
        const savedEmployee = await Employee.findById(employee._id);
        const savedBranch = await Branch.findById(branch._id);
        
        expect(savedEmployee).to.not.be.null;
        expect(savedBranch).to.not.be.null;
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    });

    it('should rollback transaction when an operation fails', async () => {
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Create employee successfully
        const employee = await Employee.create([testEmployee], { session }).then(res => res[0]);
        
        // Force an error by creating a branch with invalid data
        const invalidBranch = { ...testBranch, type: 'invalid_type' };
        
        try {
          await Branch.create([invalidBranch], { session });
          // Should not reach here
          expect.fail('Should have thrown validation error');
        } catch (error) {
          // Expected validation error
          await session.abortTransaction();
          session.endSession();
          
          // Verify employee was not saved due to rollback
          const savedEmployee = await Employee.findById(employee._id);
          expect(savedEmployee).to.be.null;
        }
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    });
  });

  describe('Indexing and Query Performance Tests', () => {
    it('should use indexes for efficient queries', async () => {
      // Create many employees
      const employees = [];
      for (let i = 0; i < 100; i++) {
        employees.push({
          ...testEmployee,
          fullName: `Test Employee ${i}`,
          employeeId: `EMP-TEST-${i.toString().padStart(3, '0')}`,
          email: `test.employee${i}@example.com`,
          department: i % 3 === 0 ? 'Engineering' : i % 3 === 1 ? 'HR' : 'Finance'
        });
      }
      
      await Employee.insertMany(employees);
      
      // Use explain to check query plan
      const queryPlan = await Employee.find({ department: 'Engineering' }).explain('executionStats');
      
      // Check if index was used (totalDocsExamined should be less than total docs)
      expect(queryPlan.executionStats.totalDocsExamined).to.be.at.most(50);
      
      // Check query execution time
      expect(queryPlan.executionStats.executionTimeMillis).to.be.lessThan(100);
    });
  });

  describe('Data Integrity Tests', () => {
    it('should enforce unique constraints', async () => {
      // Create an employee
      await employeeRepo.create(testEmployee);
      
      // Try to create another employee with the same employeeId
      try {
        await employeeRepo.create({
          ...testEmployee,
          fullName: 'Another Employee',
          email: 'another.employee@example.com'
        });
        // Should not reach here
        expect.fail('Should have thrown duplicate key error');
      } catch (error) {
        expect(error.name).to.equal('MongoError');
        expect(error.code).to.equal(11000); // Duplicate key error code
      }
    });

    it('should enforce required fields', async () => {
      // Try to create an employee without required fields
      try {
        await Employee.create({
          position: 'Software Engineer',
          department: 'Engineering'
        });
        // Should not reach here
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('ValidationError');
        expect(error.errors).to.have.property('fullName');
        expect(error.errors).to.have.property('employeeId');
      }
    });

    it('should enforce field type validation', async () => {
      // Try to create a shipment with invalid weight (string instead of number)
      try {
        await Shipment.create({
          ...testShipment,
          weight: 'not a number'
        });
        // Should not reach here
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('ValidationError');
        expect(error.errors).to.have.property('weight');
      }
    });
  });
});
