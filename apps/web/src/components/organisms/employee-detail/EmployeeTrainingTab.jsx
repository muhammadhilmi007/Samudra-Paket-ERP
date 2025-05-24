"use client";

/**
 * EmployeeTrainingTab Component
 * Manages employee training records
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Modal from '../../molecules/Modal';
import { createNotificationHandler } from '../../../utils/notificationUtils';
import { useDispatch } from 'react-redux';

// Training status options
const TRAINING_STATUS = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

// Training types
const TRAINING_TYPES = [
  'Technical',
  'Safety',
  'Soft Skills',
  'Management',
  'Compliance',
  'Product Knowledge',
  'Customer Service',
  'Other',
];

// Mock data for trainings
const generateMockTrainings = (employeeId) => {
  return [
    {
      id: `training-${employeeId}-1`,
      name: 'Advanced Driving Skills',
      type: 'Safety',
      provider: 'Jakarta Driving Academy',
      startDate: '2022-11-01',
      endDate: '2022-11-10',
      status: 'COMPLETED',
      location: 'Jakarta Training Center',
      certification: 'Advanced Driver Certificate',
      score: 92,
      description: 'Training on defensive driving, fuel-efficient driving techniques, and handling difficult road conditions.',
      notes: 'Employee showed excellent skills in defensive driving scenarios.',
    },
    {
      id: `training-${employeeId}-2`,
      name: 'Customer Service Excellence',
      type: 'Customer Service',
      provider: 'Internal Training Department',
      startDate: '2023-03-15',
      endDate: '2023-03-17',
      status: 'COMPLETED',
      location: 'Head Office',
      certification: 'Customer Service Excellence',
      score: 95,
      description: 'Training on handling customer inquiries, complaints, and providing exceptional service.',
      notes: 'Employee demonstrated excellent communication skills and problem-solving abilities.',
    },
    {
      id: `training-${employeeId}-3`,
      name: 'Warehouse Management System',
      type: 'Technical',
      provider: 'Internal IT Department',
      startDate: '2022-04-01',
      endDate: '2022-04-05',
      status: 'COMPLETED',
      location: 'Head Office',
      certification: 'WMS Certified User',
      score: 88,
      description: 'Training on inventory management, package sorting, and system troubleshooting.',
      notes: 'Employee showed good understanding of the system but needs more practice on advanced features.',
    },
    {
      id: `training-${employeeId}-4`,
      name: 'Leadership Development Program',
      type: 'Management',
      provider: 'Leadership Institute',
      startDate: '2023-09-10',
      endDate: '2023-09-20',
      status: 'COMPLETED',
      location: 'External Venue',
      certification: 'Leadership Certificate',
      score: 90,
      description: 'Comprehensive leadership training covering team management, conflict resolution, and strategic planning.',
      notes: 'Employee showed strong potential for management roles.',
    },
    {
      id: `training-${employeeId}-5`,
      name: 'Health and Safety Compliance',
      type: 'Compliance',
      provider: 'Safety First Consultants',
      startDate: '2023-06-05',
      endDate: '2023-06-06',
      status: 'COMPLETED',
      location: 'Head Office',
      certification: 'Health and Safety Compliance Certificate',
      score: 100,
      description: 'Training on workplace safety regulations and emergency procedures.',
      notes: 'Perfect score on all assessments.',
    },
    {
      id: `training-${employeeId}-6`,
      name: 'Route Optimization Techniques',
      type: 'Technical',
      provider: 'Logistics Training Center',
      startDate: '2024-02-15',
      endDate: '2024-02-17',
      status: 'COMPLETED',
      location: 'External Venue',
      certification: 'Route Planning Certificate',
      score: 94,
      description: 'Advanced techniques for optimizing delivery routes and reducing fuel consumption.',
      notes: 'Employee applied learnings immediately, resulting in 15% efficiency improvement.',
    },
    {
      id: `training-${employeeId}-7`,
      name: 'Advanced Mobile App Training',
      type: 'Technical',
      provider: 'Internal IT Department',
      startDate: '2025-06-10',
      endDate: '2025-06-11',
      status: 'SCHEDULED',
      location: 'Head Office',
      certification: 'Mobile App Expert',
      score: null,
      description: 'Training on the new features of the company mobile app for deliveries.',
      notes: '',
    },
  ];
};

const EmployeeTrainingTab = ({ employeeId }) => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State
  const [trainings, setTrainings] = useState(generateMockTrainings(employeeId));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState('');
  const [filteredType, setFilteredType] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: TRAINING_TYPES[0],
    provider: '',
    startDate: '',
    endDate: '',
    status: 'SCHEDULED',
    location: '',
    certification: '',
    description: '',
    notes: '',
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Filter trainings
  const filteredTrainings = trainings.filter(training => {
    const matchesStatus = filteredStatus === '' || training.status === filteredStatus;
    const matchesType = filteredType === '' || training.type === filteredType;
    
    return matchesStatus && matchesType;
  });
  
  // Sort trainings by date (most recent first)
  const sortedTrainings = [...filteredTrainings].sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });
  
  // Open add modal
  const openAddModal = () => {
    setFormData({
      name: '',
      type: TRAINING_TYPES[0],
      provider: '',
      startDate: '',
      endDate: '',
      status: 'SCHEDULED',
      location: '',
      certification: '',
      description: '',
      notes: '',
    });
    setIsAddModalOpen(true);
  };
  
  // Open view modal
  const openViewModal = (training) => {
    setSelectedTraining(training);
    setIsViewModalOpen(true);
  };
  
  // Handle add training
  const handleAddTraining = () => {
    // Validate form
    if (!formData.name || !formData.type || !formData.provider || !formData.startDate || !formData.status) {
      notifications.error('Please fill in all required fields');
      return;
    }
    
    // Create new training
    const newTraining = {
      id: `training-${employeeId}-${trainings.length + 1}`,
      name: formData.name,
      type: formData.type,
      provider: formData.provider,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      status: formData.status,
      location: formData.location,
      certification: formData.certification,
      score: null,
      description: formData.description,
      notes: formData.notes,
    };
    
    setTrainings([...trainings, newTraining]);
    setIsAddModalOpen(false);
    notifications.success('Training added successfully');
  };
  
  // Get status label and color
  const getStatusInfo = (status) => {
    return TRAINING_STATUS.find(s => s.value === status) || TRAINING_STATUS[0];
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" className="text-xl font-semibold">
          Training Management
        </Typography>
        
        <Button
          variant="primary"
          onClick={openAddModal}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Training
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="filterStatus"
                value={filteredStatus}
                onChange={(e) => setFilteredStatus(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                {TRAINING_STATUS.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="filterType"
                value={filteredType}
                onChange={(e) => setFilteredType(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Types</option>
                {TRAINING_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Training List */}
      {sortedTrainings.length === 0 ? (
        <Card>
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <Typography variant="body1" className="mt-2 text-gray-600">
              No training records found
            </Typography>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedTrainings.map((training) => {
            const statusInfo = getStatusInfo(training.status);
            
            return (
              <Card key={training.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography variant="h3" className="text-md font-medium">
                        {training.name}
                      </Typography>
                      <Typography variant="body2" className="text-sm text-gray-500 mt-1">
                        {training.type} • {training.provider}
                      </Typography>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {training.description}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="block font-medium">Start Date</span>
                      <span>{formatDate(training.startDate)}</span>
                    </div>
                    <div>
                      <span className="block font-medium">End Date</span>
                      <span>{formatDate(training.endDate)}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Location</span>
                      <span>{training.location || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Certification</span>
                      <span>{training.certification || 'None'}</span>
                    </div>
                  </div>
                  
                  {training.status === 'COMPLETED' && training.score !== null && (
                    <div className="mt-3">
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-500 mr-2">Score:</span>
                        <div className="w-full bg-gray-200 rounded-full h-2 flex-grow">
                          <div
                            className={`h-2 rounded-full ${
                              training.score >= 90 ? 'bg-green-500' :
                              training.score >= 80 ? 'bg-blue-500' :
                              training.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${training.score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium ml-2">{training.score}%</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewModal(training)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Add Training Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Training"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Training Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Advanced Driving Skills"
              required
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Training Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              {TRAINING_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
              Training Provider *
            </label>
            <input
              type="text"
              id="provider"
              name="provider"
              value={formData.provider}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Jakarta Driving Academy"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              {TRAINING_STATUS.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Head Office"
            />
          </div>
          
          <div>
            <label htmlFor="certification" className="block text-sm font-medium text-gray-700">
              Certification
            </label>
            <input
              type="text"
              id="certification"
              name="certification"
              value={formData.certification}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Advanced Driver Certificate"
            />
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
              placeholder="Enter training description"
            />
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter any additional notes"
            />
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
              onClick={handleAddTraining}
              disabled={!formData.name || !formData.type || !formData.provider || !formData.startDate || !formData.status}
            >
              Add Training
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* View Training Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Training Details"
      >
        {selectedTraining && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Typography variant="h3" className="text-lg font-medium">
                  {selectedTraining.name}
                </Typography>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedTraining.status).color}`}>
                  {getStatusInfo(selectedTraining.status).label}
                </div>
              </div>
              <Typography variant="body2" className="text-sm text-gray-500 mt-1">
                {selectedTraining.type} • {selectedTraining.provider}
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Start Date
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {formatDate(selectedTraining.startDate)}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  End Date
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {formatDate(selectedTraining.endDate)}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Location
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {selectedTraining.location || 'N/A'}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Certification
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {selectedTraining.certification || 'None'}
                </Typography>
              </div>
            </div>
            
            {selectedTraining.status === 'COMPLETED' && selectedTraining.score !== null && (
              <div className="mt-2">
                <Typography variant="body2" className="text-sm font-medium text-gray-500 mb-1">
                  Score
                </Typography>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div
                      className={`h-2.5 rounded-full ${
                        selectedTraining.score >= 90 ? 'bg-green-500' :
                        selectedTraining.score >= 80 ? 'bg-blue-500' :
                        selectedTraining.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${selectedTraining.score}%` }}
                    ></div>
                  </div>
                  <Typography variant="body1" className="font-medium">
                    {selectedTraining.score}%
                  </Typography>
                </div>
              </div>
            )}
            
            {selectedTraining.description && (
              <div className="mt-4">
                <Typography variant="body2" className="text-sm font-medium text-gray-500 mb-1">
                  Description
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {selectedTraining.description}
                </Typography>
              </div>
            )}
            
            {selectedTraining.notes && (
              <div className="mt-4">
                <Typography variant="body2" className="text-sm font-medium text-gray-500 mb-1">
                  Notes
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {selectedTraining.notes}
                </Typography>
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

EmployeeTrainingTab.propTypes = {
  employeeId: PropTypes.string.isRequired,
};

export default EmployeeTrainingTab;
