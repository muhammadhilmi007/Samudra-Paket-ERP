const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const branchRepository = require('../../../../src/infrastructure/repositories/branchRepository');
const Branch = require('../../../../src/domain/models/Branch');

// Mock the Branch model
jest.mock('../../../../src/domain/models/Branch');

describe('Branch Repository', () => {
  let mongoServer;

  beforeAll(async () => {
    // Create an in-memory MongoDB server for testing
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBranch', () => {
    test('should create a branch successfully', async () => {
      // Arrange
      const branchData = {
        code: 'JKT-001',
        name: 'Jakarta Pusat',
        type: 'HUB',
        status: 'ACTIVE'
      };

      const mockSavedBranch = {
        _id: 'branch123',
        ...branchData,
        save: jest.fn().mockResolvedValue({
          _id: 'branch123',
          ...branchData
        })
      };

      Branch.mockImplementation(() => mockSavedBranch);

      // Act
      const result = await branchRepository.createBranch(branchData);

      // Assert
      expect(Branch).toHaveBeenCalledWith(branchData);
      expect(mockSavedBranch.save).toHaveBeenCalled();
      expect(result).toEqual({
        _id: 'branch123',
        ...branchData
      });
    });

    test('should throw an error if save fails', async () => {
      // Arrange
      const branchData = {
        code: 'JKT-001',
        name: 'Jakarta Pusat',
        type: 'HUB',
        status: 'ACTIVE'
      };

      const mockBranch = {
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      Branch.mockImplementation(() => mockBranch);

      // Act & Assert
      await expect(branchRepository.createBranch(branchData))
        .rejects
        .toThrow('Database error');
      
      expect(Branch).toHaveBeenCalledWith(branchData);
      expect(mockBranch.save).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    test('should find a branch by ID', async () => {
      // Arrange
      const branchId = 'branch123';
      const mockBranch = {
        _id: branchId,
        code: 'JKT-001',
        name: 'Jakarta Pusat'
      };

      Branch.findById = jest.fn().mockResolvedValue(mockBranch);

      // Act
      const result = await branchRepository.findById(branchId);

      // Assert
      expect(Branch.findById).toHaveBeenCalledWith(branchId);
      expect(result).toEqual(mockBranch);
    });

    test('should return null if branch not found', async () => {
      // Arrange
      const branchId = 'nonexistent-branch';
      Branch.findById = jest.fn().mockResolvedValue(null);

      // Act
      const result = await branchRepository.findById(branchId);

      // Assert
      expect(Branch.findById).toHaveBeenCalledWith(branchId);
      expect(result).toBeNull();
    });
  });

  describe('findByCode', () => {
    test('should find a branch by code', async () => {
      // Arrange
      const branchCode = 'JKT-001';
      const mockBranch = {
        _id: 'branch123',
        code: branchCode,
        name: 'Jakarta Pusat'
      };

      Branch.findOne = jest.fn().mockResolvedValue(mockBranch);

      // Act
      const result = await branchRepository.findByCode(branchCode);

      // Assert
      expect(Branch.findOne).toHaveBeenCalledWith({ code: branchCode });
      expect(result).toEqual(mockBranch);
    });

    test('should return null if branch code not found', async () => {
      // Arrange
      const branchCode = 'nonexistent-code';
      Branch.findOne = jest.fn().mockResolvedValue(null);

      // Act
      const result = await branchRepository.findByCode(branchCode);

      // Assert
      expect(Branch.findOne).toHaveBeenCalledWith({ code: branchCode });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    test('should find all branches with pagination', async () => {
      // Arrange
      const mockBranches = [
        { _id: 'branch1', code: 'JKT-001', name: 'Jakarta Pusat' },
        { _id: 'branch2', code: 'BDG-001', name: 'Bandung' }
      ];

      const mockFilter = { status: 'ACTIVE' };
      const mockPage = 1;
      const mockLimit = 10;
      const mockSort = { createdAt: -1 };
      const mockTotal = 2;

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBranches)
      };

      Branch.find = jest.fn().mockReturnValue(mockQuery);
      Branch.countDocuments = jest.fn().mockResolvedValue(mockTotal);

      // Act
      const result = await branchRepository.findAll({
        filter: mockFilter,
        page: mockPage,
        limit: mockLimit,
        sort: mockSort
      });

      // Assert
      expect(Branch.find).toHaveBeenCalledWith(mockFilter);
      expect(mockQuery.sort).toHaveBeenCalledWith(mockSort);
      expect(mockQuery.skip).toHaveBeenCalledWith(0); // (page - 1) * limit
      expect(mockQuery.limit).toHaveBeenCalledWith(mockLimit);
      expect(Branch.countDocuments).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual({
        branches: mockBranches,
        pagination: {
          total: mockTotal,
          page: mockPage,
          limit: mockLimit,
          totalPages: 1 // Math.ceil(total / limit)
        }
      });
    });

    test('should handle empty results', async () => {
      // Arrange
      const mockBranches = [];
      const mockTotal = 0;

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBranches)
      };

      Branch.find = jest.fn().mockReturnValue(mockQuery);
      Branch.countDocuments = jest.fn().mockResolvedValue(mockTotal);

      // Act
      const result = await branchRepository.findAll({});

      // Assert
      expect(result).toEqual({
        branches: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      });
    });
  });

  describe('updateBranch', () => {
    test('should update a branch successfully', async () => {
      // Arrange
      const branchId = 'branch123';
      const updateData = {
        name: 'Jakarta Pusat Updated',
        status: 'INACTIVE'
      };

      const mockUpdatedBranch = {
        _id: branchId,
        code: 'JKT-001',
        ...updateData
      };

      Branch.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedBranch);

      // Act
      const result = await branchRepository.updateBranch(branchId, updateData);

      // Assert
      expect(Branch.findByIdAndUpdate).toHaveBeenCalledWith(
        branchId,
        updateData,
        { new: true }
      );
      expect(result).toEqual(mockUpdatedBranch);
    });

    test('should return null if branch not found', async () => {
      // Arrange
      const branchId = 'nonexistent-branch';
      const updateData = { name: 'Updated Name' };

      Branch.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      // Act
      const result = await branchRepository.updateBranch(branchId, updateData);

      // Assert
      expect(Branch.findByIdAndUpdate).toHaveBeenCalledWith(
        branchId,
        updateData,
        { new: true }
      );
      expect(result).toBeNull();
    });
  });

  describe('deleteBranch', () => {
    test('should delete a branch successfully', async () => {
      // Arrange
      const branchId = 'branch123';
      const mockDeleteResult = { acknowledged: true, deletedCount: 1 };

      Branch.deleteOne = jest.fn().mockResolvedValue(mockDeleteResult);

      // Act
      const result = await branchRepository.deleteBranch(branchId);

      // Assert
      expect(Branch.deleteOne).toHaveBeenCalledWith({ _id: branchId });
      expect(result).toEqual(mockDeleteResult);
    });

    test('should return result even if branch not found', async () => {
      // Arrange
      const branchId = 'nonexistent-branch';
      const mockDeleteResult = { acknowledged: true, deletedCount: 0 };

      Branch.deleteOne = jest.fn().mockResolvedValue(mockDeleteResult);

      // Act
      const result = await branchRepository.deleteBranch(branchId);

      // Assert
      expect(Branch.deleteOne).toHaveBeenCalledWith({ _id: branchId });
      expect(result).toEqual(mockDeleteResult);
    });
  });

  describe('findChildBranches', () => {
    test('should find child branches', async () => {
      // Arrange
      const parentId = 'parent123';
      const mockChildBranches = [
        { _id: 'child1', name: 'Child 1', parentId },
        { _id: 'child2', name: 'Child 2', parentId }
      ];

      Branch.find = jest.fn().mockResolvedValue(mockChildBranches);

      // Act
      const result = await branchRepository.findChildBranches(parentId);

      // Assert
      expect(Branch.find).toHaveBeenCalledWith({ parentId });
      expect(result).toEqual(mockChildBranches);
    });

    test('should return empty array if no child branches found', async () => {
      // Arrange
      const parentId = 'parent-with-no-children';
      Branch.find = jest.fn().mockResolvedValue([]);

      // Act
      const result = await branchRepository.findChildBranches(parentId);

      // Assert
      expect(Branch.find).toHaveBeenCalledWith({ parentId });
      expect(result).toEqual([]);
    });
  });

  describe('getBranchHierarchy', () => {
    test('should get branch hierarchy', async () => {
      // Arrange
      const branchId = 'branch123';
      const mockBranch = {
        _id: branchId,
        code: 'JKT-001',
        name: 'Jakarta Pusat'
      };

      const mockChildBranches = [
        { _id: 'child1', name: 'Child 1', parentId: branchId },
        { _id: 'child2', name: 'Child 2', parentId: branchId }
      ];

      // Mock implementation for recursive hierarchy building
      Branch.findById = jest.fn().mockResolvedValue(mockBranch);
      Branch.find = jest.fn()
        .mockResolvedValueOnce(mockChildBranches) // First call for direct children
        .mockResolvedValueOnce([]) // No children for child1
        .mockResolvedValueOnce([]); // No children for child2

      // Act
      const result = await branchRepository.getBranchHierarchy(branchId);

      // Assert
      expect(Branch.findById).toHaveBeenCalledWith(branchId);
      expect(Branch.find).toHaveBeenCalledWith({ parentId: branchId });
      expect(result).toEqual({
        ...mockBranch,
        children: [
          { ...mockChildBranches[0], children: [] },
          { ...mockChildBranches[1], children: [] }
        ]
      });
    });

    test('should return null if branch not found', async () => {
      // Arrange
      const branchId = 'nonexistent-branch';
      Branch.findById = jest.fn().mockResolvedValue(null);

      // Act
      const result = await branchRepository.getBranchHierarchy(branchId);

      // Assert
      expect(Branch.findById).toHaveBeenCalledWith(branchId);
      expect(result).toBeNull();
    });
  });

  describe('updateBranchStatus', () => {
    test('should update branch status', async () => {
      // Arrange
      const branchId = 'branch123';
      const statusData = {
        status: 'INACTIVE',
        statusReason: 'Temporary closure',
        statusUpdatedAt: new Date(),
        statusUpdatedBy: 'user123'
      };

      const mockUpdatedBranch = {
        _id: branchId,
        code: 'JKT-001',
        name: 'Jakarta Pusat',
        ...statusData
      };

      Branch.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedBranch);

      // Act
      const result = await branchRepository.updateBranchStatus(branchId, statusData);

      // Assert
      expect(Branch.findByIdAndUpdate).toHaveBeenCalledWith(
        branchId,
        statusData,
        { new: true }
      );
      expect(result).toEqual(mockUpdatedBranch);
    });
  });

  describe('updateBranchMetrics', () => {
    test('should update branch metrics', async () => {
      // Arrange
      const branchId = 'branch123';
      const metricsData = {
        metrics: {
          dailyShipments: 120,
          monthlyRevenue: 75000000
        },
        updatedBy: 'user123'
      };

      const mockUpdatedBranch = {
        _id: branchId,
        code: 'JKT-001',
        name: 'Jakarta Pusat',
        ...metricsData
      };

      Branch.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedBranch);

      // Act
      const result = await branchRepository.updateBranchMetrics(branchId, metricsData);

      // Assert
      expect(Branch.findByIdAndUpdate).toHaveBeenCalledWith(
        branchId,
        metricsData,
        { new: true }
      );
      expect(result).toEqual(mockUpdatedBranch);
    });
  });

  describe('updateBranchResources', () => {
    test('should update branch resources', async () => {
      // Arrange
      const branchId = 'branch123';
      const resourcesData = {
        resources: {
          vehicles: 7,
          staff: 18
        },
        updatedBy: 'user123'
      };

      const mockUpdatedBranch = {
        _id: branchId,
        code: 'JKT-001',
        name: 'Jakarta Pusat',
        ...resourcesData
      };

      Branch.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedBranch);

      // Act
      const result = await branchRepository.updateBranchResources(branchId, resourcesData);

      // Assert
      expect(Branch.findByIdAndUpdate).toHaveBeenCalledWith(
        branchId,
        resourcesData,
        { new: true }
      );
      expect(result).toEqual(mockUpdatedBranch);
    });
  });

  describe('updateBranchOperationalHours', () => {
    test('should update branch operational hours', async () => {
      // Arrange
      const branchId = 'branch123';
      const operationalHoursData = {
        operationalHours: {
          monday: { open: '07:30', close: '18:00' },
          tuesday: { open: '07:30', close: '18:00' }
        },
        updatedBy: 'user123'
      };

      const mockUpdatedBranch = {
        _id: branchId,
        code: 'JKT-001',
        name: 'Jakarta Pusat',
        ...operationalHoursData
      };

      Branch.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedBranch);

      // Act
      const result = await branchRepository.updateBranchOperationalHours(branchId, operationalHoursData);

      // Assert
      expect(Branch.findByIdAndUpdate).toHaveBeenCalledWith(
        branchId,
        operationalHoursData,
        { new: true }
      );
      expect(result).toEqual(mockUpdatedBranch);
    });
  });

  describe('addBranchDocument', () => {
    test('should add a document to a branch', async () => {
      // Arrange
      const branchId = 'branch123';
      const document = {
        type: 'LICENSE',
        name: 'Business License',
        fileUrl: 'https://example.com/license.pdf',
        expiryDate: new Date('2025-12-31'),
        uploadedAt: new Date(),
        uploadedBy: 'user123'
      };

      const userId = 'user123';

      const mockUpdatedBranch = {
        _id: branchId,
        code: 'JKT-001',
        name: 'Jakarta Pusat',
        documents: [document],
        updatedBy: userId
      };

      Branch.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedBranch);

      // Act
      const result = await branchRepository.addBranchDocument(branchId, document, userId);

      // Assert
      expect(Branch.findByIdAndUpdate).toHaveBeenCalledWith(
        branchId,
        {
          $push: { documents: document },
          updatedBy: userId
        },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedBranch);
    });
  });

  describe('removeBranchDocument', () => {
    test('should remove a document from a branch', async () => {
      // Arrange
      const branchId = 'branch123';
      const documentId = 'doc123';
      const userId = 'user123';

      const mockUpdatedBranch = {
        _id: branchId,
        code: 'JKT-001',
        name: 'Jakarta Pusat',
        documents: [],
        updatedBy: userId
      };

      Branch.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedBranch);

      // Act
      const result = await branchRepository.removeBranchDocument(branchId, documentId, userId);

      // Assert
      expect(Branch.findByIdAndUpdate).toHaveBeenCalledWith(
        branchId,
        {
          $pull: { documents: { _id: documentId } },
          updatedBy: userId
        },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedBranch);
    });

    test('should return null if document not found', async () => {
      // Arrange
      const branchId = 'branch123';
      const documentId = 'nonexistent-doc';
      const userId = 'user123';

      Branch.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      // Act
      const result = await branchRepository.removeBranchDocument(branchId, documentId, userId);

      // Assert
      expect(Branch.findByIdAndUpdate).toHaveBeenCalledWith(
        branchId,
        {
          $pull: { documents: { _id: documentId } },
          updatedBy: userId
        },
        { new: true }
      );
      expect(result).toBeNull();
    });
  });
});
