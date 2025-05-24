"use client";

/**
 * BranchDocumentsTab Component
 * Manages documents associated with a branch
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Modal from '../../molecules/Modal';
import { createNotificationHandler } from '../../../utils/notificationUtils';

// Mock document types
const DOCUMENT_TYPES = [
  'Legal Document',
  'Contract',
  'License',
  'Certificate',
  'Report',
  'Policy',
  'Manual',
  'Form',
  'Invoice',
  'Receipt',
  'Other'
];

// Mock document categories
const DOCUMENT_CATEGORIES = [
  'Operational',
  'Financial',
  'Administrative',
  'Compliance',
  'HR',
  'Marketing',
  'Facilities',
  'IT',
  'Other'
];

// Mock data for documents
const generateMockDocuments = (branchId) => {
  // Generate consistent mock data based on branchId
  const seed = branchId.charCodeAt(0) + branchId.charCodeAt(branchId.length - 1);
  
  const getRandomValue = (array) => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  };
  
  const getRandomDate = () => {
    const start = new Date(2022, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  };
  
  // Generate documents
  return Array(5 + (seed % 5)).fill().map((_, i) => {
    const docType = getRandomValue(DOCUMENT_TYPES);
    const category = getRandomValue(DOCUMENT_CATEGORIES);
    const uploadDate = getRandomDate();
    const expiryDate = Math.random() > 0.5 ? getRandomDate() : null;
    
    return {
      id: `doc-${branchId}-${i}`,
      name: `${docType} - ${i + 1}`,
      type: docType,
      category: category,
      description: `${category} ${docType.toLowerCase()} for branch operations.`,
      fileSize: Math.floor(Math.random() * 10000) + 100, // in KB
      fileType: Math.random() > 0.5 ? 'PDF' : (Math.random() > 0.5 ? 'DOCX' : 'XLSX'),
      uploadDate: uploadDate,
      expiryDate: expiryDate,
      status: expiryDate && new Date(expiryDate) < new Date() ? 'Expired' : 'Valid',
      uploadedBy: Math.random() > 0.5 ? 'John Doe' : 'Jane Smith',
    };
  });
};

const BranchDocumentsTab = ({ branchId }) => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State
  const [documents, setDocuments] = useState(generateMockDocuments(branchId));
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    description: '',
    expiryDate: '',
    file: null,
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        file: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || doc.type === filterType;
    const matchesCategory = filterCategory === '' || doc.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  // Open upload modal
  const openUploadModal = () => {
    setFormData({
      name: '',
      type: DOCUMENT_TYPES[0],
      category: DOCUMENT_CATEGORIES[0],
      description: '',
      expiryDate: '',
      file: null,
    });
    setIsUploadModalOpen(true);
  };
  
  // Open view modal
  const openViewModal = (document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };
  
  // Open delete modal
  const openDeleteModal = (document) => {
    setSelectedDocument(document);
    setIsDeleteModalOpen(true);
  };
  
  // Handle upload document
  const handleUploadDocument = () => {
    // Validate form
    if (!formData.name || !formData.type || !formData.category || !formData.file) {
      notifications.error('Please fill in all required fields');
      return;
    }
    
    // Create new document
    const newDocument = {
      id: `doc-${branchId}-${documents.length}`,
      name: formData.name,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      fileSize: Math.floor(Math.random() * 10000) + 100, // Mock file size
      fileType: formData.file.name.split('.').pop().toUpperCase(),
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || null,
      status: 'Valid',
      uploadedBy: 'Current User', // Would be the actual user in a real app
    };
    
    setDocuments([...documents, newDocument]);
    setIsUploadModalOpen(false);
    notifications.success('Document uploaded successfully');
  };
  
  // Handle delete document
  const handleDeleteDocument = () => {
    const updatedDocuments = documents.filter(doc => doc.id !== selectedDocument.id);
    
    setDocuments(updatedDocuments);
    setIsDeleteModalOpen(false);
    notifications.success('Document deleted successfully');
  };
  
  // Format file size
  const formatFileSize = (sizeInKB) => {
    if (sizeInKB < 1000) {
      return `${sizeInKB} KB`;
    } else {
      return `${(sizeInKB / 1000).toFixed(2)} MB`;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" className="text-xl font-semibold">
          Branch Documents
        </Typography>
        
        <Button
          variant="primary"
          onClick={openUploadModal}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
          Upload Document
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Types</option>
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                {DOCUMENT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <div className="p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <Typography variant="body1" className="mt-2 text-gray-600">
                  No documents found
                </Typography>
              </div>
            </Card>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <Card key={document.id} className="overflow-hidden">
              <div className={`h-2 ${document.status === 'Expired' ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="h3" className="text-md font-medium truncate">
                      {document.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 text-sm mt-1">
                      {document.type} • {document.category}
                    </Typography>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    document.status === 'Expired' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {document.status}
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600 line-clamp-2">
                  {document.description}
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>
                    <span className="block font-medium">File Type</span>
                    <span>{document.fileType}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Size</span>
                    <span>{formatFileSize(document.fileSize)}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Uploaded</span>
                    <span>{document.uploadDate}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Expires</span>
                    <span>{document.expiryDate || 'Never'}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewModal(document)}
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openDeleteModal(document)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Document Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Branch Operation License"
              required
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Document Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              {DOCUMENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter document description"
            />
          </div>
          
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Leave blank if the document doesn't expire</p>
          </div>
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Document File *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload a file</span>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      className="sr-only"
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, XLS, XLSX up to 10MB
                </p>
              </div>
            </div>
            {formData.file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {formData.file.name}
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUploadDocument}
              disabled={!formData.name || !formData.type || !formData.category || !formData.file}
            >
              Upload Document
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* View Document Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Document Details"
        size="lg"
      >
        {selectedDocument && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="h3" className="text-lg font-medium mb-4">
                  {selectedDocument.name}
                </Typography>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Document Type:</span>
                    <span className="text-sm text-gray-900">{selectedDocument.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <span className="text-sm text-gray-900">{selectedDocument.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">File Type:</span>
                    <span className="text-sm text-gray-900">{selectedDocument.fileType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">File Size:</span>
                    <span className="text-sm text-gray-900">{formatFileSize(selectedDocument.fileSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Upload Date:</span>
                    <span className="text-sm text-gray-900">{selectedDocument.uploadDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Expiry Date:</span>
                    <span className="text-sm text-gray-900">{selectedDocument.expiryDate || 'Never'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`text-sm font-medium ${
                      selectedDocument.status === 'Expired' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {selectedDocument.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Uploaded By:</span>
                    <span className="text-sm text-gray-900">{selectedDocument.uploadedBy}</span>
                  </div>
                </div>
                
                {selectedDocument.description && (
                  <div className="mt-4">
                    <Typography variant="body2" className="text-sm font-medium text-gray-500 mb-1">
                      Description:
                    </Typography>
                    <Typography variant="body1" className="text-sm text-gray-900">
                      {selectedDocument.description}
                    </Typography>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-100 rounded-md flex items-center justify-center p-4">
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <Typography variant="body1" className="mt-2 text-gray-600">
                    Document Preview
                  </Typography>
                  <Typography variant="body2" className="mt-1 text-gray-500">
                    Preview not available
                  </Typography>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <Typography variant="body1">
            Are you sure you want to delete the document <span className="font-semibold">{selectedDocument?.name}</span>?
            This action cannot be undone.
          </Typography>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteDocument}
            >
              Delete Document
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

BranchDocumentsTab.propTypes = {
  branchId: PropTypes.string.isRequired,
};

export default BranchDocumentsTab;
