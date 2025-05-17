const { getBranchHierarchy } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');
const { NotFoundError } = require('../../../../../src/utils/errors');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('Get Branch Hierarchy Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const branchId = '60d21b4667d0d8992e610c85';
  
  const mockBranch = {
    _id: branchId,
    code: 'JKT-001',
    name: 'Jakarta Pusat',
    type: 'HUB',
    status: 'ACTIVE'
  };

  const mockChildBranches = [
    {
      _id: '60d21b4667d0d8992e610c86',
      code: 'JKT-002',
      name: 'Jakarta Selatan',
      type: 'BRANCH',
      status: 'ACTIVE',
      parentId: branchId
    },
    {
      _id: '60d21b4667d0d8992e610c87',
      code: 'JKT-003',
      name: 'Jakarta Barat',
      type: 'BRANCH',
      status: 'ACTIVE',
      parentId: branchId
    }
  ];

  const mockGrandchildBranches = [
    {
      _id: '60d21b4667d0d8992e610c88',
      code: 'JKT-004',
      name: 'Kebayoran Baru',
      type: 'AGENT',
      status: 'ACTIVE',
      parentId: '60d21b4667d0d8992e610c86'
    },
    {
      _id: '60d21b4667d0d8992e610c89',
      code: 'JKT-005',
      name: 'Kebon Jeruk',
      type: 'AGENT',
      status: 'ACTIVE',
      parentId: '60d21b4667d0d8992e610c87'
    }
  ];

  const mockHierarchy = {
    ...mockBranch,
    children: [
      {
        ...mockChildBranches[0],
        children: [
          {
            ...mockGrandchildBranches[0],
            children: []
          }
        ]
      },
      {
        ...mockChildBranches[1],
        children: [
          {
            ...mockGrandchildBranches[1],
            children: []
          }
        ]
      }
    ]
  };

  test('should retrieve branch hierarchy successfully', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.getBranchHierarchy.mockResolvedValue(mockHierarchy);

    // Act
    const result = await getBranchHierarchy(branchId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.getBranchHierarchy).toHaveBeenCalledWith(branchId);
    expect(result).toEqual(mockHierarchy);
  });

  test('should throw NotFoundError if branch does not exist', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getBranchHierarchy(branchId))
      .rejects
      .toThrow(NotFoundError);
    
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.getBranchHierarchy).not.toHaveBeenCalled();
  });

  test('should return branch with empty children if no child branches exist', async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.getBranchHierarchy.mockResolvedValue({
      ...mockBranch,
      children: []
    });

    // Act
    const result = await getBranchHierarchy(branchId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.getBranchHierarchy).toHaveBeenCalledWith(branchId);
    expect(result).toEqual({
      ...mockBranch,
      children: []
    });
  });

  test('should handle deep hierarchies', async () => {
    // Arrange
    const deepHierarchy = {
      ...mockBranch,
      children: [
        {
          ...mockChildBranches[0],
          children: [
            {
              ...mockGrandchildBranches[0],
              children: [
                {
                  _id: '60d21b4667d0d8992e610c90',
                  code: 'JKT-006',
                  name: 'Senayan',
                  type: 'COUNTER',
                  status: 'ACTIVE',
                  parentId: '60d21b4667d0d8992e610c88',
                  children: []
                }
              ]
            }
          ]
        }
      ]
    };

    branchRepository.findById.mockResolvedValue(mockBranch);
    branchRepository.getBranchHierarchy.mockResolvedValue(deepHierarchy);

    // Act
    const result = await getBranchHierarchy(branchId);

    // Assert
    expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
    expect(branchRepository.getBranchHierarchy).toHaveBeenCalledWith(branchId);
    expect(result).toEqual(deepHierarchy);
    expect(result.children[0].children[0].children[0].name).toBe('Senayan');
  });
});
