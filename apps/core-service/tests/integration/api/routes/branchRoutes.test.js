const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../../../src/server');
const Branch = require('../../../../src/domain/models/Branch');
const jwt = require('jsonwebtoken');

describe('Branch Routes Integration Tests', () => {
  let mongoServer;
  let authToken;
  let testBranchId;

  // Mock data
  const adminUser = {
    id: 'admin123',
    email: 'admin@samudrapaket.com',
    role: 'ADMIN',
    permissions: ['branch:create', 'branch:read', 'branch:update', 'branch:delete']
  };

  const testBranch = {
    code: 'JKT-001',
    name: 'Jakarta Pusat',
    type: 'HUB',
    status: 'ACTIVE',
    address: {
      street: 'Jl. Kebon Sirih No. 10',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10110',
      country: 'Indonesia',
      coordinates: {
        latitude: -6.186486,
        longitude: 106.834091
      }
    },
    contact: {
      phoneNumber: '+62215678901',
      email: 'jakarta.pusat@samudrapaket.com',
      contactPerson: 'Budi Santoso'
    },
    operationalHours: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '09:00', close: '15:00' },
      sunday: { open: null, close: null }
    },
    resources: {
      vehicles: 5,
      staff: 15,
      storageCapacity: 1000
    }
  };

  beforeAll(async () => {
    // Create an in-memory MongoDB server for testing
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Generate a valid JWT token for authentication
    authToken = jwt.sign(adminUser, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await Branch.deleteMany({});
  });

  describe('POST /api/branches', () => {
    test('should create a new branch', async () => {
      // Act
      const response = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Branch created successfully');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.code).toBe(testBranch.code);
      expect(response.body.data.name).toBe(testBranch.name);

      // Save the branch ID for later tests
      testBranchId = response.body.data._id;
    });

    test('should return 400 if branch code already exists', async () => {
      // Arrange
      // First create a branch
      await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);

      // Act - Try to create another branch with the same code
      const response = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation error');
    });

    test('should return 400 if required fields are missing', async () => {
      // Arrange
      const incompleteBranch = {
        name: 'Jakarta Pusat',
        // Missing code and other required fields
      };

      // Act
      const response = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteBranch);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation error');
    });

    test('should return 401 if not authenticated', async () => {
      // Act
      const response = await request(app)
        .post('/api/branches')
        .send(testBranch);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/branches/:id', () => {
    test('should get a branch by ID', async () => {
      // Arrange
      // First create a branch
      const createResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const branchId = createResponse.body.data._id;

      // Act
      const response = await request(app)
        .get(`/api/branches/${branchId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(branchId);
      expect(response.body.data.code).toBe(testBranch.code);
      expect(response.body.data.name).toBe(testBranch.name);
    });

    test('should return 404 if branch not found', async () => {
      // Act
      const response = await request(app)
        .get('/api/branches/60d21b4667d0d8992e610c85') // Non-existent ID
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Branch not found');
    });

    test('should return 401 if not authenticated', async () => {
      // Act
      const response = await request(app)
        .get('/api/branches/60d21b4667d0d8992e610c85');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/branches/:id', () => {
    test('should update a branch', async () => {
      // Arrange
      // First create a branch
      const createResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const branchId = createResponse.body.data._id;

      const updateData = {
        name: 'Jakarta Pusat Updated',
        contact: {
          phoneNumber: '+62215678903',
          email: 'jakarta.pusat.updated@samudrapaket.com'
        }
      };

      // Act
      const response = await request(app)
        .put(`/api/branches/${branchId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Branch updated successfully');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.contact.phoneNumber).toBe(updateData.contact.phoneNumber);
      expect(response.body.data.contact.email).toBe(updateData.contact.email);
      // Original data should be preserved
      expect(response.body.data.code).toBe(testBranch.code);
    });

    test('should return 404 if branch not found', async () => {
      // Act
      const response = await request(app)
        .put('/api/branches/60d21b4667d0d8992e610c85') // Non-existent ID
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Branch not found');
    });

    test('should return 400 if trying to update to existing code', async () => {
      // Arrange
      // Create first branch
      const firstBranchResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      // Create second branch
      const secondBranch = {
        ...testBranch,
        code: 'BDG-001',
        name: 'Bandung'
      };
      
      const secondBranchResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(secondBranch);
      
      const secondBranchId = secondBranchResponse.body.data._id;

      // Try to update second branch with first branch's code
      const updateData = {
        code: testBranch.code // This code already exists
      };

      // Act
      const response = await request(app)
        .put(`/api/branches/${secondBranchId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('GET /api/branches', () => {
    test('should list branches with pagination', async () => {
      // Arrange
      // Create multiple branches
      await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testBranch,
          code: 'BDG-001',
          name: 'Bandung'
        });

      // Act
      const response = await request(app)
        .get('/api/branches')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.branches).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('total', 2);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 10);
    });

    test('should filter branches by type', async () => {
      // Arrange
      // Create branches with different types
      await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch); // HUB type
      
      await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testBranch,
          code: 'BDG-001',
          name: 'Bandung',
          type: 'BRANCH'
        });

      // Act
      const response = await request(app)
        .get('/api/branches?type=BRANCH')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.branches).toHaveLength(1);
      expect(response.body.data.branches[0].type).toBe('BRANCH');
    });

    test('should filter branches by status', async () => {
      // Arrange
      // Create branches with different statuses
      await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch); // ACTIVE status
      
      await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testBranch,
          code: 'BDG-001',
          name: 'Bandung',
          status: 'INACTIVE'
        });

      // Act
      const response = await request(app)
        .get('/api/branches?status=INACTIVE')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.branches).toHaveLength(1);
      expect(response.body.data.branches[0].status).toBe('INACTIVE');
    });

    test('should paginate results', async () => {
      // Arrange
      // Create multiple branches
      for (let i = 1; i <= 5; i++) {
        await request(app)
          .post('/api/branches')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...testBranch,
            code: `JKT-00${i}`,
            name: `Jakarta Branch ${i}`
          });
      }

      // Act
      const response = await request(app)
        .get('/api/branches?page=2&limit=2')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.branches).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('total', 5);
      expect(response.body.data.pagination).toHaveProperty('page', 2);
      expect(response.body.data.pagination).toHaveProperty('limit', 2);
      expect(response.body.data.pagination).toHaveProperty('totalPages', 3);
    });
  });

  describe('DELETE /api/branches/:id', () => {
    test('should delete a branch', async () => {
      // Arrange
      // First create a branch
      const createResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const branchId = createResponse.body.data._id;

      // Act
      const response = await request(app)
        .delete(`/api/branches/${branchId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Branch deleted successfully');

      // Verify branch is deleted
      const getResponse = await request(app)
        .get(`/api/branches/${branchId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(getResponse.status).toBe(404);
    });

    test('should return 404 if branch not found', async () => {
      // Act
      const response = await request(app)
        .delete('/api/branches/60d21b4667d0d8992e610c85') // Non-existent ID
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Branch not found');
    });

    test('should return 400 if branch has child branches', async () => {
      // Arrange
      // Create parent branch
      const parentResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const parentId = parentResponse.body.data._id;

      // Create child branch
      await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testBranch,
          code: 'JKT-002',
          name: 'Jakarta Selatan',
          parentId
        });

      // Act
      const response = await request(app)
        .delete(`/api/branches/${parentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Cannot delete branch with child branches');
    });
  });

  describe('GET /api/branches/hierarchy/:id', () => {
    test('should get branch hierarchy', async () => {
      // Arrange
      // Create parent branch
      const parentResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const parentId = parentResponse.body.data._id;

      // Create child branch
      const childResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testBranch,
          code: 'JKT-002',
          name: 'Jakarta Selatan',
          parentId
        });
      
      const childId = childResponse.body.data._id;

      // Create grandchild branch
      await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testBranch,
          code: 'JKT-003',
          name: 'Kebayoran Baru',
          parentId: childId
        });

      // Act
      const response = await request(app)
        .get(`/api/branches/hierarchy/${parentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.code).toBe(testBranch.code);
      expect(response.body.data.children).toHaveLength(1);
      expect(response.body.data.children[0].name).toBe('Jakarta Selatan');
      expect(response.body.data.children[0].children).toHaveLength(1);
      expect(response.body.data.children[0].children[0].name).toBe('Kebayoran Baru');
    });

    test('should return 404 if branch not found', async () => {
      // Act
      const response = await request(app)
        .get('/api/branches/hierarchy/60d21b4667d0d8992e610c85') // Non-existent ID
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Branch not found');
    });
  });

  describe('PATCH /api/branches/:id/status', () => {
    test('should update branch status', async () => {
      // Arrange
      // First create a branch
      const createResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const branchId = createResponse.body.data._id;

      const statusData = {
        status: 'INACTIVE',
        statusReason: 'Temporary closure for renovation'
      };

      // Act
      const response = await request(app)
        .patch(`/api/branches/${branchId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(statusData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Branch status updated successfully');
      expect(response.body.data.status).toBe('INACTIVE');
      expect(response.body.data.statusReason).toBe('Temporary closure for renovation');
    });

    test('should return 404 if branch not found', async () => {
      // Act
      const response = await request(app)
        .patch('/api/branches/60d21b4667d0d8992e610c85/status') // Non-existent ID
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'INACTIVE',
          statusReason: 'Temporary closure'
        });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Branch not found');
    });

    test('should return 400 if status is invalid', async () => {
      // Arrange
      // First create a branch
      const createResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const branchId = createResponse.body.data._id;

      // Act
      const response = await request(app)
        .patch(`/api/branches/${branchId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'INVALID_STATUS',
          statusReason: 'Some reason'
        });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation error');
    });
  });

  describe('PATCH /api/branches/:id/metrics', () => {
    test('should update branch metrics', async () => {
      // Arrange
      // First create a branch
      const createResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const branchId = createResponse.body.data._id;

      const metricsData = {
        metrics: {
          dailyShipments: 120,
          monthlyRevenue: 75000000,
          customerSatisfaction: 4.8,
          onTimeDeliveryRate: 0.95
        }
      };

      // Act
      const response = await request(app)
        .patch(`/api/branches/${branchId}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(metricsData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Branch metrics updated successfully');
      expect(response.body.data.metrics).toEqual(metricsData.metrics);
    });
  });

  describe('PATCH /api/branches/:id/resources', () => {
    test('should update branch resources', async () => {
      // Arrange
      // First create a branch
      const createResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const branchId = createResponse.body.data._id;

      const resourcesData = {
        resources: {
          vehicles: 7,
          staff: 18,
          storageCapacity: 1200
        }
      };

      // Act
      const response = await request(app)
        .patch(`/api/branches/${branchId}/resources`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(resourcesData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Branch resources updated successfully');
      expect(response.body.data.resources).toEqual(resourcesData.resources);
    });
  });

  describe('POST /api/branches/:id/documents', () => {
    test('should add a document to a branch', async () => {
      // Arrange
      // First create a branch
      const createResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const branchId = createResponse.body.data._id;

      const documentData = {
        document: {
          type: 'LICENSE',
          name: 'Business License',
          fileUrl: 'https://storage.samudrapaket.com/documents/license-jkt001.pdf',
          expiryDate: '2025-12-31'
        }
      };

      // Act
      const response = await request(app)
        .post(`/api/branches/${branchId}/documents`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(documentData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Document added successfully');
      expect(response.body.data.documents).toHaveLength(1);
      expect(response.body.data.documents[0].type).toBe('LICENSE');
      expect(response.body.data.documents[0].name).toBe('Business License');
    });
  });

  describe('DELETE /api/branches/:id/documents/:documentId', () => {
    test('should remove a document from a branch', async () => {
      // Arrange
      // First create a branch
      const createResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const branchId = createResponse.body.data._id;

      // Add a document
      const documentData = {
        document: {
          type: 'LICENSE',
          name: 'Business License',
          fileUrl: 'https://storage.samudrapaket.com/documents/license-jkt001.pdf',
          expiryDate: '2025-12-31'
        }
      };

      const addDocResponse = await request(app)
        .post(`/api/branches/${branchId}/documents`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(documentData);
      
      const documentId = addDocResponse.body.data.documents[0]._id;

      // Act
      const response = await request(app)
        .delete(`/api/branches/${branchId}/documents/${documentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Document removed successfully');
      expect(response.body.data.documents).toHaveLength(0);
    });
  });

  describe('PATCH /api/branches/:id/operational-hours', () => {
    test('should update branch operational hours', async () => {
      // Arrange
      // First create a branch
      const createResponse = await request(app)
        .post('/api/branches')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testBranch);
      
      const branchId = createResponse.body.data._id;

      const operationalHoursData = {
        operationalHours: {
          monday: { open: '07:30', close: '18:00' },
          tuesday: { open: '07:30', close: '18:00' },
          wednesday: { open: '07:30', close: '18:00' },
          thursday: { open: '07:30', close: '18:00' },
          friday: { open: '07:30', close: '18:00' },
          saturday: { open: '08:00', close: '16:00' },
          sunday: { open: '10:00', close: '14:00' }
        }
      };

      // Act
      const response = await request(app)
        .patch(`/api/branches/${branchId}/operational-hours`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(operationalHoursData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Operational hours updated successfully');
      expect(response.body.data.operationalHours).toEqual(operationalHoursData.operationalHours);
    });
  });
});
