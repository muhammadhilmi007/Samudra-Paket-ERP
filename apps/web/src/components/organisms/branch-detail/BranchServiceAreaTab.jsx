"use client";

/**
 * BranchServiceAreaTab Component
 * Displays and manages service areas for a branch with map visualization
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

// Mock data for service areas
const generateMockServiceAreas = (branchId) => {
  // Generate consistent mock data based on branchId
  const seed = branchId.charCodeAt(0) + branchId.charCodeAt(branchId.length - 1);
  
  const getRandomValue = (min, max) => {
    return Math.floor((seed % 100) / 100 * (max - min) + min);
  };
  
  const provinces = [
    'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 
    'Banten', 'Bali', 'Sumatera Utara', 'Sumatera Selatan'
  ];
  
  const serviceTypes = ['Regular', 'Express', 'Same Day', 'Economy'];
  
  // Generate service areas
  return Array(getRandomValue(5, 10)).fill().map((_, i) => {
    const provinceIndex = (seed + i) % provinces.length;
    const serviceTypeIndex = (seed + i) % serviceTypes.length;
    
    return {
      id: `sa-${branchId}-${i}`,
      name: `${provinces[provinceIndex]} Service Area`,
      province: provinces[provinceIndex],
      cities: getRandomValue(3, 10),
      districts: getRandomValue(10, 50),
      postalCodes: getRandomValue(20, 100),
      serviceType: serviceTypes[serviceTypeIndex],
      isActive: Math.random() > 0.2,
      coverageRadius: getRandomValue(10, 50),
      coordinates: {
        lat: -6.2 + (Math.random() * 10 - 5),
        lng: 106.8 + (Math.random() * 10 - 5),
      },
    };
  });
};

const BranchServiceAreaTab = ({ branchId }) => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State
  const [serviceAreas, setServiceAreas] = useState(generateMockServiceAreas(branchId));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    serviceType: 'Regular',
    isActive: true,
    coverageRadius: 20,
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  // Open add modal
  const openAddModal = () => {
    setFormData({
      name: '',
      province: '',
      serviceType: 'Regular',
      isActive: true,
      coverageRadius: 20,
    });
    setIsAddModalOpen(true);
  };
  
  // Open edit modal
  const openEditModal = (area) => {
    setSelectedArea(area);
    setFormData({
      name: area.name,
      province: area.province,
      serviceType: area.serviceType,
      isActive: area.isActive,
      coverageRadius: area.coverageRadius,
    });
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const openDeleteModal = (area) => {
    setSelectedArea(area);
    setIsDeleteModalOpen(true);
  };
  
  // Open map modal
  const openMapModal = (area) => {
    setSelectedArea(area);
    setIsMapModalOpen(true);
  };
  
  // Handle add service area
  const handleAddServiceArea = () => {
    const newArea = {
      id: `sa-${branchId}-${serviceAreas.length}`,
      ...formData,
      cities: Math.floor(Math.random() * 10) + 3,
      districts: Math.floor(Math.random() * 40) + 10,
      postalCodes: Math.floor(Math.random() * 80) + 20,
      coordinates: {
        lat: -6.2 + (Math.random() * 10 - 5),
        lng: 106.8 + (Math.random() * 10 - 5),
      },
    };
    
    setServiceAreas([...serviceAreas, newArea]);
    setIsAddModalOpen(false);
    notifications.success('Service area added successfully');
  };
  
  // Handle edit service area
  const handleEditServiceArea = () => {
    const updatedAreas = serviceAreas.map(area => 
      area.id === selectedArea.id ? { ...area, ...formData } : area
    );
    
    setServiceAreas(updatedAreas);
    setIsEditModalOpen(false);
    notifications.success('Service area updated successfully');
  };
  
  // Handle delete service area
  const handleDeleteServiceArea = () => {
    const updatedAreas = serviceAreas.filter(area => area.id !== selectedArea.id);
    
    setServiceAreas(updatedAreas);
    setIsDeleteModalOpen(false);
    notifications.success('Service area deleted successfully');
  };
  
  // Table columns
  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Province',
      accessorKey: 'province',
    },
    {
      header: 'Coverage',
      cell: (info) => (
        <div>
          <div>{info.row.original.cities} Cities</div>
          <div className="text-xs text-gray-500">{info.row.original.districts} Districts</div>
        </div>
      ),
    },
    {
      header: 'Service Type',
      accessorKey: 'serviceType',
      cell: (info) => {
        const value = info.getValue();
        let bgColor = 'bg-gray-100 text-gray-800';
        
        if (value === 'Express') bgColor = 'bg-blue-100 text-blue-800';
        if (value === 'Same Day') bgColor = 'bg-green-100 text-green-800';
        if (value === 'Economy') bgColor = 'bg-yellow-100 text-yellow-800';
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
            {value}
          </span>
        );
      },
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
            onClick={() => openMapModal(info.row.original)}
          >
            Map
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
          Service Areas
        </Typography>
        
        <Button
          variant="primary"
          onClick={openAddModal}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Service Area
        </Button>
      </div>
      
      <Card>
        <div className="p-4">
          <DataTable
            columns={columns}
            data={serviceAreas}
            emptyMessage="No service areas defined for this branch"
          />
        </div>
      </Card>
      
      {/* Map Visualization */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <Typography variant="h3" className="text-lg font-medium">
            Service Area Map
          </Typography>
        </div>
        <div className="p-4">
          <div className="bg-gray-100 rounded-md h-96 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <Typography variant="body1" className="mt-2 text-gray-600">
                Map visualization would be displayed here
              </Typography>
              <Typography variant="body2" className="mt-1 text-gray-500">
                Showing {serviceAreas.length} service areas
              </Typography>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Open Full Map Editor
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Add Service Area Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Service Area"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Area Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Jakarta Service Area"
            />
          </div>
          
          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700">
              Province
            </label>
            <input
              type="text"
              id="province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., DKI Jakarta"
            />
          </div>
          
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
              Service Type
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="Regular">Regular</option>
              <option value="Express">Express</option>
              <option value="Same Day">Same Day</option>
              <option value="Economy">Economy</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="coverageRadius" className="block text-sm font-medium text-gray-700">
              Coverage Radius (km)
            </label>
            <input
              type="number"
              id="coverageRadius"
              name="coverageRadius"
              value={formData.coverageRadius}
              onChange={handleInputChange}
              min="1"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
              onClick={handleAddServiceArea}
              disabled={!formData.name || !formData.province}
            >
              Add Service Area
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Edit Service Area Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Service Area"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
              Area Name
            </label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="edit-province" className="block text-sm font-medium text-gray-700">
              Province
            </label>
            <input
              type="text"
              id="edit-province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="edit-serviceType" className="block text-sm font-medium text-gray-700">
              Service Type
            </label>
            <select
              id="edit-serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="Regular">Regular</option>
              <option value="Express">Express</option>
              <option value="Same Day">Same Day</option>
              <option value="Economy">Economy</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="edit-coverageRadius" className="block text-sm font-medium text-gray-700">
              Coverage Radius (km)
            </label>
            <input
              type="number"
              id="edit-coverageRadius"
              name="coverageRadius"
              value={formData.coverageRadius}
              onChange={handleInputChange}
              min="1"
              max="100"
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
              onClick={handleEditServiceArea}
              disabled={!formData.name || !formData.province}
            >
              Update Service Area
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <Typography variant="body1">
            Are you sure you want to delete the service area <span className="font-semibold">{selectedArea?.name}</span>?
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
              onClick={handleDeleteServiceArea}
            >
              Delete Service Area
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Map View Modal */}
      <Modal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        title={`Map View: ${selectedArea?.name}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-md h-96 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <Typography variant="body1" className="mt-2 text-gray-600">
                Map visualization for {selectedArea?.name}
              </Typography>
              <Typography variant="body2" className="mt-1 text-gray-500">
                Coverage Radius: {selectedArea?.coverageRadius} km
              </Typography>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <Typography variant="h3" className="text-md font-medium mb-2">
              Service Area Details
            </Typography>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Province:</dt>
                <dd className="text-sm text-gray-900">{selectedArea?.province}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Cities:</dt>
                <dd className="text-sm text-gray-900">{selectedArea?.cities}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Districts:</dt>
                <dd className="text-sm text-gray-900">{selectedArea?.districts}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Postal Codes:</dt>
                <dd className="text-sm text-gray-900">{selectedArea?.postalCodes}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Service Type:</dt>
                <dd className="text-sm text-gray-900">{selectedArea?.serviceType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Status:</dt>
                <dd className="text-sm text-gray-900">{selectedArea?.isActive ? 'Active' : 'Inactive'}</dd>
              </div>
            </dl>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsMapModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsMapModalOpen(false);
                openEditModal(selectedArea);
              }}
            >
              Edit Service Area
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

BranchServiceAreaTab.propTypes = {
  branchId: PropTypes.string.isRequired,
};

export default BranchServiceAreaTab;
