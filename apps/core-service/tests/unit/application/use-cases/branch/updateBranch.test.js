const { updateBranch } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');
const { ValidationError, NotFoundError } = require('../../../../../src/utils/errors');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('Update Branch Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const branchId = '60d21b4667d0d8992e610c85';
  const mockUserId = 'user123';

  const existingBranch = {
    _id: branchId,
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
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  };

  const updateData = {
    name: 'Jakarta Pusat Updated',
    contact: {
      phoneNumber: '+62215678903',
      email: 'jakarta.pusat.updated@samudrapaket.com',
      contactPerson: 'Budi Santoso Jr.'
    },
    address: {
      street: 'Jl. Kebon Sirih No. 12',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10110'
    }
  };

  const updatedBranch = {
    ...existingBranch,
    ...updateData,
    address: {
      ...existingBranch.address,
      ...updateData.address
    },
    contact: {
      ...existingBranch.contact,
      ...updateData.contact
    },
    updatedAt: new Date('2023-01-02'),
    updatedBy: mockUserId
  };

  test('should update a branch successfully', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(existingBranch);
    branchRepository.updateBranch.mockResolvedValue(updatedBranch);

    // Act
    const result = await updateBranch(branchId, updateData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranch).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        ...updateData,
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(updatedBranch);
  });

  test('should throw NotFoundError if branch does not exist', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateBranch(branchId, updateData, mockUserId))
      .rejects
      .toThrow(NotFoundError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranch).not.toHaveBeenCalled();
  });

  test('should throw ValidationError if trying to update code to an existing one', async () => {
    // Arrange
    const updateWithCode = {
      ...updateData,
      code: 'BDG-001' // Different code
    };

    branchRepository.findById.mockResolvedValue(existingBranch);
    branchRepository.findByCode.mockResolvedValue({ 
      _id: '60d21b4667d0d8992e610c86', // Different ID
      code: 'BDG-001' 
    });

    // Act & Assert
    await expect(updateBranch(branchId, updateWithCode, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.findByCode).toHaveBeenCalledWith('BDG-001');
    expect(branchRepository.updateBranch).not.toHaveBeenCalled();
  });

  test('should allow updating to the same code', async () => {
    // Arrange
    const updateWithSameCode = {
      ...updateData,
      code: 'JKT-001' // Same code as existing branch
    };

    branchRepository.findById.mockResolvedValue(existingBranch);
    branchRepository.findByCode.mockResolvedValue(existingBranch); // Same branch returned
    branchRepository.updateBranch.mockResolvedValue({
      ...updatedBranch,
      code: 'JKT-001'
    });

    // Act
    const result = await updateBranch(branchId, updateWithSameCode, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.findByCode).toHaveBeenCalledWith('JKT-001');
    expect(branchRepository.updateBranch).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        ...updateWithSameCode,
        updatedBy: mockUserId
      })
    );
    expect(result.code).toEqual('JKT-001');
  });

  test('should update parent branch if parentId is provided', async () => {
    // Arrange
    const parentId = '60d21b4667d0d8992e610c87';
    const updateWithParent = {
      ...updateData,
      parentId
    };

    const parentBranch = {
      _id: parentId,
      code: 'HQ-001',
      name: 'Headquarters'
    };

    branchRepository.findById.mockImplementation((id) => {
      if (id === branchId) return Promise.resolve(existingBranch);
      if (id === parentId) return Promise.resolve(parentBranch);
      return Promise.resolve(null);
    });

    branchRepository.updateBranch.mockResolvedValue({
      ...updatedBranch,
      parentId
    });

    // Act
    const result = await updateBranch(branchId, updateWithParent, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.findById).toHaveBeenCalledWith(parentId);
    expect(branchRepository.updateBranch).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        ...updateWithParent,
        updatedBy: mockUserId
      })
    );
    expect(result.parentId).toEqual(parentId);
  });

  test('should throw ValidationError if parent branch does not exist', async () => {
    // Arrange
    const updateWithInvalidParent = {
      ...updateData,
      parentId: 'nonexistent-parent'
    };

    branchRepository.findById.mockImplementation((id) => {
      if (id === branchId) return Promise.resolve(existingBranch);
      return Promise.resolve(null);
    });

    // Act & Assert
    await expect(updateBranch(branchId, updateWithInvalidParent, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.findById).toHaveBeenCalledWith('nonexistent-parent');
    expect(branchRepository.updateBranch).not.toHaveBeenCalled();
  });

  test('should throw ValidationError if trying to set branch as its own parent', async () => {
    // Arrange
    const updateWithSelfParent = {
      ...updateData,
      parentId: branchId // Same as the branch being updated
    };

    branchRepository.findById.mockResolvedValue(existingBranch);

    // Act & Assert
    await expect(updateBranch(branchId, updateWithSelfParent, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranch).not.toHaveBeenCalled();
  });
});
