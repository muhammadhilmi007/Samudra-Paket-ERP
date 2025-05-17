const { createBranch } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');
const { ValidationError } = require('../../../../../src/utils/errors');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('Create Branch Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBranchData = {
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
    }
  };

  const mockCreatedBranch = {
    _id: '60d21b4667d0d8992e610c85',
    ...mockBranchData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockUserId = 'user123';

  test('should create a branch successfully', async () => {
    // Arrange
    branchRepository.findByCode.mockResolvedValue(null);
    branchRepository.createBranch.mockResolvedValue(mockCreatedBranch);

    // Act
    const result = await createBranch(mockBranchData, mockUserId);

    // Assert
    expect(branchRepository.findByCode).toHaveBeenCalledWith(mockBranchData.code);
    expect(branchRepository.createBranch).toHaveBeenCalledWith({
      ...mockBranchData,
      createdBy: mockUserId
    });
    expect(result).toEqual(mockCreatedBranch);
  });

  test('should throw an error if branch code already exists', async () => {
    // Arrange
    branchRepository.findByCode.mockResolvedValue({ _id: 'existing-id', code: mockBranchData.code });

    // Act & Assert
    await expect(createBranch(mockBranchData, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findByCode).toHaveBeenCalledWith(mockBranchData.code);
    expect(branchRepository.createBranch).not.toHaveBeenCalled();
  });

  test('should throw an error if required fields are missing', async () => {
    // Arrange
    const invalidBranchData = {
      name: 'Jakarta Pusat',
      // Missing code and other required fields
    };

    // Act & Assert
    await expect(createBranch(invalidBranchData, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findByCode).not.toHaveBeenCalled();
    expect(branchRepository.createBranch).not.toHaveBeenCalled();
  });

  test('should set parent branch if parentId is provided', async () => {
    // Arrange
    const branchDataWithParent = {
      ...mockBranchData,
      parentId: 'parent123'
    };

    const mockParentBranch = {
      _id: 'parent123',
      code: 'HQ-001',
      name: 'Headquarters'
    };

    branchRepository.findByCode.mockResolvedValue(null);
    branchRepository.findById.mockResolvedValue(mockParentBranch);
    branchRepository.createBranch.mockResolvedValue({
      ...mockCreatedBranch,
      parentId: 'parent123'
    });

    // Act
    const result = await createBranch(branchDataWithParent, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith('parent123');
    expect(branchRepository.createBranch).toHaveBeenCalledWith({
      ...branchDataWithParent,
      createdBy: mockUserId
    });
    expect(result.parentId).toEqual('parent123');
  });

  test('should throw an error if parent branch does not exist', async () => {
    // Arrange
    const branchDataWithParent = {
      ...mockBranchData,
      parentId: 'nonexistent-parent'
    };

    branchRepository.findByCode.mockResolvedValue(null);
    branchRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(createBranch(branchDataWithParent, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith('nonexistent-parent');
    expect(branchRepository.createBranch).not.toHaveBeenCalled();
  });
});
