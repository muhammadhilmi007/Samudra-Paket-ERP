const { updateBranchResources } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');
const { NotFoundError, ValidationError } = require('../../../../../src/utils/errors');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('Update Branch Resources Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const branchId = '60d21b4667d0d8992e610c85';
  const mockUserId = 'user123';
  
  const mockBranch = {
    _id: branchId,
    code: 'JKT-001',
    name: 'Jakarta Pusat',
    type: 'HUB',
    status: 'ACTIVE',
    resources: {
      vehicles: 5,
      staff: 15,
      storageCapacity: 1000
    },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  };

  const resourcesData = {
    resources: {
      vehicles: 7,
      staff: 18,
      storageCapacity: 1200
    }
  };

  const updatedBranch = {
    ...mockBranch,
    resources: {
      vehicles: 7,
      staff: 18,
      storageCapacity: 1200
    },
    updatedAt: expect.any(Date),
    updatedBy: mockUserId
  };

  test('should update branch resources successfully', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.updateBranchResources.mockResolvedValue(updatedBranch);

    // Act
    const result = await updateBranchResources(branchId, resourcesData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchResources).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        resources: resourcesData.resources,
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(updatedBranch);
  });

  test('should throw NotFoundError if branch does not exist', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateBranchResources(branchId, resourcesData, mockUserId))
      .rejects
      .toThrow(NotFoundError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchResources).not.toHaveBeenCalled();
  });

  test('should throw ValidationError if resources data is invalid', async () => {
    // Arrange
    const invalidResourcesData = {
      resources: {
        vehicles: -2, // Invalid negative value
        staff: 18,
        storageCapacity: 1200
      }
    };

    branchRepository.findById.mockResolvedValue(mockBranch);

    // Act & Assert
    await expect(updateBranchResources(branchId, invalidResourcesData, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchResources).not.toHaveBeenCalled();
  });

  test('should update only provided resources fields', async () => {
    // Arrange
    const partialResourcesData = {
      resources: {
        vehicles: 7,
        staff: 18
        // storageCapacity not provided
      }
    };

    const expectedUpdatedBranch = {
      ...mockBranch,
      resources: {
        ...mockBranch.resources,
        vehicles: 7,
        staff: 18
      },
      updatedAt: expect.any(Date),
      updatedBy: mockUserId
    };

    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.updateBranchResources.mockResolvedValue(expectedUpdatedBranch);

    // Act
    const result = await updateBranchResources(branchId, partialResourcesData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchResources).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        resources: expect.objectContaining({
          vehicles: 7,
          staff: 18,
          storageCapacity: 1000 // Preserved from existing data
        }),
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(expectedUpdatedBranch);
  });

  test('should initialize resources if they do not exist', async () => {
    // Arrange
    const branchWithoutResources = {
      ...mockBranch,
      resources: undefined
    };

    branchRepository.findById.mockResolvedValue(branchWithoutResources);
    branchRepository.updateBranchResources.mockResolvedValue(updatedBranch);

    // Act
    const result = await updateBranchResources(branchId, resourcesData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchResources).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        resources: resourcesData.resources,
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(updatedBranch);
  });

  test('should validate resource values are positive numbers', async () => {
    // Arrange
    const invalidResourcesData = {
      resources: {
        vehicles: 'five', // Invalid string value
        staff: 18,
        storageCapacity: 1200
      }
    };

    branchRepository.findById.mockResolvedValue(mockBranch);

    // Act & Assert
    await expect(updateBranchResources(branchId, invalidResourcesData, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchResources).not.toHaveBeenCalled();
  });
});
