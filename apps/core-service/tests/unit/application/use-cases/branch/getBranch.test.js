const { getBranch } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');
const { NotFoundError } = require('../../../../../src/utils/errors');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('Get Branch Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const branchId = '60d21b4667d0d8992e610c85';
  
  const mockBranch = {
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

  test('should retrieve a branch by ID successfully', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch);

    // Act
    const result = await getBranch(branchId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(result).toEqual(mockBranch);
  });

  test('should throw NotFoundError if branch does not exist', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getBranch(branchId))
      .rejects
      .toThrow(NotFoundError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
  });

  test('should throw ValidationError if branch ID is invalid', async () => {
    // Arrange
    const invalidId = 'invalid-id';
    branchRepository.findById.mockRejectedValue(new Error('Invalid ID format'));

    // Act & Assert
    await expect(getBranch(invalidId))
      .rejects
      .toThrow();
    
    expect(branchRepository.findById).toHaveBeenCalledWith(invalidId);
  });
});
