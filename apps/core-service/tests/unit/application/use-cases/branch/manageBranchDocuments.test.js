const { manageBranchDocuments } = require('../../../../../src/application/use-cases/branch');
const branchRepository = require('../../../../../src/infrastructure/repositories/branchRepository');
const { NotFoundError, ValidationError } = require('../../../../../src/utils/errors');

// Mock the branch repository
jest.mock('../../../../../src/infrastructure/repositories/branchRepository');

describe('Manage Branch Documents Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const branchId = '60d21b4667d0d8992e610c85';
  const documentId = 'doc123';
  const mockUserId = 'user123';
  
  const mockBranch = {
    _id: branchId,
    code: 'JKT-001',
    name: 'Jakarta Pusat',
    type: 'HUB',
    status: 'ACTIVE',
    documents: [
      {
        _id: 'doc456',
        type: 'PERMIT',
        name: 'Operating Permit',
        fileUrl: 'https://storage.samudrapaket.com/documents/permit-jkt001.pdf',
        expiryDate: new Date('2024-12-31'),
        uploadedAt: new Date('2023-01-01'),
        uploadedBy: 'user456'
      }
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  };

  const newDocument = {
    type: 'LICENSE',
    name: 'Business License',
    fileUrl: 'https://storage.samudrapaket.com/documents/license-jkt001.pdf',
    expiryDate: new Date('2025-12-31')
  };

  describe('Add Document', () => {
    test('should add a document to a branch successfully', async () => {
      // Arrange
      const expectedBranchWithNewDoc = {
        ...mockBranch,
        documents: [
          ...mockBranch.documents,
          {
            _id: expect.any(String),
            ...newDocument,
            uploadedAt: expect.any(Date),
            uploadedBy: mockUserId
          }
        ],
        updatedAt: expect.any(Date),
        updatedBy: mockUserId
      };

      branchRepository.findById.mockResolvedValue(mockBranch);
      branchRepository.addBranchDocument.mockResolvedValue(expectedBranchWithNewDoc);

      // Act
      const result = await manageBranchDocuments(branchId, { action: 'add', document: newDocument }, mockUserId);

      // Assert
      expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
      expect(branchRepository.addBranchDocument).toHaveBeenCalledWith(
        branchId,
        expect.objectContaining({
          ...newDocument,
          uploadedAt: expect.any(Date),
          uploadedBy: mockUserId
        }),
        mockUserId
      );
      expect(result).toEqual(expectedBranchWithNewDoc);
      expect(result.documents.length).toBe(2);
      expect(result.documents[1].type).toBe('LICENSE');
    });

    test('should throw NotFoundError if branch does not exist', async () => {
      // Arrange
      branchRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(manageBranchDocuments(branchId, { action: 'add', document: newDocument }, mockUserId))
        .rejects
        .toThrow(NotFoundError);
      
      expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
      expect(branchRepository.addBranchDocument).not.toHaveBeenCalled();
    });

    test('should throw ValidationError if document data is invalid', async () => {
      // Arrange
      const invalidDocument = {
        // Missing required fields
        name: 'Business License',
        fileUrl: 'https://storage.samudrapaket.com/documents/license-jkt001.pdf'
      };

      branchRepository.findById.mockResolvedValue(mockBranch);

      // Act & Assert
      await expect(manageBranchDocuments(branchId, { action: 'add', document: invalidDocument }, mockUserId))
        .rejects
        .toThrow(ValidationError);
      
      expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
      expect(branchRepository.addBranchDocument).not.toHaveBeenCalled();
    });

    test('should throw ValidationError if document type is invalid', async () => {
      // Arrange
      const invalidTypeDocument = {
        ...newDocument,
        type: 'INVALID_TYPE'
      };

      branchRepository.findById.mockResolvedValue(mockBranch);

      // Act & Assert
      await expect(manageBranchDocuments(branchId, { action: 'add', document: invalidTypeDocument }, mockUserId))
        .rejects
        .toThrow(ValidationError);
      
      expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
      expect(branchRepository.addBranchDocument).not.toHaveBeenCalled();
    });

    test('should initialize documents array if it does not exist', async () => {
      // Arrange
      const branchWithoutDocuments = {
        ...mockBranch,
        documents: undefined
      };

      const expectedBranchWithNewDoc = {
        ...branchWithoutDocuments,
        documents: [
          {
            _id: expect.any(String),
            ...newDocument,
            uploadedAt: expect.any(Date),
            uploadedBy: mockUserId
          }
        ],
        updatedAt: expect.any(Date),
        updatedBy: mockUserId
      };

      branchRepository.findById.mockResolvedValue(branchWithoutDocuments);
      branchRepository.addBranchDocument.mockResolvedValue(expectedBranchWithNewDoc);

      // Act
      const result = await manageBranchDocuments(branchId, { action: 'add', document: newDocument }, mockUserId);

      // Assert
      expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
      expect(branchRepository.addBranchDocument).toHaveBeenCalledWith(
        branchId,
        expect.objectContaining({
          ...newDocument,
          uploadedAt: expect.any(Date),
          uploadedBy: mockUserId
        }),
        mockUserId
      );
      expect(result).toEqual(expectedBranchWithNewDoc);
      expect(result.documents.length).toBe(1);
    });
  });

  describe('Remove Document', () => {
    test('should remove a document from a branch successfully', async () => {
      // Arrange
      const branchWithMultipleDocuments = {
        ...mockBranch,
        documents: [
          ...mockBranch.documents,
          {
            _id: documentId,
            type: 'LICENSE',
            name: 'Business License',
            fileUrl: 'https://storage.samudrapaket.com/documents/license-jkt001.pdf',
            expiryDate: new Date('2025-12-31'),
            uploadedAt: new Date('2023-01-02'),
            uploadedBy: 'user789'
          }
        ]
      };

      const expectedBranchAfterRemoval = {
        ...branchWithMultipleDocuments,
        documents: [mockBranch.documents[0]],
        updatedAt: expect.any(Date),
        updatedBy: mockUserId
      };

      branchRepository.findById.mockResolvedValue(branchWithMultipleDocuments);
      branchRepository.removeBranchDocument.mockResolvedValue(expectedBranchAfterRemoval);

      // Act
      const result = await manageBranchDocuments(branchId, { action: 'remove', documentId }, mockUserId);

      // Assert
      expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
      expect(branchRepository.removeBranchDocument).toHaveBeenCalledWith(branchId, documentId, mockUserId);
      expect(result).toEqual(expectedBranchAfterRemoval);
      expect(result.documents.length).toBe(1);
      expect(result.documents[0]._id).toBe('doc456');
    });

    test('should throw NotFoundError if branch does not exist', async () => {
      // Arrange
      branchRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(manageBranchDocuments(branchId, { action: 'remove', documentId }, mockUserId))
        .rejects
        .toThrow(NotFoundError);
      
      expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
      expect(branchRepository.removeBranchDocument).not.toHaveBeenCalled();
    });

    test('should throw ValidationError if documentId is not provided', async () => {
      // Arrange
      branchRepository.findById.mockResolvedValue(mockBranch);

      // Act & Assert
      await expect(manageBranchDocuments(branchId, { action: 'remove' }, mockUserId))
        .rejects
        .toThrow(ValidationError);
      
      expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
      expect(branchRepository.removeBranchDocument).not.toHaveBeenCalled();
    });

    test('should throw NotFoundError if document does not exist in branch', async () => {
      // Arrange
      const nonExistentDocumentId = 'nonexistent-doc';

      branchRepository.findById.mockResolvedValue(mockBranch);
      branchRepository.removeBranchDocument.mockRejectedValue(new NotFoundError('Document not found'));

      // Act & Assert
      await expect(manageBranchDocuments(branchId, { action: 'remove', documentId: nonExistentDocumentId }, mockUserId))
        .rejects
        .toThrow(NotFoundError);
      
      expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
      expect(branchRepository.removeBranchDocument).toHaveBeenCalledWith(branchId, nonExistentDocumentId, mockUserId);
    });
  });

  describe('Invalid Action', () => {
    test('should throw ValidationError for invalid action', async () => {
      // Arrange
      branchRepository.findById.mockResolvedValue(mockBranch);

      // Act & Assert
      await expect(manageBranchDocuments(branchId, { action: 'invalid_action' }, mockUserId))
        .rejects
        .toThrow(ValidationError);
      
      expect(branchRepository.findById).toHaveBeenCalledWith(branchId);
      expect(branchRepository.addBranchDocument).not.toHaveBeenCalled();
      expect(branchRepository.removeBranchDocument).not.toHaveBeenCalled();
    });
  });
});
