/**
 * Branch API Integration Tests
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const { Branch } = require('../../domain/models');
const jwt = require('jsonwebtoken');

// Mock user for testing
const mockUser = {
  id: new mongoose.Types.ObjectId(),
  email: 'test@example.com',
  name: 'Test User',
  permissions: ['branch:create', 'branch:read', 'branch:update', 'branch:delete']
};

// Generate mock JWT token
const generateToken = () => {
  return jwt.sign(
    { id: mockUser.id, email: mockUser.email, permissions: mockUser.permissions },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

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
  operationalHours: [
    { day: 'MONDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    { day: 'TUESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    { day: 'WEDNESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    { day: 'THURSDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    { day: 'FRIDAY', isOpen: true, openTime: '08:00', closeTime: '16:00' },
    { day: 'SATURDAY', isOpen: true, openTime: '09:00', closeTime: '13:00' },
    { day: 'SUNDAY', isOpen: false, openTime: '', closeTime: '' }
  ]
};

describe('Branch API', () => {
  let token;
  let createdBranchId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Generate token
    token = generateToken();
  });

  afterAll(async () => {
    // Clean up database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear branches collection
    await Branch.deleteMany({});
  });

  describe('POST /api/branches', () => {
    it('should create a new branch', async () => {
      const res = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...branchData,
          createdBy: mockUser.id
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.code).toBe(branchData.code);
      expect(res.body.data.name).toBe(branchData.name);
      
      // Save branch ID for later tests
      createdBranchId = res.body.data._id;
    });

    it('should return validation error for missing required fields', async () => {
      const res = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: 'TEST2',
          name: 'Test Branch 2'
          // Missing required fields
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Validation error');
    });

    it('should return error for duplicate branch code', async () => {
      // Create first branch
      await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...branchData,
          createdBy: mockUser.id
        });
      
      // Try to create branch with same code
      const res = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...branchData,
          name: 'Different Name',
          createdBy: mockUser.id
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('GET /api/branches', () => {
    beforeEach(async () => {
      // Create test branches
      const branches = [
        { ...branchData, code: 'TEST1', name: 'Test Branch 1', createdBy: mockUser.id },
        { ...branchData, code: 'TEST2', name: 'Test Branch 2', createdBy: mockUser.id },
        { ...branchData, code: 'TEST3', name: 'Test Branch 3', createdBy: mockUser.id }
      ];
      
      await Branch.create(branches);
    });

    it('should get paginated list of branches', async () => {
      const res = await request(app)
        .get('/api/branches')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 2 });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(3);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(2);
      expect(res.body.pagination.totalPages).toBe(2);
    });

    it('should filter branches by type', async () => {
      // Create branch with different type
      await Branch.create({
        ...branchData,
        code: 'HEAD',
        name: 'Head Office',
        type: 'HEAD_OFFICE',
        createdBy: mockUser.id
      });
      
      const res = await request(app)
        .get('/api/branches')
        .set('Authorization', `Bearer ${token}`)
        .query({ type: 'HEAD_OFFICE' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].type).toBe('HEAD_OFFICE');
    });
  });

  describe('GET /api/branches/:id', () => {
    let branchId;
    
    beforeEach(async () => {
      // Create test branch
      const branch = new Branch({
        ...branchData,
        createdBy: mockUser.id
      });
      await branch.save();
      branchId = branch._id;
    });

    it('should get branch by ID', async () => {
      const res = await request(app)
        .get(`/api/branches/${branchId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data._id).toBe(branchId.toString());
      expect(res.body.data.code).toBe(branchData.code);
    });

    it('should return 404 for non-existent branch', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/branches/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/branches/:id', () => {
    let branchId;
    
    beforeEach(async () => {
      // Create test branch
      const branch = new Branch({
        ...branchData,
        createdBy: mockUser.id
      });
      await branch.save();
      branchId = branch._id;
    });

    it('should update branch by ID', async () => {
      const updateData = {
        name: 'Updated Branch Name',
        status: 'INACTIVE',
        address: {
          ...branchData.address,
          street: 'Updated Street'
        }
      };
      
      const res = await request(app)
        .put(`/api/branches/${branchId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.name).toBe(updateData.name);
      expect(res.body.data.status).toBe(updateData.status);
      expect(res.body.data.address.street).toBe(updateData.address.street);
      expect(res.body.data.code).toBe(branchData.code); // Unchanged field
    });

    it('should return 404 for non-existent branch', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .put(`/api/branches/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/branches/:id', () => {
    let branchId;
    
    beforeEach(async () => {
      // Create test branch
      const branch = new Branch({
        ...branchData,
        createdBy: mockUser.id
      });
      await branch.save();
      branchId = branch._id;
    });

    it('should delete branch by ID', async () => {
      const res = await request(app)
        .delete(`/api/branches/${branchId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verify branch is deleted
      const branch = await Branch.findById(branchId);
      expect(branch).toBeNull();
    });

    it('should return 404 for non-existent branch', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/branches/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should prevent deletion of branch with children', async () => {
      // Create parent branch
      const parentBranch = await Branch.create({
        ...branchData,
        code: 'PARENT',
        name: 'Parent Branch',
        createdBy: mockUser.id
      });
      
      // Create child branch
      await Branch.create({
        ...branchData,
        code: 'CHILD',
        name: 'Child Branch',
        parent: parentBranch._id,
        createdBy: mockUser.id
      });
      
      const res = await request(app)
        .delete(`/api/branches/${parentBranch._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('children');
    });
  });

  describe('GET /api/branches/hierarchy', () => {
    beforeEach(async () => {
      // Create root branch
      const rootBranch = await Branch.create({
        ...branchData,
        code: 'ROOT',
        name: 'Root Branch',
        createdBy: mockUser.id
      });
      
      // Create child branch
      const childBranch = await Branch.create({
        ...branchData,
        code: 'CHILD',
        name: 'Child Branch',
        parent: rootBranch._id,
        createdBy: mockUser.id
      });
      
      // Create grandchild branch
      await Branch.create({
        ...branchData,
        code: 'GRANDCHILD',
        name: 'Grandchild Branch',
        parent: childBranch._id,
        createdBy: mockUser.id
      });
    });

    it('should get full branch hierarchy', async () => {
      const res = await request(app)
        .get('/api/branches/hierarchy')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1); // One root branch
      expect(res.body.data[0].code).toBe('ROOT');
      expect(res.body.data[0].children).toHaveLength(1); // One child
      expect(res.body.data[0].children[0].code).toBe('CHILD');
      expect(res.body.data[0].children[0].children).toHaveLength(1); // One grandchild
      expect(res.body.data[0].children[0].children[0].code).toBe('GRANDCHILD');
    });
  });

  describe('PATCH /api/branches/:id/status', () => {
    let branchId;
    
    beforeEach(async () => {
      // Create test branch
      const branch = new Branch({
        ...branchData,
        createdBy: mockUser.id
      });
      await branch.save();
      branchId = branch._id;
    });

    it('should update branch status', async () => {
      const statusData = {
        status: 'INACTIVE',
        reason: 'Test reason'
      };
      
      const res = await request(app)
        .patch(`/api/branches/${branchId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send(statusData);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.status).toBe(statusData.status);
      expect(res.body.data.statusHistory).toHaveLength(1);
      expect(res.body.data.statusHistory[0].status).toBe(statusData.status);
      expect(res.body.data.statusHistory[0].reason).toBe(statusData.reason);
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .patch(`/api/branches/${branchId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'INVALID_STATUS',
          reason: 'Test reason'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
