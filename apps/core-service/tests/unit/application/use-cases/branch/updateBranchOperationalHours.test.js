const { updateBranchOperationalHours } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');
const { NotFoundError, ValidationError } = require('../../../../../src/utils/errors');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('Update Branch Operational Hours Use Case', () => {
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
    operationalHours: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '09:00', close: '15:00' },
      sunday: { open: null, close: null }
    },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  };

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

  const updatedBranch = {
    ...mockBranch,
    operationalHours: operationalHoursData.operationalHours,
    updatedAt: expect.any(Date),
    updatedBy: mockUserId
  };

  test('should update branch operational hours successfully', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.updateBranchOperationalHours.mockResolvedValue(updatedBranch);

    // Act
    const result = await updateBranchOperationalHours(branchId, operationalHoursData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchOperationalHours).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        operationalHours: operationalHoursData.operationalHours,
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(updatedBranch);
  });

  test('should throw NotFoundError if branch does not exist', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateBranchOperationalHours(branchId, operationalHoursData, mockUserId))
      .rejects
      .toThrow(NotFoundError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchOperationalHours).not.toHaveBeenCalled();
  });

  test('should throw ValidationError if operational hours data is invalid', async () => {
    // Arrange
    const invalidOperationalHoursData = {
      operationalHours: {
        monday: { open: '25:00', close: '17:00' }, // Invalid time format
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '17:00' },
        saturday: { open: '09:00', close: '15:00' },
        sunday: { open: null, close: null }
      }
    };

    branchRepository.findById.mockResolvedValue(mockBranch);

    // Act & Assert
    await expect(updateBranchOperationalHours(branchId, invalidOperationalHoursData, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchOperationalHours).not.toHaveBeenCalled();
  });

  test('should throw ValidationError if close time is before open time', async () => {
    // Arrange
    const invalidTimeOrderData = {
      operationalHours: {
        monday: { open: '17:00', close: '08:00' }, // Close time before open time
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '17:00' },
        saturday: { open: '09:00', close: '15:00' },
        sunday: { open: null, close: null }
      }
    };

    branchRepository.findById.mockResolvedValue(mockBranch);

    // Act & Assert
    await expect(updateBranchOperationalHours(branchId, invalidTimeOrderData, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchOperationalHours).not.toHaveBeenCalled();
  });

  test('should update only provided days', async () => {
    // Arrange
    const partialOperationalHoursData = {
      operationalHours: {
        monday: { open: '07:30', close: '18:00' },
        friday: { open: '07:30', close: '18:00' }
        // Other days not provided
      }
    };

    const expectedUpdatedBranch = {
      ...mockBranch,
      operationalHours: {
        ...mockBranch.operationalHours,
        monday: { open: '07:30', close: '18:00' },
        friday: { open: '07:30', close: '18:00' }
      },
      updatedAt: expect.any(Date),
      updatedBy: mockUserId
    };

    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.updateBranchOperationalHours.mockResolvedValue(expectedUpdatedBranch);

    // Act
    const result = await updateBranchOperationalHours(branchId, partialOperationalHoursData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchOperationalHours).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        operationalHours: expect.objectContaining({
          monday: { open: '07:30', close: '18:00' },
          friday: { open: '07:30', close: '18:00' },
          // Other days should be preserved from existing data
          tuesday: { open: '08:00', close: '17:00' },
          wednesday: { open: '08:00', close: '17:00' },
          thursday: { open: '08:00', close: '17:00' },
          saturday: { open: '09:00', close: '15:00' },
          sunday: { open: null, close: null }
        }),
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(expectedUpdatedBranch);
  });

  test('should initialize operational hours if they do not exist', async () => {
    // Arrange
    const branchWithoutOperationalHours = {
      ...mockBranch,
      operationalHours: undefined
    };

    branchRepository.findById.mockResolvedValue(branchWithoutOperationalHours);
    branchRepository.updateBranchOperationalHours.mockResolvedValue(updatedBranch);

    // Act
    const result = await updateBranchOperationalHours(branchId, operationalHoursData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchOperationalHours).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        operationalHours: operationalHoursData.operationalHours,
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(updatedBranch);
  });

  test('should allow setting a day as closed with null values', async () => {
    // Arrange
    const closedDayData = {
      operationalHours: {
        saturday: { open: null, close: null },
        sunday: { open: null, close: null }
      }
    };

    const expectedUpdatedBranch = {
      ...mockBranch,
      operationalHours: {
        ...mockBranch.operationalHours,
        saturday: { open: null, close: null },
        sunday: { open: null, close: null }
      },
      updatedAt: expect.any(Date),
      updatedBy: mockUserId
    };

    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.updateBranchOperationalHours.mockResolvedValue(expectedUpdatedBranch);

    // Act
    const result = await updateBranchOperationalHours(branchId, closedDayData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchOperationalHours).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        operationalHours: expect.objectContaining({
          ...mockBranch.operationalHours,
          saturday: { open: null, close: null },
          sunday: { open: null, close: null }
        }),
        updatedBy: mockUserId
      })
    );
    expect(result.operationalHours.saturday.open).toBeNull();
    expect(result.operationalHours.saturday.close).toBeNull();
  });

  test('should throw ValidationError if one time is null but the other is not', async () => {
    // Arrange
    const invalidNullData = {
      operationalHours: {
        monday: { open: '08:00', close: null } // Invalid: one null, one not null
      }
    };

    branchRepository.findById.mockResolvedValue(mockBranch);

    // Act & Assert
    await expect(updateBranchOperationalHours(branchId, invalidNullData, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchOperationalHours).not.toHaveBeenCalled();
  });
});
