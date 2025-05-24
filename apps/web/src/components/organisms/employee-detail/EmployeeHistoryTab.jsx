"use client";

/**
 * EmployeeHistoryTab Component
 * Displays employee history with timeline visualization
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Modal from '../../molecules/Modal';

// Mock data for employee history
const generateMockHistory = (employeeId) => {
  return [
    {
      id: `history-${employeeId}-1`,
      type: 'position',
      title: 'Promotion to Senior Delivery Driver',
      date: '2023-06-15',
      description: 'Promoted based on excellent performance and consistent delivery metrics.',
      details: {
        from: 'Delivery Driver',
        to: 'Senior Delivery Driver',
        approvedBy: 'John Doe',
        effectiveDate: '2023-07-01',
        salaryChange: '+15%',
        notes: 'Promotion comes with additional responsibilities including mentoring new drivers and route optimization.',
      },
    },
    {
      id: `history-${employeeId}-2`,
      type: 'assignment',
      title: 'Assignment to Jakarta Central Branch',
      date: '2023-01-15',
      description: 'Assigned to the delivery division at Jakarta Central Branch.',
      details: {
        position: 'Delivery Driver',
        branch: 'Jakarta Central Branch',
        division: 'Delivery Division',
        startDate: '2023-01-15',
        endDate: null,
        supervisor: 'John Doe',
        notes: 'Primary assignment for package delivery in Central Jakarta area.',
      },
    },
    {
      id: `history-${employeeId}-3`,
      type: 'training',
      title: 'Advanced Driving Skills Training',
      date: '2022-11-10',
      description: 'Completed advanced driving skills training with certification.',
      details: {
        trainingName: 'Advanced Driving Skills',
        provider: 'Jakarta Driving Academy',
        startDate: '2022-11-01',
        endDate: '2022-11-10',
        certification: 'Advanced Driver Certificate',
        score: '92/100',
        notes: 'Training included defensive driving, fuel-efficient driving techniques, and handling difficult road conditions.',
      },
    },
    {
      id: `history-${employeeId}-4`,
      type: 'assignment',
      title: 'Assignment to Jakarta South Branch',
      date: '2022-03-10',
      description: 'Assigned to the warehouse division at Jakarta South Branch.',
      details: {
        position: 'Warehouse Staff',
        branch: 'Jakarta South Branch',
        division: 'Warehouse Division',
        startDate: '2022-03-10',
        endDate: '2023-01-14',
        supervisor: 'Jane Smith',
        notes: 'Responsible for package sorting and inventory management.',
      },
    },
    {
      id: `history-${employeeId}-5`,
      type: 'award',
      title: 'Employee of the Month',
      date: '2022-08-15',
      description: 'Recognized as Employee of the Month for outstanding performance.',
      details: {
        award: 'Employee of the Month',
        presentedBy: 'Regional Manager',
        reason: 'Outstanding performance in warehouse operations, including 100% accuracy in inventory management and exceptional team collaboration.',
        reward: 'Certificate and bonus',
        notes: 'First time receiving this recognition.',
      },
    },
    {
      id: `history-${employeeId}-6`,
      type: 'training',
      title: 'Warehouse Management System Training',
      date: '2022-04-05',
      description: 'Completed training on the company\'s warehouse management system.',
      details: {
        trainingName: 'Warehouse Management System',
        provider: 'Internal Training Department',
        startDate: '2022-04-01',
        endDate: '2022-04-05',
        certification: 'WMS Certified User',
        score: '88/100',
        notes: 'Training covered inventory management, package sorting, and system troubleshooting.',
      },
    },
    {
      id: `history-${employeeId}-7`,
      type: 'assignment',
      title: 'Assignment to Jakarta East Branch',
      date: '2021-05-20',
      description: 'Assigned to the customer service division at Jakarta East Branch.',
      details: {
        position: 'Customer Service Representative',
        branch: 'Jakarta East Branch',
        division: 'Customer Service Division',
        startDate: '2021-05-20',
        endDate: '2022-03-09',
        supervisor: 'Robert Johnson',
        notes: 'Handled customer inquiries and complaints.',
      },
    },
    {
      id: `history-${employeeId}-8`,
      type: 'onboarding',
      title: 'Joined Samudra Paket',
      date: '2021-05-15',
      description: 'Joined the company as a Customer Service Representative.',
      details: {
        position: 'Customer Service Representative',
        department: 'Customer Service',
        location: 'Jakarta East Branch',
        contractType: 'Permanent',
        orientation: 'Completed 5-day company orientation',
        notes: 'Successfully completed all onboarding requirements and training.',
      },
    },
  ];
};

const EmployeeHistoryTab = ({ employeeId }) => {
  // State
  const [history, setHistory] = useState(generateMockHistory(employeeId));
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filteredType, setFilteredType] = useState('all');
  
  // Filter history by type
  const filteredHistory = filteredType === 'all'
    ? history
    : history.filter(event => event.type === filteredType);
  
  // Group history by year
  const groupedHistory = filteredHistory.reduce((groups, event) => {
    const year = event.date.split('-')[0];
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(event);
    return groups;
  }, {});
  
  // Sort years in descending order
  const sortedYears = Object.keys(groupedHistory).sort((a, b) => b - a);
  
  // Open view modal
  const openViewModal = (event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };
  
  // Get event icon
  const getEventIcon = (type) => {
    switch (type) {
      case 'position':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
      case 'assignment':
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'training':
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        );
      case 'award':
        return (
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        );
      case 'onboarding':
        return (
          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };
  
  // Get event color
  const getEventColor = (type) => {
    switch (type) {
      case 'position':
        return 'border-blue-500';
      case 'assignment':
        return 'border-green-500';
      case 'training':
        return 'border-purple-500';
      case 'award':
        return 'border-yellow-500';
      case 'onboarding':
        return 'border-teal-500';
      default:
        return 'border-gray-500';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
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
          Employee History
        </Typography>
        
        <div className="flex space-x-2">
          <Button
            variant={filteredType === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilteredType('all')}
          >
            All
          </Button>
          <Button
            variant={filteredType === 'position' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilteredType('position')}
          >
            Positions
          </Button>
          <Button
            variant={filteredType === 'assignment' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilteredType('assignment')}
          >
            Assignments
          </Button>
          <Button
            variant={filteredType === 'training' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilteredType('training')}
          >
            Training
          </Button>
          <Button
            variant={filteredType === 'award' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilteredType('award')}
          >
            Awards
          </Button>
        </div>
      </div>
      
      {filteredHistory.length === 0 ? (
        <Card>
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <Typography variant="body1" className="mt-2 text-gray-600">
              No history records found
            </Typography>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year}>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                  <Typography variant="body1" className="font-bold text-primary-600">
                    {year}
                  </Typography>
                </div>
                <Typography variant="h3" className="text-lg font-medium">
                  {year}
                </Typography>
              </div>
              
              <div className="relative pl-8 space-y-6">
                <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-gray-200"></div>
                
                {groupedHistory[year].map((event, index) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-5 mt-1.5">
                      {getEventIcon(event.type)}
                    </div>
                    
                    <Card className={`border-l-4 ${getEventColor(event.type)}`}>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Typography variant="h4" className="text-md font-medium">
                              {event.title}
                            </Typography>
                            <Typography variant="body2" className="text-sm text-gray-500 mt-1">
                              {formatDate(event.date)}
                            </Typography>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewModal(event)}
                          >
                            View Details
                          </Button>
                        </div>
                        
                        <Typography variant="body1" className="mt-2 text-gray-600">
                          {event.description}
                        </Typography>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* View Event Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Event Details"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-center">
              {getEventIcon(selectedEvent.type)}
              <div className="ml-3">
                <Typography variant="h3" className="text-lg font-medium">
                  {selectedEvent.title}
                </Typography>
                <Typography variant="body2" className="text-sm text-gray-500">
                  {formatDate(selectedEvent.date)}
                </Typography>
              </div>
            </div>
            
            <Typography variant="body1" className="text-gray-600">
              {selectedEvent.description}
            </Typography>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              {selectedEvent.type === 'position' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Previous Position:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">New Position:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Approved By:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.approvedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Effective Date:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.effectiveDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Salary Change:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.salaryChange}</span>
                  </div>
                </div>
              )}
              
              {selectedEvent.type === 'assignment' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Position:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Branch:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Division:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.division}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Start Date:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">End Date:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.endDate || 'Present'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Supervisor:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.supervisor}</span>
                  </div>
                </div>
              )}
              
              {selectedEvent.type === 'training' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Training Name:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.trainingName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Provider:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Duration:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.startDate} to {selectedEvent.details.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Certification:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.certification}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Score:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.score}</span>
                  </div>
                </div>
              )}
              
              {selectedEvent.type === 'award' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Award:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.award}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Presented By:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.presentedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Reward:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.reward}</span>
                  </div>
                </div>
              )}
              
              {selectedEvent.type === 'onboarding' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Initial Position:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Department:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Location:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Contract Type:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.contractType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Orientation:</span>
                    <span className="text-sm text-gray-900">{selectedEvent.details.orientation}</span>
                  </div>
                </div>
              )}
              
              {selectedEvent.details.notes && (
                <div className="mt-4">
                  <Typography variant="body2" className="text-sm font-medium text-gray-500 mb-1">
                    Notes:
                  </Typography>
                  <Typography variant="body1" className="text-sm text-gray-900">
                    {selectedEvent.details.notes}
                  </Typography>
                </div>
              )}
            </div>
            
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

EmployeeHistoryTab.propTypes = {
  employeeId: PropTypes.string.isRequired,
};

export default EmployeeHistoryTab;
