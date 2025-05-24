"use client";

/**
 * EmployeeOvertimeTab Component
 * Manages employee overtime records with calculation preview
 */

import React, { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import PropTypes from 'prop-types';
import { createNotificationHandler } from '../../../utils/notificationUtils';
import { useDispatch } from 'react-redux';

// Overtime status options
const OVERTIME_STATUS = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'PROCESSED', label: 'Processed', color: 'bg-blue-100 text-blue-800' },
];

// Overtime types/rates (example)
const OVERTIME_RATES = [
  { value: 'WEEKDAY', label: 'Weekday (1.5x)', rate: 1.5 },
  { value: 'WEEKEND', label: 'Weekend (2x)', rate: 2.0 },
  { value: 'HOLIDAY', label: 'Holiday (3x)', rate: 3.0 },
];

// Mock data for overtime requests
const generateMockOvertimeRequests = (employeeId) => {
  return [
    {
      id: `overtime-${employeeId}-1`,
      date: '2025-01-20',
      startTime: '18:00',
      endTime: '20:00',
      hours: 2,
      type: 'WEEKDAY',
      reason: 'Urgent project deadline',
      status: 'APPROVED',
      requestedDate: '2025-01-19',
      approvedBy: 'John Doe',
      approvedDate: '2025-01-19',
      compensation: 150000, // Example compensation
    },
    {
      id: `overtime-${employeeId}-2`,
      date: '2025-02-15',
      startTime: '09:00',
      endTime: '13:00',
      hours: 4,
      type: 'WEEKEND',
      reason: 'System maintenance',
      status: 'APPROVED',
      requestedDate: '2025-02-10',
      approvedBy: 'John Doe',
      approvedDate: '2025-02-11',
      compensation: 400000, // Example compensation
    },
    {
      id: `overtime-${employeeId}-3`,
      date: '2025-03-10',
      startTime: '17:30',
      endTime: '19:30',
      hours: 2,
      type: 'WEEKDAY',
      reason: 'Client meeting preparation',
      status: 'PENDING',
      requestedDate: '2025-03-09',
      approvedBy: null,
      approvedDate: null,
      compensation: null,
    },
  ];
};

