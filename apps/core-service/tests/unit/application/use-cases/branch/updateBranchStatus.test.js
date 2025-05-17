const { updateBranchStatus } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');
const { NotFoundError, ValidationError } = require('../../../../../src/utils/errors');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('Update Branch Status Use Case', () => {
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
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  };

  const statusData = {
    status: 'INACTIVE',
    statusReason: 'Temporary closure for renovation'
  };

  const updatedBranch = {
    ...mockBranch,
    status: 'INACTIVE',
    statusReason: 'Temporary closure for renovation',
    statusUpdatedAt: expect.any(Date),
    statusUpdatedBy: mockUserId,
    updatedAt: expect.any(Date),
    updatedBy: mockUserId
  };

  test('should update branch status successfully', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.updateBranchStatus.mockResolvedValue(updatedBranch);

    // Act
    const result = await updateBranchStatus(branchId, statusData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchStatus).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        status: 'INACTIVE',
        statusReason: 'Temporary closure for renovation',
        statusUpdatedAt: expect.any(Date),
        statusUpdatedBy: mockUserId,
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(updatedBranch);
  });

  test('should throw NotFoundError if branch does not exist', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateBranchStatus(branchId, statusData, mockUserId))
      .rejects
      .toThrow(NotFoundError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchStatus).not.toHaveBeenCalled();
  });

  test('should throw ValidationError if status is invalid', async () => {
    // Arrange
    const invalidStatusData = {
      status: 'INVALID_STATUS',
      statusReason: 'Some reason'
    };

    branchRepository.findById.mockResolvedValue(mockBranch);

    // Act & Assert
    await expect(updateBranchStatus(branchId, invalidStatusData, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchStatus).not.toHaveBeenCalled();
  });

  test('should throw ValidationError if status reason is missing for INACTIVE status', async () => {
    // Arrange
    const missingReasonData = {
      status: 'INACTIVE'
      // Missing statusReason
    };

    branchRepository.findById.mockResolvedValue(mockBranch);

    // Act & Assert
    await expect(updateBranchStatus(branchId, missingReasonData, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchStatus).not.toHaveBeenCalled();
  });

  test('should not require status reason for ACTIVE status', async () => {
    // Arrange
    const activeStatusData = {
      status: 'ACTIVE'
      // No statusReason needed
    };

    branchRepository.findById.mockResolvedValue({
      ...mockBranch,
      status: 'INACTIVE',
      statusReason: 'Temporary closure for renovation'
    });

    branchRepository.updateBranchStatus.mockResolvedValue({
      ...mockBranch,
      status: 'ACTIVE',
      statusReason: null,
      statusUpdatedAt: expect.any(Date),
      statusUpdatedBy: mockUserId
    });

    // Act
    const result = await updateBranchStatus(branchId, activeStatusData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchStatus).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        status: 'ACTIVE',
        statusReason: null,
        statusUpdatedAt: expect.any(Date),
        statusUpdatedBy: mockUserId,
        updatedBy: mockUserId
      })
    );
    expect(result.status).toBe('ACTIVE');
  });

  test('should not update if status is the same', async () => {
    // Arrange
    const sameStatusData = {
      status: 'ACTIVE',
      statusReason: 'No change needed'
    };

    branchRepository.findById.mockResolvedValue(mockBranch); // Already ACTIVE

    // Act
    const result = await updateBranchStatus(branchId, sameStatusData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchStatus).not.toHaveBeenCalled();
    expect(result).toEqual(mockBranch);
  });
});
