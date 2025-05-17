const { listBranches } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('List Branches Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBranches = [
    {
      _id: '60d21b4667d0d8992e610c85',
      code: 'JKT-001',
      name: 'Jakarta Pusat',
      type: 'HUB',
      status: 'ACTIVE',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      _id: '60d21b4667d0d8992e610c86',
      code: 'BDG-001',
      name: 'Bandung',
      type: 'BRANCH',
      status: 'ACTIVE',
      parentId: '60d21b4667d0d8992e610c85',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02')
    },
    {
      _id: '60d21b4667d0d8992e610c87',
      code: 'SMG-001',
      name: 'Semarang',
      type: 'BRANCH',
      status: 'INACTIVE',
      createdAt: new Date('2023-01-03'),
      updatedAt: new Date('2023-01-03')
    }
  ];

  const mockPagination = {
    total: 3,
    page: 1,
    limit: 10,
    totalPages: 1
  };

  test('should list branches with default pagination', async () => {
    // Arrange
    branchRepository.findAll.mockResolvedValue({
      branches: mockBranches,
      pagination: mockPagination
    });

    // Act
    const result = await listBranches({});

    // Assert
    expect(branchRepository.findAll).toHaveBeenCalledWith({
      filter: {},
      page: 1,
      limit: 10,
      sort: { createdAt: -1 }
    });
    expect(result).toEqual({
      branches: mockBranches,
      pagination: mockPagination
    });
  });

  test('should list branches with custom pagination', async () => {
    // Arrange
    const customPagination = {
      total: 3,
      page: 2,
      limit: 2,
      totalPages: 2
    };

    branchRepository.findAll.mockResolvedValue({
      branches: [mockBranches[2]],
      pagination: customPagination
    });

    // Act
    const result = await listBranches({
      page: 2,
      limit: 2
    });

    // Assert
    expect(branchRepository.findAll).toHaveBeenCalledWith({
      filter: {},
      page: 2,
      limit: 2,
      sort: { createdAt: -1 }
    });
    expect(result).toEqual({
      branches: [mockBranches[2]],
      pagination: customPagination
    });
  });

  test('should list branches with filtering by type', async () => {
    // Arrange
    branchRepository.findAll.mockResolvedValue({
      branches: [mockBranches[1], mockBranches[2]],
      pagination: {
        ...mockPagination,
        total: 2
      }
    });

    // Act
    const result = await listBranches({
      type: 'BRANCH'
    });

    // Assert
    expect(branchRepository.findAll).toHaveBeenCalledWith({
      filter: { type: 'BRANCH' },
      page: 1,
      limit: 10,
      sort: { createdAt: -1 }
    });
    expect(result.branches.length).toBe(2);
    expect(result.branches[0].type).toBe('BRANCH');
    expect(result.branches[1].type).toBe('BRANCH');
  });

  test('should list branches with filtering by status', async () => {
    // Arrange
    branchRepository.findAll.mockResolvedValue({
      branches: [mockBranches[0], mockBranches[1]],
      pagination: {
        ...mockPagination,
        total: 2
      }
    });

    // Act
    const result = await listBranches({
      status: 'ACTIVE'
    });

    // Assert
    expect(branchRepository.findAll).toHaveBeenCalledWith({
      filter: { status: 'ACTIVE' },
      page: 1,
      limit: 10,
      sort: { createdAt: -1 }
    });
    expect(result.branches.length).toBe(2);
    expect(result.branches[0].status).toBe('ACTIVE');
    expect(result.branches[1].status).toBe('ACTIVE');
  });

  test('should list branches with filtering by parent', async () => {
    // Arrange
    branchRepository.findAll.mockResolvedValue({
      branches: [mockBranches[1]],
      pagination: {
        ...mockPagination,
        total: 1
      }
    });

    // Act
    const result = await listBranches({
      parentId: '60d21b4667d0d8992e610c85'
    });

    // Assert
    expect(branchRepository.findAll).toHaveBeenCalledWith({
      filter: { parentId: '60d21b4667d0d8992e610c85' },
      page: 1,
      limit: 10,
      sort: { createdAt: -1 }
    });
    expect(result.branches.length).toBe(1);
    expect(result.branches[0].parentId).toBe('60d21b4667d0d8992e610c85');
  });

  test('should list branches with custom sorting', async () => {
    // Arrange
    branchRepository.findAll.mockResolvedValue({
      branches: [...mockBranches].sort((a, b) => a.name.localeCompare(b.name)),
      pagination: mockPagination
    });

    // Act
    const result = await listBranches({
      sortBy: 'name',
      sortOrder: 'asc'
    });

    // Assert
    expect(branchRepository.findAll).toHaveBeenCalledWith({
      filter: {},
      page: 1,
      limit: 10,
      sort: { name: 1 }
    });
    expect(result.branches[0].name).toBe('Bandung');
    expect(result.branches[1].name).toBe('Jakarta Pusat');
    expect(result.branches[2].name).toBe('Semarang');
  });

  test('should handle empty result', async () => {
    // Arrange
    branchRepository.findAll.mockResolvedValue({
      branches: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }
    });

    // Act
    const result = await listBranches({
      status: 'PENDING'
    });

    // Assert
    expect(branchRepository.findAll).toHaveBeenCalledWith({
      filter: { status: 'PENDING' },
      page: 1,
      limit: 10,
      sort: { createdAt: -1 }
    });
    expect(result.branches).toEqual([]);
    expect(result.pagination.total).toBe(0);
  });

  test('should handle search by name or code', async () => {
    // Arrange
    branchRepository.findAll.mockResolvedValue({
      branches: [mockBranches[0]],
      pagination: {
        ...mockPagination,
        total: 1
      }
    });

    // Act
    const result = await listBranches({
      search: 'Jakarta'
    });

    // Assert
    expect(branchRepository.findAll).toHaveBeenCalledWith({
      filter: {
        $or: [
          { name: { $regex: 'Jakarta', $options: 'i' } },
          { code: { $regex: 'Jakarta', $options: 'i' } }
        ]
      },
      page: 1,
      limit: 10,
      sort: { createdAt: -1 }
    });
    expect(result.branches.length).toBe(1);
    expect(result.branches[0].name).toBe('Jakarta Pusat');
  });
});
