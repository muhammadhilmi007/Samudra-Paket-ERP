"use client";

/**
 * DocumentsForm Component
 * Fourth step in the employee form wizard for uploading employee documents
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import Card from '../../molecules/Card';
import FormField from '../../molecules/FormField';

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

const DocumentsForm = ({ data, updateData }) => {
  const [documents, setDocuments] = useState(data.documents || []);
  const [showForm, setShowForm] = useState(false);
  const [currentDocument, setCurrentDocument] = useState({
    id: '',
    name: '',
    type: DOCUMENT_TYPES[0],
    category: DOCUMENT_CATEGORIES[0],
    description: '',
    file: null,
    fileName: '',
    fileSize: 0,
    fileType: '',
    uploadDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    isSecure: true
  });
  
  // Update parent form data when documents change
  useEffect(() => {
    updateData({ documents });
  }, [documents, updateData]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files[0]) {
      setCurrentDocument({
        ...currentDocument,
        file: files[0],
        fileName: files[0].name,
        fileSize: Math.round(files[0].size / 1024), // Convert to KB
        fileType: files[0].name.split('.').pop().toUpperCase(),
      });
    } else if (type === 'checkbox') {
      setCurrentDocument({
        ...currentDocument,
        [name]: checked
      });
    } else {
      setCurrentDocument({
        ...currentDocument,
        [name]: value
      });
    }
  };
  
  // Add new document
  const handleAddDocument = (e) => {
    e.preventDefault();
    
    if (!currentDocument.name || !currentDocument.file) {
      // Show error notification
      return;
    }
    
    const newDocument = {
      ...currentDocument,
      id: `doc-${Date.now()}`,
      status: 'Valid'
    };
    
    setDocuments([...documents, newDocument]);
    setShowForm(false);
    setCurrentDocument({
      id: '',
      name: '',
      type: DOCUMENT_TYPES[0],
      category: DOCUMENT_CATEGORIES[0],
      description: '',
      file: null,
      fileName: '',
      fileSize: 0,
      fileType: '',
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      isSecure: true
    });
  };
  
  // Remove document
  const handleRemoveDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };
  
  return (
    <div className="space-y-6">
      <Typography variant="h2" className="text-xl font-semibold">
        Employee Documents
      </Typography>
      
      <div className="flex justify-between items-center mb-4">
        <Typography variant="body1" className="text-gray-600">
          Upload important employee documents securely
        </Typography>
        
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Document
        </Button>
      </div>
      
      {/* Document upload form */}
      {showForm && (
        <Card className="mb-6">
          <div className="p-4">
            <Typography variant="h3" className="text-lg font-semibold mb-4">
              Upload New Document
            </Typography>
            
            <form onSubmit={handleAddDocument} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  id="name"
                  label="Document Name"
                  type="text"
                  name="name"
                  value={currentDocument.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter document name"
                />
                
                <FormField
                  id="type"
                  label="Document Type"
                  type="select"
                  name="type"
                  value={currentDocument.type}
                  onChange={handleInputChange}
                  required
                  options={DOCUMENT_TYPES.map(type => ({ value: type, label: type }))}
                />
                
                <FormField
                  id="category"
                  label="Category"
                  type="select"
                  name="category"
                  value={currentDocument.category}
                  onChange={handleInputChange}
                  required
                  options={DOCUMENT_CATEGORIES.map(category => ({ value: category, label: category }))}
                />
                
                <FormField
                  id="expiryDate"
                  label="Expiry Date (if applicable)"
                  type="date"
                  name="expiryDate"
                  value={currentDocument.expiryDate}
                  onChange={handleInputChange}
                />
                
                <div className="md:col-span-2">
                  <FormField
                    id="description"
                    label="Description"
                    type="textarea"
                    name="description"
                    value={currentDocument.description}
                    onChange={handleInputChange}
                    placeholder="Enter document description"
                    rows={2}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document File
                  </label>
                  <div className="flex items-center">
                    <label className="block w-full">
                      <span className="sr-only">Choose file</span>
                      <input 
                        type="file" 
                        name="file"
                        onChange={handleInputChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary-50 file:text-primary-700
                          hover:file:bg-primary-100
                          focus:outline-none"
                        required
                      />
                    </label>
                  </div>
                  {currentDocument.fileName && (
                    <p className="mt-1 text-sm text-gray-500">
                      Selected: {currentDocument.fileName} ({currentDocument.fileSize} KB)
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      id="isSecure"
                      name="isSecure"
                      type="checkbox"
                      checked={currentDocument.isSecure}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isSecure" className="ml-2 block text-sm text-gray-700">
                      Mark as secure document (restricted access)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Upload Document
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}
      
      {/* Documents list */}
      {documents.length > 0 ? (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doc.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doc.type}</div>
                    <div className="text-xs text-gray-500">{doc.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doc.fileSize} KB</div>
                    <div className="text-xs text-gray-500">{doc.fileType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.uploadDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.expiryDate || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleRemoveDocument(doc.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <Typography variant="body1" className="mt-2 text-gray-500">
            No documents uploaded yet
          </Typography>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => setShowForm(true)}
          >
            Upload Document
          </Button>
        </div>
      )}
    </div>
  );
};

DocumentsForm.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default DocumentsForm;
