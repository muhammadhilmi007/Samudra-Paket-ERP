/**
 * Branch Repository Unit Tests
 */

const mongoose = require('mongoose');
const { Branch } = require('../../domain/models');
const branchRepository = require('../../infrastructure/repositories/branchRepository');

// Mock user ID for testing
const mockUserId = new mongoose.Types.ObjectId();

// Test branch data
const branchData = {
  code: 'TEST',
  name: 'Test Branch',
  type: 'BRANCH',
  parent: null,
  status: 'ACTIVE',
  address: {
    street: 'Test Street',
    city: 'Test City',
    province: 'Test Province',
    postalCode: '12345',
    country: 'Indonesia'
  },
  contactInfo: {
    phone: '123456789',
    email: 'test@example.com'
  },
  createdBy: mockUserId
};

describe('Branch Repository', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Branch.deleteMany({});
  });

  describe('createBranch', () => {
    it('should create a new branch', async () => {
      const branch = await branchRepository.createBranch(branchData);
      
      expect(branch._id).toBeDefined();
      expect(branch.code).toBe(branchData.code);
      expect(branch.name).toBe(branchData.name);
    });
  });

  describe('findById', () => {
    it('should find a branch by ID', async () => {
      const createdBranch = await branchRepository.createBranch(branchData);
      const foundBranch = await branchRepository.findById(createdBranch._id);
      
      expect(foundBranch).toBeDefined();
      expect(foundBranch._id.toString()).toBe(createdBranch._id.toString());
    });

    it('should return null for non-existent ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const foundBranch = await branchRepository.findById(nonExistentId);
      
      expect(foundBranch).toBeNull();
    });
  });

  describe('findByCode', () => {
    it('should find a branch by code', async () => {
      await branchRepository.createBranch(branchData);
      const foundBranch = await branchRepository.findByCode(branchData.code);
      
      expect(foundBranch).toBeDefined();
      expect(foundBranch.code).toBe(branchData.code);
    });

    it('should handle case insensitivity', async () => {
      await branchRepository.createBranch(branchData);
      const foundBranch = await branchRepository.findByCode(branchData.code.toLowerCase());
      
      expect(foundBranch).toBeDefined();
      expect(foundBranch.code).toBe(branchData.code);
    });
  });

  describe('findAll', () => {
    it('should return paginated branches', async () => {
      // Create multiple branches
      const branches = [
        { ...branchData },
        { ...branchData, code: 'TEST2', name: 'Test Branch 2' },
        { ...branchData, code: 'TEST3', name: 'Test Branch 3' }
      ];
      
      await Branch.create(branches);
      
      const result = await branchRepository.findAll({ page: 1, limit: 2 });
      
      expect(result.branches).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('should apply filters', async () => {
      // Create branches with different types
      const branches = [
        { ...branchData, type: 'HEAD_OFFICE' },
        { ...branchData, code: 'TEST2', name: 'Test Branch 2', type: 'REGIONAL' },
        { ...branchData, code: 'TEST3', name: 'Test Branch 3', type: 'BRANCH' }
      ];
      
      await Branch.create(branches);
      
      const result = await branchRepository.findAll({ 
        filter: { type: 'REGIONAL' },
        page: 1, 
        limit: 10 
      });
      
      expect(result.branches).toHaveLength(1);
      expect(result.branches[0].type).toBe('REGIONAL');
    });
  });

  describe('updateById', () => {
    it('should update a branch by ID', async () => {
      const createdBranch = await branchRepository.createBranch(branchData);
      
      const updateData = {
        name: 'Updated Branch Name',
        status: 'INACTIVE'
      };
      
      const updatedBranch = await branchRepository.updateById(createdBranch._id, updateData);
      
      expect(updatedBranch.name).toBe(updateData.name);
      expect(updatedBranch.status).toBe(updateData.status);
      expect(updatedBranch.code).toBe(createdBranch.code); // Unchanged field
    });
  });

  describe('deleteById', () => {
    it('should delete a branch by ID', async () => {
      const createdBranch = await branchRepository.createBranch(branchData);
      
      const deletedBranch = await branchRepository.deleteById(createdBranch._id);
      const foundBranch = await branchRepository.findById(createdBranch._id);
      
      expect(deletedBranch).toBeDefined();
      expect(deletedBranch._id.toString()).toBe(createdBranch._id.toString());
      expect(foundBranch).toBeNull();
    });
  });

  describe('getHierarchy', () => {
    it('should get full hierarchy starting from root branches', async () => {
      // Create root branch
      const rootBranch = await branchRepository.createBranch({
        ...branchData,
        code: 'ROOT',
        name: 'Root Branch'
      });
      
      // Create child branches
      const childBranch = await branchRepository.createBranch({
        ...branchData,
        code: 'CHILD',
        name: 'Child Branch',
        parent: rootBranch._id
      });
      
      // Create grandchild branch
      await branchRepository.createBranch({
        ...branchData,
        code: 'GRANDCHILD',
        name: 'Grandchild Branch',
        parent: childBranch._id
      });
      
      const hierarchy = await branchRepository.getHierarchy();
      
      expect(hierarchy).toHaveLength(1); // One root branch
      expect(hierarchy[0].code).toBe('ROOT');
      expect(hierarchy[0].children).toHaveLength(1); // One child
      expect(hierarchy[0].children[0].code).toBe('CHILD');
      expect(hierarchy[0].children[0].children).toHaveLength(1); // One grandchild
      expect(hierarchy[0].children[0].children[0].code).toBe('GRANDCHILD');
    });

    it('should get hierarchy starting from specific branch', async () => {
      // Create root branch
      const rootBranch = await branchRepository.createBranch({
        ...branchData,
        code: 'ROOT',
        name: 'Root Branch'
      });
      
      // Create child branches
      const childBranch = await branchRepository.createBranch({
        ...branchData,
        code: 'CHILD',
        name: 'Child Branch',
        parent: rootBranch._id
      });
      
      // Create grandchild branch
      await branchRepository.createBranch({
        ...branchData,
        code: 'GRANDCHILD',
        name: 'Grandchild Branch',
        parent: childBranch._id
      });
      
      const hierarchy = await branchRepository.getHierarchy(childBranch._id);
      
      expect(hierarchy.code).toBe('CHILD');
      expect(hierarchy.children).toHaveLength(1);
      expect(hierarchy.children[0].code).toBe('GRANDCHILD');
    });
  });

  describe('updateStatus', () => {
    it('should update branch status and add to history', async () => {
      const branch = await branchRepository.createBranch(branchData);
      
      const newStatus = 'INACTIVE';
      const reason = 'Test reason';
      
      const updatedBranch = await branchRepository.updateStatus(branch._id, newStatus, reason, mockUserId);
      
      expect(updatedBranch.status).toBe(newStatus);
      expect(updatedBranch.statusHistory).toHaveLength(1);
      expect(updatedBranch.statusHistory[0].status).toBe(newStatus);
      expect(updatedBranch.statusHistory[0].reason).toBe(reason);
      expect(updatedBranch.statusHistory[0].changedBy.toString()).toBe(mockUserId.toString());
    });
  });
});