const EmployeeOvertimeTab = ({ employeeId, baseSalary = 5000000 }) => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);

  const [overtimeRequests, setOvertimeRequests] = useState(generateMockOvertimeRequests(employeeId));
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOvertime, setSelectedOvertime] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState('');

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    type: 'WEEKDAY',
    reason: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    if (end < start) return 0; // Basic validation
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return parseFloat(diff.toFixed(2));
  };

  const calculateCompensation = (hours, type) => {
    const rateInfo = OVERTIME_RATES.find(r => r.value === type);
    if (!rateInfo || !hours) return 0;
    // Simplified calculation: (Base Salary / 173) * Overtime Rate * Hours
    // 173 is a common divisor for monthly salary to hourly rate in Indonesia
    const hourlyRate = baseSalary / 173;
    return Math.round(hourlyRate * rateInfo.rate * hours);
  };

  const filteredAndSortedRequests = overtimeRequests
    .filter(req => filteredStatus === '' || req.status === filteredStatus)
    .sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate));

  const openRequestModal = () => {
    setFormData({ date: '', startTime: '', endTime: '', type: 'WEEKDAY', reason: '' });
    setIsRequestModalOpen(true);
  };

  const openViewModal = (overtime) => {
    setSelectedOvertime(overtime);
    setIsViewModalOpen(true);
  };

  const handleRequestOvertime = () => {
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.reason) {
      notifications.error('Please fill in all required fields');
      return;
    }
    const hours = calculateHours(formData.startTime, formData.endTime);
    if (hours <= 0) {
      notifications.error('End time must be after start time and result in positive hours.');
      return;
    }
    const newRequest = {
      id: `overtime-${employeeId}-${overtimeRequests.length + 1}`,
      ...formData,
      hours,
      status: 'PENDING',
      requestedDate: new Date().toISOString().split('T')[0],
      compensation: calculateCompensation(hours, formData.type),
    };
    setOvertimeRequests([newRequest, ...overtimeRequests]);
    setIsRequestModalOpen(false);
    notifications.success('Overtime request submitted successfully');
  };

  const getStatusInfo = (status) => OVERTIME_STATUS.find(s => s.value === status) || OVERTIME_STATUS[0];
  const getRateLabel = (type) => (OVERTIME_RATES.find(r => r.value === type) || {}).label || type;
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-CA') : 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" className="text-xl font-semibold">Overtime Management</Typography>
        <Button variant="primary" onClick={openRequestModal}>Request Overtime</Button>
      </div>

      <Card>
        <div className="p-4">
          <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select id="filterStatus" value={filteredStatus} onChange={(e) => setFilteredStatus(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <option value="">All Statuses</option>
            {OVERTIME_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </Card>

      {filteredAndSortedRequests.length === 0 ? (
        <Card><div className="p-6 text-center text-gray-500">No overtime records found.</div></Card>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedRequests.map(ot => {
            const statusInfo = getStatusInfo(ot.status);
            return (
              <Card key={ot.id}>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography variant="h3" className="text-md font-medium">{formatDate(ot.date)}</Typography>
                      <Typography variant="body2" className="text-sm text-gray-500 mt-1">
                        {ot.startTime} - {ot.endTime} ({ot.hours} hours) - {getRateLabel(ot.type)}
                      </Typography>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">Reason: {ot.reason}</div>
                  {ot.compensation && <div className="mt-1 text-sm text-gray-600">Est. Compensation: Rp {ot.compensation.toLocaleString('id-ID')}</div>}
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => openViewModal(ot)}>View Details</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title="Request Overtime">
        <div className="space-y-4">
          {['date', 'startTime', 'endTime', 'reason'].map(field => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')} *</label>
              <input type={field === 'date' ? 'date' : field.includes('Time') ? 'time' : 'text'}
                id={field} name={field} value={formData[field]} onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required={field !== 'reason'} placeholder={field === 'reason' ? 'Reason for overtime' : ''}
                {...(field === 'reason' && { as: 'textarea', rows: 3 })}
              />
            </div>
          ))}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Overtime Type *</label>
            <select id="type" name="type" value={formData.type} onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              {OVERTIME_RATES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          {formData.startTime && formData.endTime && (
            <div className="bg-gray-50 p-3 rounded-md">
              <Typography variant="body2">Hours: {calculateHours(formData.startTime, formData.endTime)}</Typography>
              <Typography variant="body2">Est. Compensation: Rp {calculateCompensation(calculateHours(formData.startTime, formData.endTime), formData.type).toLocaleString('id-ID')}</Typography>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleRequestOvertime}>Submit Request</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Overtime Details">
        {selectedOvertime && (
          <div className="space-y-3">
            <p><strong>Date:</strong> {formatDate(selectedOvertime.date)}</p>
            <p><strong>Time:</strong> {selectedOvertime.startTime} - {selectedOvertime.endTime} ({selectedOvertime.hours} hours)</p>
            <p><strong>Type:</strong> {getRateLabel(selectedOvertime.type)}</p>
            <p><strong>Reason:</strong> {selectedOvertime.reason}</p>
            <p><strong>Status:</strong> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(selectedOvertime.status).color}`}>{getStatusInfo(selectedOvertime.status).label}</span></p>
            <p><strong>Requested Date:</strong> {formatDate(selectedOvertime.requestedDate)}</p>
            {selectedOvertime.approvedBy && <p><strong>Approved By:</strong> {selectedOvertime.approvedBy} on {formatDate(selectedOvertime.approvedDate)}</p>}
            {selectedOvertime.compensation && <p><strong>Est. Compensation:</strong> Rp {selectedOvertime.compensation.toLocaleString('id-ID')}</p>}
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

EmployeeOvertimeTab.propTypes = {
  employeeId: PropTypes.string.isRequired,
  baseSalary: PropTypes.number, // For compensation calculation
};

export default EmployeeOvertimeTab;
