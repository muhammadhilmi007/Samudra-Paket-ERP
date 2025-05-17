/**
 * Manage Branch Documents Use Case
 * Handles the business logic for managing branch documents
 */

const { branchRepository } = require('../../../infrastructure/repositories');
const { logger } = require('../../../utils');

/**
 * Add document to branch
 * @param {string} branchId - Branch ID
 * @param {Object} document - Document data
 * @param {string} userId - User ID adding the document
 * @returns {Promise<Object>} - Returns updated branch
 */
const addDocument = async (branchId, document, userId) => {
  try {
    // Check if branch exists
    const branch = await branchRepository.findById(branchId);
    if (!branch) {
      throw new Error(`Branch with ID ${branchId} not found`);
    }
    
    // Validate document
    if (!document.name || !document.type || !document.fileUrl) {
      throw new Error('Document must have name, type, and fileUrl');
    }
    
    // Add metadata
    document.uploadedBy = userId;
    document.uploadedAt = new Date();
    
    // Add document
    const updatedBranch = await branchRepository.addDocument(branchId, document);
    
    // Update metadata
    await branchRepository.updateById(branchId, {
      updatedBy: userId,
      updatedAt: new Date()
    });
    
    logger.info(`Document added to branch: ${branch.code} - ${document.name}`, { branchId, userId, documentName: document.name });
    
    return updatedBranch;
  } catch (error) {
    logger.error(`Error adding document to branch: ${error.message}`, { error, branchId, document });
    throw error;
  }
};

/**
 * Remove document from branch
 * @param {string} branchId - Branch ID
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID removing the document
 * @returns {Promise<Object>} - Returns updated branch
 */
const removeDocument = async (branchId, documentId, userId) => {
  try {
    // Check if branch exists
    const branch = await branchRepository.findById(branchId);
    if (!branch) {
      throw new Error(`Branch with ID ${branchId} not found`);
    }
    
    // Check if document exists
    const documentExists = branch.documents.some(doc => doc._id.toString() === documentId);
    if (!documentExists) {
      throw new Error(`Document with ID ${documentId} not found in branch ${branchId}`);
    }
    
    // Remove document
    const updatedBranch = await branchRepository.removeDocument(branchId, documentId);
    
    // Update metadata
    await branchRepository.updateById(branchId, {
      updatedBy: userId,
      updatedAt: new Date()
    });
    
    logger.info(`Document removed from branch: ${branch.code} - ${documentId}`, { branchId, userId, documentId });
    
    return updatedBranch;
  } catch (error) {
    logger.error(`Error removing document from branch: ${error.message}`, { error, branchId, documentId });
    throw error;
  }
};

module.exports = {
  addDocument,
  removeDocument
};
