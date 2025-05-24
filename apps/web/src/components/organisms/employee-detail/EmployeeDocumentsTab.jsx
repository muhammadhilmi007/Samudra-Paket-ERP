"use client";

/**
 * EmployeeDocumentsTab Component
 * Manages documents associated with an employee with secure upload
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Modal from '../../molecules/Modal';
import { createNotificationHandler } from '../../../utils/notificationUtils';

// Document types
const DOCUMENT_TYPES = [
  'ID Card',
  'Family Card',
  'Tax Card',
  'Diploma',
  'Certificate',
  'Contract',
  'Performance Review',
  'Medical Record',
  'Insurance',
  'Visa',
  'Work Permit',
  'Other'
];

// Document categories
const DOCUMENT_CATEGORIES = [
  'Personal',
  'Educational',
  'Employment',
  'Financial',
  'Medical',
  'Legal',
  'Other'
];

// Mock data for documents
const generateMockDocuments = (employeeId) => {
  return [
    {
      id: `doc-${employeeId}-1`,
      name: 'ID Card',
      type: 'ID Card',
      category: 'Personal',
      description: 'National ID card',
      fileSize: 1250, // in KB
      fileType: 'PDF',
      uploadDate: '2023-01-15',
      expiryDate: '2028-01-14',
      status: 'Valid',
      isSecure: true,
      uploadedBy: 'HR Manager',
    },
    {
      id: `doc-${employeeId}-2`,
      name: 'Employment Contract',
      type: 'Contract',
      category: 'Employment',
      description: 'Permanent employment contract',
      fileSize: 2450, // in KB
      fileType: 'PDF',
      uploadDate: '2020-05-15',
      expiryDate: null,
      status: 'Valid',
      isSecure: true,
      uploadedBy: 'HR Manager',
    },
    {
      id: `doc-${employeeId}-3`,
      name: 'Bachelor Degree',
      type: 'Diploma',
      category: 'Educational',
      description: 'University of Indonesia - Business Management',
      fileSize: 3200, // in KB
      fileType: 'PDF',
      uploadDate: '2020-05-15',
      expiryDate: null,
      status: 'Valid',
      isSecure: false,
      uploadedBy: 'HR Manager',
    },
    {
      id: `doc-${employeeId}-4`,
      name: 'Performance Review 2023',
      type: 'Performance Review',
      category: 'Employment',
      description: 'Annual performance review for 2023',
      fileSize: 1800, // in KB
      fileType: 'PDF',
      uploadDate: '2023-12-20',
      expiryDate: null,
      status: 'Valid',
      isSecure: true,
      uploadedBy: 'Branch Manager',
    },
    {
      id: `doc-${employeeId}-5`,
      name: 'Health Insurance Card',
      type: 'Insurance',
      category: 'Medical',
      description: 'Company health insurance card',
      fileSize: 950, // in KB
      fileType: 'PDF',
      uploadDate: '2022-01-10',
      expiryDate: '2025-01-09',
      status: 'Valid',
      isSecure: true,
      uploadedBy: 'HR Manager',
    }
  ];
};

const EmployeeDocumentsTab = ({ employeeId }) => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State
  const [documents, setDocuments] = useState(generateMockDocuments(employeeId));
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
    isSecure: true,
    file: null,
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        file: files[0],
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
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
      isSecure: true,
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
      id: `doc-${employeeId}-${documents.length + 1}`,
      name: formData.name,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      fileSize: Math.floor(Math.random() * 5000) + 500, // Mock file size
      fileType: formData.file.name.split('.').pop().toUpperCase(),
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || null,
      status: 'Valid',
      isSecure: formData.isSecure,
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
          Employee Documents
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
                    <div className="flex items-center">
                      <Typography variant="h3" className="text-md font-medium truncate">
                        {document.name}
                      </Typography>
                      {document.isSecure && (
                        <svg className="ml-1 h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
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
              placeholder="e.g., Employee ID Card"
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
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSecure"
              name="isSecure"
              checked={formData.isSecure}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isSecure" className="ml-2 block text-sm text-gray-900">
              Secure Document (restricted access)
            </label>
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
                  PDF, DOC, DOCX, JPG, PNG up to 10MB
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
                <div className="flex items-center">
                  <Typography variant="h3" className="text-lg font-medium mb-4">
                    {selectedDocument.name}
                  </Typography>
                  {selectedDocument.isSecure && (
                    <svg className="ml-2 h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                
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
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Security Level:</span>
                    <span className="text-sm text-gray-900">
                      {selectedDocument.isSecure ? 'Restricted Access' : 'Standard Access'}
                    </span>
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

EmployeeDocumentsTab.propTypes = {
  employeeId: PropTypes.string.isRequired,
};

export default EmployeeDocumentsTab;
