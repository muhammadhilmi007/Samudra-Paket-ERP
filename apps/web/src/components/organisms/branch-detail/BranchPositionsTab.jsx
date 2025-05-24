"use client";

/**
 * BranchPositionsTab Component
 * Manages positions within a branch with role assignment capabilities
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Modal from '../../molecules/Modal';
import DataTable from '../../organisms/DataTable';
import { createNotificationHandler } from '../../../utils/notificationUtils';

// Mock position data
const generateMockPositions = (branchId) => {
  const positions = [
    {
      id: `pos-${branchId}-1`,
      name: 'Branch Manager',
      department: 'Management',
      level: 'Senior',
      headcount: 1,
      filled: 1,
      isActive: true,
      responsibilities: [
        'Overall branch management',
        'Team leadership',
        'Performance monitoring',
        'Strategic planning'
      ],
      requirements: 'Minimum 5 years experience in logistics management',
      reportingTo: 'Regional Director'
    },
    {
      id: `pos-${branchId}-2`,
      name: 'Operations Supervisor',
      department: 'Operations',
      level: 'Middle',
      headcount: 2,
      filled: 2,
      isActive: true,
      responsibilities: [
        'Daily operations oversight',
        'Staff scheduling',
        'Process optimization',
        'Quality control'
      ],
      requirements: 'Minimum 3 years experience in logistics operations',
      reportingTo: 'Branch Manager'
    },
    {
      id: `pos-${branchId}-3`,
      name: 'Customer Service Representative',
      department: 'Customer Service',
      level: 'Entry',
      headcount: 5,
      filled: 4,
      isActive: true,
      responsibilities: [
        'Customer inquiry handling',
        'Complaint resolution',
        'Order processing',
        'Customer follow-up'
      ],
      requirements: 'Excellent communication skills, customer service experience',
      reportingTo: 'Operations Supervisor'
    },
    {
      id: `pos-${branchId}-4`,
      name: 'Warehouse Coordinator',
      department: 'Warehouse',
      level: 'Middle',
      headcount: 1,
      filled: 1,
      isActive: true,
      responsibilities: [
        'Inventory management',
        'Warehouse organization',
        'Shipment preparation',
        'Stock reconciliation'
      ],
      requirements: 'Experience in warehouse management, inventory control',
      reportingTo: 'Operations Supervisor'
    },
    {
      id: `pos-${branchId}-5`,
      name: 'Courier Coordinator',
      department: 'Delivery',
      level: 'Middle',
      headcount: 1,
      filled: 0,
      isActive: true,
      responsibilities: [
        'Courier scheduling',
        'Route optimization',
        'Delivery monitoring',
        'Performance tracking'
      ],
      requirements: 'Experience in delivery operations, team management',
      reportingTo: 'Operations Supervisor'
    },
    {
      id: `pos-${branchId}-6`,
      name: 'Administrative Assistant',
      department: 'Administration',
      level: 'Entry',
      headcount: 2,
      filled: 1,
      isActive: true,
      responsibilities: [
        'Administrative support',
        'Document processing',
        'Filing and record keeping',
        'Office management'
      ],
      requirements: 'Administrative experience, proficiency in office software',
      reportingTo: 'Branch Manager'
    }
  ];
  
  return positions;
};

const BranchPositionsTab = ({ branchId }) => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State
  const [positions, setPositions] = useState(generateMockPositions(branchId));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    level: 'Entry',
    headcount: 1,
    isActive: true,
    responsibilities: '',
    requirements: '',
    reportingTo: ''
  });
  
  // Get unique departments for filtering
  const departments = [...new Set(positions.map(pos => pos.department))];
  
  // Get unique levels for filtering
  const levels = [...new Set(positions.map(pos => pos.level))];
  
  // Filter positions
  const filteredPositions = positions.filter(pos => {
    const matchesDepartment = filterDepartment === '' || pos.department === filterDepartment;
    const matchesLevel = filterLevel === '' || pos.level === filterLevel;
    return matchesDepartment && matchesLevel;
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'headcount') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Open add modal
  const openAddModal = () => {
    setFormData({
      name: '',
      department: '',
      level: 'Entry',
      headcount: 1,
      isActive: true,
      responsibilities: '',
      requirements: '',
      reportingTo: ''
    });
    setIsAddModalOpen(true);
  };
  
  // Open edit modal
  const openEditModal = (position) => {
    setSelectedPosition(position);
    setFormData({
      name: position.name,
      department: position.department,
      level: position.level,
      headcount: position.headcount,
      isActive: position.isActive,
      responsibilities: position.responsibilities.join('\\n'),
      requirements: position.requirements,
      reportingTo: position.reportingTo
    });
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const openDeleteModal = (position) => {
    setSelectedPosition(position);
    setIsDeleteModalOpen(true);
  };
  
  // Open view modal
  const openViewModal = (position) => {
    setSelectedPosition(position);
    setIsViewModalOpen(true);
  };
  
  // Handle add position
  const handleAddPosition = () => {
    // Validate form
    if (!formData.name || !formData.department) {
      notifications.error('Please fill in all required fields');
      return;
    }
    
    // Create new position
    const newPosition = {
      id: `pos-${branchId}-${positions.length + 1}`,
      name: formData.name,
      department: formData.department,
      level: formData.level,
      headcount: formData.headcount,
      filled: 0,
      isActive: formData.isActive,
      responsibilities: formData.responsibilities.split('\\n').filter(r => r.trim() !== ''),
      requirements: formData.requirements,
      reportingTo: formData.reportingTo
    };
    
    setPositions([...positions, newPosition]);
    setIsAddModalOpen(false);
    notifications.success('Position added successfully');
  };
  
  // Handle edit position
  const handleEditPosition = () => {
    // Validate form
    if (!formData.name || !formData.department) {
      notifications.error('Please fill in all required fields');
      return;
    }
    
    // Update position
    const updatedPositions = positions.map(pos => {
      if (pos.id === selectedPosition.id) {
        return {
          ...pos,
          name: formData.name,
          department: formData.department,
          level: formData.level,
          headcount: formData.headcount,
          isActive: formData.isActive,
          responsibilities: formData.responsibilities.split('\\n').filter(r => r.trim() !== ''),
          requirements: formData.requirements,
          reportingTo: formData.reportingTo
        };
      }
      return pos;
    });
    
    setPositions(updatedPositions);
    setIsEditModalOpen(false);
    notifications.success('Position updated successfully');
  };
  
  // Handle delete position
  const handleDeletePosition = () => {
    const updatedPositions = positions.filter(pos => pos.id !== selectedPosition.id);
    
    setPositions(updatedPositions);
    setIsDeleteModalOpen(false);
    notifications.success('Position deleted successfully');
  };
  
  // Table columns
  const columns = [
    {
      header: 'Position',
      accessorKey: 'name',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Department',
      accessorKey: 'department',
    },
    {
      header: 'Level',
      accessorKey: 'level',
      cell: (info) => {
        const value = info.getValue();
        let bgColor = 'bg-gray-100 text-gray-800';
        
        if (value === 'Senior') bgColor = 'bg-blue-100 text-blue-800';
        if (value === 'Middle') bgColor = 'bg-green-100 text-green-800';
        if (value === 'Entry') bgColor = 'bg-yellow-100 text-yellow-800';
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
            {value}
          </span>
        );
      },
    },
    {
      header: 'Headcount',
      accessorKey: 'headcount',
      cell: (info) => (
        <div className="text-center">
          <span className="font-medium">{info.row.original.filled}</span>
          <span className="text-gray-500">/{info.getValue()}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            info.getValue()
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openViewModal(info.row.original)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(info.row.original)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => openDeleteModal(info.row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" className="text-xl font-semibold">
          Positions
        </Typography>
        
        <Button
          variant="primary"
          onClick={openAddModal}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Position
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="filterDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="filterDepartment"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="filterLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                id="filterLevel"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Levels</option>
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Positions Table */}
      <Card>
        <div className="p-4">
          <DataTable
            columns={columns}
            data={filteredPositions}
            emptyMessage="No positions defined for this branch"
          />
        </div>
      </Card>
      
      {/* Add Position Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Position"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Position Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Branch Manager"
              required
            />
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department *
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Management"
              required
            />
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Level *
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              <option value="Entry">Entry</option>
              <option value="Middle">Middle</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="headcount" className="block text-sm font-medium text-gray-700">
              Headcount *
            </label>
            <input
              type="number"
              id="headcount"
              name="headcount"
              value={formData.headcount}
              onChange={handleInputChange}
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="reportingTo" className="block text-sm font-medium text-gray-700">
              Reporting To
            </label>
            <input
              type="text"
              id="reportingTo"
              name="reportingTo"
              value={formData.reportingTo}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Branch Manager"
            />
          </div>
          
          <div>
            <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">
              Responsibilities
            </label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter responsibilities (one per line)"
            />
            <p className="mt-1 text-xs text-gray-500">Enter one responsibility per line</p>
          </div>
          
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
              Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter position requirements"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddPosition}
              disabled={!formData.name || !formData.department}
            >
              Add Position
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Edit Position Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Position"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
              Position Name *
            </label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="edit-department" className="block text-sm font-medium text-gray-700">
              Department *
            </label>
            <input
              type="text"
              id="edit-department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="edit-level" className="block text-sm font-medium text-gray-700">
              Level *
            </label>
            <select
              id="edit-level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              <option value="Entry">Entry</option>
              <option value="Middle">Middle</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="edit-headcount" className="block text-sm font-medium text-gray-700">
              Headcount *
            </label>
            <input
              type="number"
              id="edit-headcount"
              name="headcount"
              value={formData.headcount}
              onChange={handleInputChange}
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="edit-reportingTo" className="block text-sm font-medium text-gray-700">
              Reporting To
            </label>
            <input
              type="text"
              id="edit-reportingTo"
              name="reportingTo"
              value={formData.reportingTo}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="edit-responsibilities" className="block text-sm font-medium text-gray-700">
              Responsibilities
            </label>
            <textarea
              id="edit-responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Enter one responsibility per line</p>
          </div>
          
          <div>
            <label htmlFor="edit-requirements" className="block text-sm font-medium text-gray-700">
              Requirements
            </label>
            <textarea
              id="edit-requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="edit-isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="edit-isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditPosition}
              disabled={!formData.name || !formData.department}
            >
              Update Position
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* View Position Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedPosition?.name}
        size="lg"
      >
        {selectedPosition && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="h3" className="text-lg font-medium mb-4">
                  Position Details
                </Typography>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Department:</span>
                    <span className="text-sm text-gray-900">{selectedPosition.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Level:</span>
                    <span className="text-sm text-gray-900">{selectedPosition.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Headcount:</span>
                    <span className="text-sm text-gray-900">{selectedPosition.filled}/{selectedPosition.headcount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`text-sm font-medium ${
                      selectedPosition.isActive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedPosition.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Reporting To:</span>
                    <span className="text-sm text-gray-900">{selectedPosition.reportingTo}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Typography variant="h3" className="text-lg font-medium mb-4">
                  Requirements
                </Typography>
                <Typography variant="body1" className="text-sm text-gray-700">
                  {selectedPosition.requirements}
                </Typography>
              </div>
            </div>
            
            <div>
              <Typography variant="h3" className="text-lg font-medium mb-2">
                Responsibilities
              </Typography>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPosition.responsibilities.map((resp, index) => (
                  <li key={index} className="text-sm text-gray-700">{resp}</li>
                ))}
              </ul>
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
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedPosition);
                }}
              >
                Edit Position
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
            Are you sure you want to delete the position <span className="font-semibold">{selectedPosition?.name}</span>?
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
              onClick={handleDeletePosition}
            >
              Delete Position
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

BranchPositionsTab.propTypes = {
  branchId: PropTypes.string.isRequired,
};

export default BranchPositionsTab;
