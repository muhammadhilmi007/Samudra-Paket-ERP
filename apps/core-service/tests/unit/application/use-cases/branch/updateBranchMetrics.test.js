const { updateBranchMetrics } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');
const { NotFoundError, ValidationError } = require('../../../../../src/utils/errors');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('Update Branch Metrics Use Case', () => {
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
    metrics: {
      dailyShipments: 100,
      monthlyRevenue: 50000000,
      customerSatisfaction: 4.5,
      onTimeDeliveryRate: 0.9
    },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  };

  const metricsData = {
    metrics: {
      dailyShipments: 120,
      monthlyRevenue: 75000000,
      customerSatisfaction: 4.8,
      onTimeDeliveryRate: 0.95
    }
  };

  const updatedBranch = {
    ...mockBranch,
    metrics: {
      dailyShipments: 120,
      monthlyRevenue: 75000000,
      customerSatisfaction: 4.8,
      onTimeDeliveryRate: 0.95
    },
    updatedAt: expect.any(Date),
    updatedBy: mockUserId
  };

  test('should update branch metrics successfully', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.updateBranchMetrics.mockResolvedValue(updatedBranch);

    // Act
    const result = await updateBranchMetrics(branchId, metricsData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchMetrics).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        metrics: metricsData.metrics,
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(updatedBranch);
  });

  test('should throw NotFoundError if branch does not exist', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateBranchMetrics(branchId, metricsData, mockUserId))
      .rejects
      .toThrow(NotFoundError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchMetrics).not.toHaveBeenCalled();
  });

  test('should throw ValidationError if metrics data is invalid', async () => {
    // Arrange
    const invalidMetricsData = {
      metrics: {
        dailyShipments: -10, // Invalid negative value
        monthlyRevenue: 75000000,
        customerSatisfaction: 6.5, // Invalid value > 5
        onTimeDeliveryRate: 0.95
      }
    };

    branchRepository.findById.mockResolvedValue(mockBranch);

    // Act & Assert
    await expect(updateBranchMetrics(branchId, invalidMetricsData, mockUserId))
      .rejects
      .toThrow(ValidationError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchMetrics).not.toHaveBeenCalled();
  });

  test('should update only provided metrics fields', async () => {
    // Arrange
    const partialMetricsData = {
      metrics: {
        dailyShipments: 120,
        monthlyRevenue: 75000000
        // Other fields not provided
      }
    };

    const expectedUpdatedBranch = {
      ...mockBranch,
      metrics: {
        ...mockBranch.metrics,
        dailyShipments: 120,
        monthlyRevenue: 75000000
      },
      updatedAt: expect.any(Date),
      updatedBy: mockUserId
    };

    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.updateBranchMetrics.mockResolvedValue(expectedUpdatedBranch);

    // Act
    const result = await updateBranchMetrics(branchId, partialMetricsData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchMetrics).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        metrics: expect.objectContaining({
          dailyShipments: 120,
          monthlyRevenue: 75000000,
          customerSatisfaction: 4.5, // Preserved from existing data
          onTimeDeliveryRate: 0.9    // Preserved from existing data
        }),
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(expectedUpdatedBranch);
  });

  test('should initialize metrics if they do not exist', async () => {
    // Arrange
    const branchWithoutMetrics = {
      ...mockBranch,
      metrics: undefined
    };

    branchRepository.findById.mockResolvedValue(branchWithoutMetrics);
    branchRepository.updateBranchMetrics.mockResolvedValue(updatedBranch);

    // Act
    const result = await updateBranchMetrics(branchId, metricsData, mockUserId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.updateBranchMetrics).toHaveBeenCalledWith(
      branchId,
      expect.objectContaining({
        metrics: metricsData.metrics,
        updatedBy: mockUserId
      })
    );
    expect(result).toEqual(updatedBranch);
  });
});
