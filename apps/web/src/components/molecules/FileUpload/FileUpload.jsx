"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { XMarkIcon, PaperClipIcon, CloudArrowUpIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import cn from 'classnames';
import { v4 as uuidv4 } from 'uuid';

/**
 * FileUpload Component
 * A reusable file upload component with drag-and-drop support and file previews
 */
const FileUpload = ({
  name,
  label,
  value = [],
  onChange,
  onRemove,
  multiple = true,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  disabled = false,
  required = false,
  error,
  helperText,
  className = '',
  dropzoneClassName = '',
  previewContainerClassName = '',
  previewItemClassName = '',
  showPreview = true,
  showFileSize = true,
  showRemoveButton = true,
  showDownloadButton = true,
  uploadButtonText = 'Choose files',
  dragActiveText = 'Drop the files here',
  dragInactiveText = 'Drag and drop files here, or click to select files',
}) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Initialize files from value prop
  useEffect(() => {
    if (value && value.length > 0) {
      setFiles(value);
    } else {
      setFiles([]);
    }
  }, [value]);

  // Handle file validation
  const validateFile = (file) => {
    const fileErrors = [];
    
    // Check file size
    if (file.size > maxSize) {
      fileErrors.push(`File is too large (max ${maxSize / (1024 * 1024)}MB)`);
    }
    
    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isAccepted = Object.entries(accept).some(([mimeType, extensions]) => {
      const mimeMatch = mimeType === '*' || file.type === mimeType;
      const extMatch = !extensions.length || extensions.some(ext => 
        file.name.toLowerCase().endsWith(ext.toLowerCase())
      );
      return mimeMatch && extMatch;
    });
    
    if (!isAccepted) {
      fileErrors.push('File type not supported');
    }
    
    return fileErrors.length > 0 ? fileErrors : null;
  };

  // Handle file selection
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const newErrors = {};
    
    // Process rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      newErrors[file.name] = errors.map(e => e.message);
    });
    
    // Process accepted files
    const newFiles = acceptedFiles.map(file => {
      const fileErrors = validateFile(file);
      if (fileErrors) {
        newErrors[file.name] = fileErrors;
        return null;
      }
      
      // Create preview URL for images
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      
      return {
        id: uuidv4(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        lastModified: file.lastModified,
        status: 'uploaded',
      };
    }).filter(Boolean);
    
    // Update state
    setErrors(prev => ({ ...prev, ...newErrors }));
    
    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);
      
      if (onChange) {
        onChange(updatedFiles);
      }
    }
  }, [files, multiple, onChange, accept, maxSize]);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: multiple ? maxFiles - files.length : 1,
    disabled: disabled || (multiple ? files.length >= maxFiles : files.length > 0),
    multiple,
  });

  // Handle file removal
  const handleRemove = (fileId, e) => {
    e.stopPropagation();
    
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    
    // Remove file from errors if it exists
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove && errors[fileToRemove.name]) {
      const newErrors = { ...errors };
      delete newErrors[fileToRemove.name];
      setErrors(newErrors);
    }
    
    if (onChange) {
      onChange(updatedFiles);
    }
    
    if (onRemove) {
      onRemove(fileId);
    }
  };

  // Handle file download
  const handleDownload = (file, e) => {
    e.stopPropagation();
    
    if (file.preview) {
      // For images, open in new tab
      window.open(file.preview, '_blank');
    } else {
      // For other files, create a download link
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (!fileType) return <PaperClipIcon className="h-5 w-5" />;
    
    if (fileType.startsWith('image/')) {
      return <img src={files.find(f => f.type.startsWith('image/'))?.preview} alt="Preview" className="h-10 w-10 object-cover rounded" />;
    }
    
    switch (fileType) {
      case 'application/pdf':
        return <div className="bg-red-100 text-red-600 p-2 rounded"><span className="text-xs font-bold">PDF</span></div>;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <div className="bg-blue-100 text-blue-600 p-2 rounded"><span className="text-xs font-bold">DOC</span></div>;
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <div className="bg-green-100 text-green-600 p-2 rounded"><span className="text-xs font-bold">XLS</span></div>;
      default:
        return <PaperClipIcon className="h-5 w-5" />;
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Dropzone */}
      <div
        {...getRootProps({
          className: cn(
            'border-2 border-dashed rounded-md p-6 text-center transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
            {
              'border-primary-500 bg-primary-50': isDragActive,
              'border-gray-300 hover:border-gray-400': !isDragActive && !disabled,
              'border-gray-200 bg-gray-50 cursor-not-allowed': disabled,
              'border-red-500': error,
            },
            dropzoneClassName
          ),
          onClick: (e) => {
            if (disabled || (multiple ? files.length >= maxFiles : files.length > 0)) {
              e.stopPropagation();
            }
          },
        })}
      >
        <input 
          {...getInputProps({ name })} 
          ref={fileInputRef} 
          disabled={disabled || (multiple ? files.length >= maxFiles : files.length > 0)}
        />
        
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary-100 p-3">
              <CloudArrowUpIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          
          <div className="text-sm">
            {isDragActive ? (
              <p className="font-medium text-primary-700">{dragActiveText}</p>
            ) : (
              <>
                <p className="font-medium text-gray-700">
                  {dragInactiveText}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {`${Object.values(accept).flat().join(', ')} (Max ${maxSize / (1024 * 1024)}MB)`}
                  {multiple && maxFiles > 1 && ` • Max ${maxFiles} files`}
                </p>
              </>
            )}
          </div>
          
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || (multiple ? files.length >= maxFiles : files.length > 0)}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-2"
            >
              {uploadButtonText}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      
      {/* File previews */}
      {showPreview && files.length > 0 && (
        <div className={cn('mt-4 space-y-3', previewContainerClassName)}>
          <h4 className="text-sm font-medium text-gray-700">
            {files.length} {files.length === 1 ? 'file' : 'files'} selected
          </h4>
          
          <ul className="space-y-2">
            {files.map((file) => (
              <li 
                key={file.id}
                className={cn(
                  'group relative flex items-center justify-between p-3 bg-white rounded-md border border-gray-200',
                  'hover:bg-gray-50 transition-colors',
                  { 'border-red-200 bg-red-50': errors[file.name] },
                  previewItemClassName
                )}
                onClick={() => handleDownload(file, { stopPropagation: () => {} })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDownload(file, e);
                  }
                }}
              >
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0 mr-3">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    
                    {showFileSize && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    )}
                    
                    {errors[file.name] && (
                      <div className="mt-1 flex items-center">
                        <ExclamationCircleIcon className="h-3 w-3 text-red-500 mr-1" />
                        <p className="text-xs text-red-600">
                          {errors[file.name].join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.status === 'uploading' && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                  )}
                  
                  {file.status === 'error' && (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  
                  {file.status === 'uploaded' && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                  
                  {showDownloadButton && file.status === 'uploaded' && (
                    <button
                      type="button"
                      onClick={(e) => handleDownload(file, e)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      aria-label={`Download ${file.name}`}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                  )}
                  
                  {showRemoveButton && (
                    <button
                      type="button"
                      onClick={(e) => handleRemove(file.id, e)}
                      className="text-gray-400 hover:text-red-600 focus:outline-none"
                      disabled={disabled}
                      aria-label={`Remove ${file.name}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  /**
   * Name attribute for the file input
   */
  name: PropTypes.string,
  /**
   * Label text for the file upload
   */
  label: PropTypes.node,
  /**
   * Array of file objects to display as selected
   */
  value: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      file: PropTypes.instanceOf(File),
      name: PropTypes.string.isRequired,
      size: PropTypes.number,
      type: PropTypes.string,
      preview: PropTypes.string,
      status: PropTypes.oneOf(['uploading', 'uploaded', 'error']),
    })
  ),
  /**
   * Callback function when files are selected or changed
   * @param {Array} files - Array of file objects
   */
  onChange: PropTypes.func,
  /**
   * Callback function when a file is removed
   * @param {string|number} fileId - ID of the removed file
   */
  onRemove: PropTypes.func,
  /**
   * Whether to allow multiple file selection
   */
  multiple: PropTypes.bool,
  /**
   * Accepted file types
   */
  accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  /**
   * Maximum file size in bytes
   */
  maxSize: PropTypes.number,
  /**
   * Maximum number of files allowed
   */
  maxFiles: PropTypes.number,
  /**
   * Whether the file upload is disabled
   */
  disabled: PropTypes.bool,
  /**
   * Whether the file upload is required
   */
  required: PropTypes.bool,
  /**
   * Error message to display
   */
  error: PropTypes.string,
  /**
   * Helper text to display below the input
   */
  helperText: PropTypes.string,
  /**
   * Additional CSS classes for the container
   */
  className: PropTypes.string,
  /**
   * Additional CSS classes for the dropzone
   */
  dropzoneClassName: PropTypes.string,
  /**
   * Additional CSS classes for the preview container
   */
  previewContainerClassName: PropTypes.string,
  /**
   * Additional CSS classes for each preview item
   */
  previewItemClassName: PropTypes.string,
  /**
   * Whether to show file previews
   */
  showPreview: PropTypes.bool,
  /**
   * Whether to show file sizes in preview
   */
  showFileSize: PropTypes.bool,
  /**
   * Whether to show remove buttons for each file
   */
  showRemoveButton: PropTypes.bool,
  /**
   * Whether to show download buttons for each file
   */
  showDownloadButton: PropTypes.bool,
  /**
   * Text for the upload button
   */
  uploadButtonText: PropTypes.string,
  /**
   * Text to show when dragging files over the dropzone
   */
  dragActiveText: PropTypes.string,
  /**
   * Text to show when dropzone is inactive
   */
  dragInactiveText: PropTypes.string,
};

export default FileUpload;
