"use client";

/**
 * EmployeeLeaveTab Component
 * Manages employee leave requests with approval workflow
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Modal from '../../molecules/Modal';
import { createNotificationHandler } from '../../../utils/notificationUtils';
import { useDispatch } from 'react-redux';

// Leave status options
const LEAVE_STATUS = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
];

// Leave types
const LEAVE_TYPES = [
  { value: 'ANNUAL', label: 'Annual Leave' },
  { value: 'SICK', label: 'Sick Leave' },
  { value: 'EMERGENCY', label: 'Emergency Leave' },
  { value: 'MATERNITY', label: 'Maternity Leave' },
  { value: 'PATERNITY', label: 'Paternity Leave' },
  { value: 'UNPAID', label: 'Unpaid Leave' },
  { value: 'OTHER', label: 'Other' },
];

// Mock data for leave balance
const generateMockLeaveBalance = () => {
  return [
    { type: 'ANNUAL', label: 'Annual Leave', total: 12, used: 5, remaining: 7 },
    { type: 'SICK', label: 'Sick Leave', total: 14, used: 2, remaining: 12 },
    { type: 'EMERGENCY', label: 'Emergency Leave', total: 3, used: 1, remaining: 2 },
    { type: 'MATERNITY', label: 'Maternity Leave', total: 90, used: 0, remaining: 90 },
    { type: 'PATERNITY', label: 'Paternity Leave', total: 7, used: 0, remaining: 7 },
  ];
};

// Mock data for leave requests
const generateMockLeaveRequests = (employeeId) => {
  return [
    {
      id: `leave-${employeeId}-1`,
      type: 'ANNUAL',
      startDate: '2025-01-15',
      endDate: '2025-01-17',
      days: 3,
      reason: 'Family vacation',
      status: 'APPROVED',
      appliedDate: '2025-01-05',
      approvedBy: 'John Doe',
      approvedDate: '2025-01-07',
      comments: 'Approved as requested',
      attachments: [],
    },
    {
      id: `leave-${employeeId}-2`,
      type: 'SICK',
      startDate: '2025-03-10',
      endDate: '2025-03-11',
      days: 2,
      reason: 'Fever and cold',
      status: 'APPROVED',
      appliedDate: '2025-03-09',
      approvedBy: 'John Doe',
      approvedDate: '2025-03-09',
      comments: 'Get well soon',
      attachments: ['medical_certificate.pdf'],
    },
    {
      id: `leave-${employeeId}-3`,
      type: 'EMERGENCY',
      startDate: '2025-04-05',
      endDate: '2025-04-05',
      days: 1,
      reason: 'Family emergency',
      status: 'APPROVED',
      appliedDate: '2025-04-05',
      approvedBy: 'John Doe',
      approvedDate: '2025-04-05',
      comments: '',
      attachments: [],
    },
    {
      id: `leave-${employeeId}-4`,
      type: 'ANNUAL',
      startDate: '2025-06-20',
      endDate: '2025-06-25',
      days: 6,
      reason: 'Summer vacation',
      status: 'PENDING',
      appliedDate: '2025-05-15',
      approvedBy: null,
      approvedDate: null,
      comments: '',
      attachments: [],
    },
    {
      id: `leave-${employeeId}-5`,
      type: 'UNPAID',
      startDate: '2025-02-10',
      endDate: '2025-02-14',
      days: 5,
      reason: 'Personal matters',
      status: 'REJECTED',
      appliedDate: '2025-01-25',
      approvedBy: 'John Doe',
      approvedDate: '2025-01-28',
      comments: 'High workload during this period',
      attachments: [],
    },
  ];
};

const EmployeeLeaveTab = ({ employeeId }) => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State
  const [leaveBalance, setLeaveBalance] = useState(generateMockLeaveBalance());
  const [leaveRequests, setLeaveRequests] = useState(generateMockLeaveRequests(employeeId));
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState('');
  const [filteredType, setFilteredType] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: '',
    attachments: [],
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        attachments: Array.from(files).map(file => file.name),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // Filter leave requests
  const filteredLeaveRequests = leaveRequests.filter(leave => {
    const matchesStatus = filteredStatus === '' || leave.status === filteredStatus;
    const matchesType = filteredType === '' || leave.type === filteredType;
    
    return matchesStatus && matchesType;
  });
  
  // Sort leave requests by date (most recent first)
  const sortedLeaveRequests = [...filteredLeaveRequests].sort((a, b) => {
    return new Date(b.appliedDate) - new Date(a.appliedDate);
  });
  
  // Open request modal
  const openRequestModal = () => {
    setFormData({
      type: 'ANNUAL',
      startDate: '',
      endDate: '',
      reason: '',
      attachments: [],
    });
    setIsRequestModalOpen(true);
  };
  
  // Open view modal
  const openViewModal = (leave) => {
    setSelectedLeave(leave);
    setIsViewModalOpen(true);
  };
  
  // Calculate days between two dates
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };
  
  // Handle request leave
  const handleRequestLeave = () => {
    // Validate form
    if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
      notifications.error('Please fill in all required fields');
      return;
    }
    
    // Calculate days
    const days = calculateDays(formData.startDate, formData.endDate);
    
    // Check if start date is before end date
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      notifications.error('Start date must be before end date');
      return;
    }
    
    // Check if leave balance is sufficient
    const leaveType = formData.type;
    const balance = leaveBalance.find(b => b.type === leaveType);
    
    if (balance && days > balance.remaining) {
      notifications.error(`Insufficient leave balance for ${balance.label}`);
      return;
    }
    
    // Create new leave request
    const newLeaveRequest = {
      id: `leave-${employeeId}-${leaveRequests.length + 1}`,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0],
      approvedBy: null,
      approvedDate: null,
      comments: '',
      attachments: formData.attachments,
    };
    
    // Update leave requests
    setLeaveRequests([...leaveRequests, newLeaveRequest]);
    
    // Update leave balance
    if (balance) {
      const updatedBalance = leaveBalance.map(b => {
        if (b.type === leaveType) {
          return {
            ...b,
            used: b.used + days,
            remaining: b.remaining - days,
          };
        }
        return b;
      });
      
      setLeaveBalance(updatedBalance);
    }
    
    setIsRequestModalOpen(false);
    notifications.success('Leave request submitted successfully');
  };
  
  // Handle cancel leave
  const handleCancelLeave = () => {
    if (!selectedLeave || selectedLeave.status !== 'PENDING') {
      notifications.error('Only pending leave requests can be cancelled');
      return;
    }
    
    // Update leave request
    const updatedLeaveRequests = leaveRequests.map(leave => {
      if (leave.id === selectedLeave.id) {
        return {
          ...leave,
          status: 'CANCELLED',
        };
      }
      return leave;
    });
    
    // Update leave balance
    const leaveType = selectedLeave.type;
    const updatedBalance = leaveBalance.map(b => {
      if (b.type === leaveType) {
        return {
          ...b,
          used: b.used - selectedLeave.days,
          remaining: b.remaining + selectedLeave.days,
        };
      }
      return b;
    });
    
    setLeaveRequests(updatedLeaveRequests);
    setLeaveBalance(updatedBalance);
    setIsViewModalOpen(false);
    notifications.success('Leave request cancelled successfully');
  };
  
  // Get status color
  const getStatusColor = (status) => {
    const statusInfo = LEAVE_STATUS.find(s => s.value === status);
    return statusInfo ? statusInfo.color : 'bg-gray-100 text-gray-800';
  };
  
  // Get status label
  const getStatusLabel = (status) => {
    const statusInfo = LEAVE_STATUS.find(s => s.value === status);
    return statusInfo ? statusInfo.label : status;
  };
  
  // Get leave type label
  const getLeaveTypeLabel = (type) => {
    const typeInfo = LEAVE_TYPES.find(t => t.value === type);
    return typeInfo ? typeInfo.label : type;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
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
          Leave Management
        </Typography>
        
        <Button
          variant="primary"
          onClick={openRequestModal}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Request Leave
        </Button>
      </div>
      
      {/* Leave Balance */}
      <Card>
        <div className="p-4">
          <Typography variant="h3" className="text-lg font-medium mb-4">
            Leave Balance
          </Typography>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Used
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveBalance.map((balance) => (
                  <tr key={balance.type}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {balance.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {balance.total} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {balance.used} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`font-medium ${balance.remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {balance.remaining} days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
      
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
                {LEAVE_STATUS.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <select
                id="filterType"
                value={filteredType}
                onChange={(e) => setFilteredType(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Types</option>
                {LEAVE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Leave Requests */}
      {sortedLeaveRequests.length === 0 ? (
        <Card>
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <Typography variant="body1" className="mt-2 text-gray-600">
              No leave requests found
            </Typography>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedLeaveRequests.map((leave) => (
            <Card key={leave.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="h3" className="text-md font-medium">
                      {getLeaveTypeLabel(leave.type)}
                    </Typography>
                    <Typography variant="body2" className="text-sm text-gray-500 mt-1">
                      {formatDate(leave.startDate)} to {formatDate(leave.endDate)} ({leave.days} days)
                    </Typography>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                    {getStatusLabel(leave.status)}
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Reason:</span> {leave.reason}
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>
                    <span className="block font-medium">Applied Date</span>
                    <span>{formatDate(leave.appliedDate)}</span>
                  </div>
                  {leave.approvedDate && (
                    <div>
                      <span className="block font-medium">Approved/Rejected Date</span>
                      <span>{formatDate(leave.approvedDate)}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewModal(leave)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Request Leave Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request Leave"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Leave Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              {LEAVE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
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
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>
          </div>
          
          {formData.startDate && formData.endDate && (
            <div className="bg-gray-50 p-3 rounded-md">
              <Typography variant="body2" className="text-sm text-gray-700">
                Duration: <span className="font-medium">{calculateDays(formData.startDate, formData.endDate)} days</span>
              </Typography>
              
              {formData.type && (
                <Typography variant="body2" className="text-sm text-gray-700 mt-1">
                  Balance: <span className="font-medium">
                    {leaveBalance.find(b => b.type === formData.type)?.remaining || 0} days remaining
                  </span>
                </Typography>
              )}
            </div>
          )}
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason *
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter reason for leave"
              required
            />
          </div>
          
          <div>
            <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <input
              type="file"
              id="attachments"
              name="attachments"
              onChange={handleInputChange}
              multiple
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Upload any supporting documents (e.g., medical certificate)
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsRequestModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRequestLeave}
              disabled={!formData.type || !formData.startDate || !formData.endDate || !formData.reason}
            >
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* View Leave Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Leave Details"
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Typography variant="h3" className="text-lg font-medium">
                  {getLeaveTypeLabel(selectedLeave.type)}
                </Typography>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLeave.status)}`}>
                  {getStatusLabel(selectedLeave.status)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Start Date
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {formatDate(selectedLeave.startDate)}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  End Date
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {formatDate(selectedLeave.endDate)}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Duration
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {selectedLeave.days} days
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Applied Date
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {formatDate(selectedLeave.appliedDate)}
                </Typography>
              </div>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Reason
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {selectedLeave.reason}
              </Typography>
            </div>
            
            {selectedLeave.approvedBy && (
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  {selectedLeave.status === 'APPROVED' ? 'Approved By' : 'Rejected By'}
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {selectedLeave.approvedBy} on {formatDate(selectedLeave.approvedDate)}
                </Typography>
              </div>
            )}
            
            {selectedLeave.comments && (
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Comments
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {selectedLeave.comments}
                </Typography>
              </div>
            )}
            
            {selectedLeave.attachments.length > 0 && (
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Attachments
                </Typography>
                <div className="mt-1 space-y-1">
                  {selectedLeave.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <Typography variant="body2" className="text-sm text-primary-600 hover:text-primary-500">
                        {attachment}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
              {selectedLeave.status === 'PENDING' && (
                <Button
                  variant="danger"
                  onClick={handleCancelLeave}
                >
                  Cancel Request
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

EmployeeLeaveTab.propTypes = {
  employeeId: PropTypes.string.isRequired,
};

export default EmployeeLeaveTab;
