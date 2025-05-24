"use client";

/**
 * EmployeeAttendanceTab Component
 * Displays employee attendance records with calendar view
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Modal from '../../molecules/Modal';
import { createNotificationHandler } from '../../../utils/notificationUtils';
import { useDispatch } from 'react-redux';

// Attendance status options
const ATTENDANCE_STATUS = [
  { value: 'PRESENT', label: 'Present', color: 'bg-green-100 text-green-800' },
  { value: 'LATE', label: 'Late', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ABSENT', label: 'Absent', color: 'bg-red-100 text-red-800' },
  { value: 'LEAVE', label: 'Leave', color: 'bg-blue-100 text-blue-800' },
  { value: 'HOLIDAY', label: 'Holiday', color: 'bg-purple-100 text-purple-800' },
  { value: 'WEEKEND', label: 'Weekend', color: 'bg-gray-100 text-gray-800' },
];

// Days of the week
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate mock attendance data for a month
const generateMockAttendanceData = (employeeId, year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  
  const attendanceData = [];
  
  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    attendanceData.push(null);
  }
  
  // Generate attendance data for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    
    // Weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      attendanceData.push({
        date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        status: 'WEEKEND',
        checkIn: null,
        checkOut: null,
        workHours: 0,
        notes: '',
      });
      continue;
    }
    
    // Random holiday (5% chance)
    if (Math.random() < 0.05) {
      attendanceData.push({
        date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        status: 'HOLIDAY',
        checkIn: null,
        checkOut: null,
        workHours: 0,
        notes: 'Public Holiday',
      });
      continue;
    }
    
    // Random leave (5% chance)
    if (Math.random() < 0.05) {
      attendanceData.push({
        date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        status: 'LEAVE',
        checkIn: null,
        checkOut: null,
        workHours: 0,
        notes: 'Annual Leave',
      });
      continue;
    }
    
    // Random absent (3% chance)
    if (Math.random() < 0.03) {
      attendanceData.push({
        date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        status: 'ABSENT',
        checkIn: null,
        checkOut: null,
        workHours: 0,
        notes: 'Unexcused absence',
      });
      continue;
    }
    
    // Random late (10% chance)
    const isLate = Math.random() < 0.1;
    
    // Generate random check-in time (8:00 - 9:30)
    const checkInHour = isLate ? 9 : 8;
    const checkInMinute = Math.floor(Math.random() * (isLate ? 30 : 60));
    const checkInTime = `${checkInHour.toString().padStart(2, '0')}:${checkInMinute.toString().padStart(2, '0')}`;
    
    // Generate random check-out time (17:00 - 18:30)
    const checkOutHour = 17 + Math.floor(Math.random() * 2);
    const checkOutMinute = Math.floor(Math.random() * 60);
    const checkOutTime = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMinute.toString().padStart(2, '0')}`;
    
    // Calculate work hours
    const workHours = (checkOutHour - checkInHour) + (checkOutMinute - checkInMinute) / 60;
    
    attendanceData.push({
      date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      status: isLate ? 'LATE' : 'PRESENT',
      checkIn: checkInTime,
      checkOut: checkOutTime,
      workHours: parseFloat(workHours.toFixed(2)),
      notes: isLate ? 'Late arrival' : '',
    });
  }
  
  return attendanceData;
};

// Generate summary data for a month
const generateMonthlySummary = (attendanceData) => {
  const summary = {
    present: 0,
    late: 0,
    absent: 0,
    leave: 0,
    totalWorkDays: 0,
    totalWorkHours: 0,
    averageWorkHours: 0,
    attendanceRate: 0,
  };
  
  attendanceData.forEach(day => {
    if (!day) return;
    
    if (day.status === 'PRESENT' || day.status === 'LATE') {
      summary.totalWorkDays++;
      summary.totalWorkHours += day.workHours;
    }
    
    switch (day.status) {
      case 'PRESENT':
        summary.present++;
        break;
      case 'LATE':
        summary.late++;
        break;
      case 'ABSENT':
        summary.absent++;
        break;
      case 'LEAVE':
        summary.leave++;
        break;
    }
  });
  
  const workingDays = summary.present + summary.late + summary.absent + summary.leave;
  
  summary.averageWorkHours = workingDays > 0 ? parseFloat((summary.totalWorkHours / summary.totalWorkDays).toFixed(2)) : 0;
  summary.attendanceRate = workingDays > 0 ? parseFloat(((summary.present + summary.late) / workingDays * 100).toFixed(2)) : 0;
  
  return summary;
};

const EmployeeAttendanceTab = ({ employeeId }) => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // Get current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  // State
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [attendanceData, setAttendanceData] = useState(generateMockAttendanceData(employeeId, selectedYear, selectedMonth));
  const [monthlySummary, setMonthlySummary] = useState(generateMonthlySummary(attendanceData));
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Handle month change
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    const newAttendanceData = generateMockAttendanceData(employeeId, selectedYear, month);
    setAttendanceData(newAttendanceData);
    setMonthlySummary(generateMonthlySummary(newAttendanceData));
  };
  
  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(year);
    const newAttendanceData = generateMockAttendanceData(employeeId, year, selectedMonth);
    setAttendanceData(newAttendanceData);
    setMonthlySummary(generateMonthlySummary(newAttendanceData));
  };
  
  // Open view modal
  const openViewModal = (attendance) => {
    if (!attendance) return;
    
    setSelectedAttendance(attendance);
    setIsViewModalOpen(true);
  };
  
  // Get status color
  const getStatusColor = (status) => {
    const statusInfo = ATTENDANCE_STATUS.find(s => s.value === status);
    return statusInfo ? statusInfo.color : 'bg-gray-100 text-gray-800';
  };
  
  // Get status label
  const getStatusLabel = (status) => {
    const statusInfo = ATTENDANCE_STATUS.find(s => s.value === status);
    return statusInfo ? statusInfo.label : status;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" className="text-xl font-semibold">
          Attendance Records
        </Typography>
        
        <div className="flex space-x-2">
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthChange(parseInt(e.target.value))}
            className="block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
            className="block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Monthly Summary */}
      <Card>
        <div className="p-4">
          <Typography variant="h3" className="text-lg font-medium mb-4">
            Monthly Summary
          </Typography>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-3 rounded-md">
              <Typography variant="body2" className="text-sm text-gray-500">
                Present
              </Typography>
              <Typography variant="h4" className="text-xl font-bold text-green-600">
                {monthlySummary.present}
              </Typography>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-md">
              <Typography variant="body2" className="text-sm text-gray-500">
                Late
              </Typography>
              <Typography variant="h4" className="text-xl font-bold text-yellow-600">
                {monthlySummary.late}
              </Typography>
            </div>
            
            <div className="bg-red-50 p-3 rounded-md">
              <Typography variant="body2" className="text-sm text-gray-500">
                Absent
              </Typography>
              <Typography variant="h4" className="text-xl font-bold text-red-600">
                {monthlySummary.absent}
              </Typography>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <Typography variant="body2" className="text-sm text-gray-500">
                Leave
              </Typography>
              <Typography variant="h4" className="text-xl font-bold text-blue-600">
                {monthlySummary.leave}
              </Typography>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 border border-gray-200 rounded-md">
              <Typography variant="body2" className="text-sm text-gray-500">
                Total Work Hours
              </Typography>
              <Typography variant="h4" className="text-xl font-bold text-gray-800">
                {monthlySummary.totalWorkHours}
              </Typography>
            </div>
            
            <div className="p-3 border border-gray-200 rounded-md">
              <Typography variant="body2" className="text-sm text-gray-500">
                Average Work Hours
              </Typography>
              <Typography variant="h4" className="text-xl font-bold text-gray-800">
                {monthlySummary.averageWorkHours}
              </Typography>
            </div>
            
            <div className="p-3 border border-gray-200 rounded-md">
              <Typography variant="body2" className="text-sm text-gray-500">
                Attendance Rate
              </Typography>
              <Typography variant="h4" className="text-xl font-bold text-gray-800">
                {monthlySummary.attendanceRate}%
              </Typography>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Calendar View */}
      <Card>
        <div className="p-4">
          <Typography variant="h3" className="text-lg font-medium mb-4">
            Calendar View
          </Typography>
          
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="p-2 bg-gray-100 text-center font-medium">
                    {day}
                  </div>
                ))}
                
                {/* Calendar cells */}
                {attendanceData.map((day, index) => (
                  <div
                    key={index}
                    className={`p-2 border border-gray-200 min-h-[100px] ${day ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={() => day && openViewModal(day)}
                  >
                    {day && (
                      <>
                        <div className="flex justify-between items-start">
                          <span className="font-medium">
                            {day.date.split('-')[2]}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(day.status)}`}>
                            {getStatusLabel(day.status)}
                          </span>
                        </div>
                        
                        {(day.status === 'PRESENT' || day.status === 'LATE') && (
                          <div className="mt-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-500">In:</span>
                              <span>{day.checkIn}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Out:</span>
                              <span>{day.checkOut}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Hours:</span>
                              <span>{day.workHours}</span>
                            </div>
                          </div>
                        )}
                        
                        {day.notes && (
                          <div className="mt-1 text-xs text-gray-500 truncate">
                            {day.notes}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* View Attendance Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Attendance Details"
      >
        {selectedAttendance && (
          <div className="space-y-4">
            <div>
              <Typography variant="h3" className="text-lg font-medium">
                {formatDate(selectedAttendance.date)}
              </Typography>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAttendance.status)}`}>
                  {getStatusLabel(selectedAttendance.status)}
                </span>
              </div>
            </div>
            
            {(selectedAttendance.status === 'PRESENT' || selectedAttendance.status === 'LATE') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Typography variant="body2" className="text-sm font-medium text-gray-500">
                    Check-In Time
                  </Typography>
                  <Typography variant="body1" className="text-gray-900">
                    {selectedAttendance.checkIn}
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="body2" className="text-sm font-medium text-gray-500">
                    Check-Out Time
                  </Typography>
                  <Typography variant="body1" className="text-gray-900">
                    {selectedAttendance.checkOut}
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="body2" className="text-sm font-medium text-gray-500">
                    Work Hours
                  </Typography>
                  <Typography variant="body1" className="text-gray-900">
                    {selectedAttendance.workHours} hours
                  </Typography>
                </div>
              </div>
            )}
            
            {selectedAttendance.notes && (
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Notes
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {selectedAttendance.notes}
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

EmployeeAttendanceTab.propTypes = {
  employeeId: PropTypes.string.isRequired,
};

export default EmployeeAttendanceTab;
