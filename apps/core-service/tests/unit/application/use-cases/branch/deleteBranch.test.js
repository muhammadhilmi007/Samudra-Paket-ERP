const { deleteBranch } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');
const { NotFoundError, ValidationError } = require('../../../../../src/utils/errors');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('Delete Branch Use Case', () => {
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

  test('should delete a branch successfully', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.findChildBranches.mockResolvedValue([]);
    branchRepository.deleteBranch.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

    // Act
    const result = await deleteBranch(branchId, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.findChildBranches).toHaveBeenCalledWith(branchId);
    expect(branchRepository.deleteBranch).toHaveBeenCalledWith(branchId);
    expect(result).toEqual({ acknowledged: true, deletedCount: 1 });
  });

  test('should throw NotFoundError if branch does not exist', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(deleteBranch(branchId, mockUserId))
      .rejects
      .toThrow(NotFoundError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.findChildBranches).not.toHaveBeenCalled();
    expect(branchRepository.deleteBranch).not.toHaveBeenCalled();
  });

  test('should throw ValidationError if branch has child branches', async () => {
    // Arrange
    const childBranches = [
      {
        _id: '60d21b4667d0d8992e610c86',
        code: 'JKT-002',
        name: 'Jakarta Selatan',
        parentId: branchId
      }
    ];

    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.findChildBranches.mockResolvedValue(childBranches);

    // Act & Assert
    await expect(deleteBranch(branchId, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.findChildBranches).toHaveBeenCalledWith(branchId);
    expect(branchRepository.deleteBranch).not.toHaveBeenCalled();
  });

  test('should throw an error if deletion fails', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.findChildBranches.mockResolvedValue([]);
    branchRepository.deleteBranch.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(deleteBranch(branchId, mockUserId))
      .rejects
      .toThrow('Database error');
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.findChildBranches).toHaveBeenCalledWith(branchId);
    expect(branchRepository.deleteBranch).toHaveBeenCalledWith(branchId);
  });

  test('should return success even if no branch was deleted', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.findChildBranches.mockResolvedValue([]);
    branchRepository.deleteBranch.mockResolvedValue({ acknowledged: true, deletedCount: 0 });

    // Act
    const result = await deleteBranch(branchId, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.findChildBranches).toHaveBeenCalledWith(branchId);
    expect(branchRepository.deleteBranch).toHaveBeenCalledWith(branchId);
    expect(result).toEqual({ acknowledged: true, deletedCount: 0 });
  });
});
