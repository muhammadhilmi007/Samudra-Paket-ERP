'use client';

import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

/**
 * DatePicker Component
 * A simplified date picker component for demonstration purposes
 */
const DatePicker = ({
  dateRange,
  onChange,
  label = 'Date Range',
  className = '',
}) => {
  // Format dates for display
  const formatDateRange = () => {
    if (!dateRange) return 'Select date range';
    
    const fromDate = dateRange.from ? format(dateRange.from, 'MMM dd, yyyy') : '';
    const toDate = dateRange.to ? format(dateRange.to, 'MMM dd, yyyy') : '';
    
    if (fromDate && toDate) {
      return `${fromDate} - ${toDate}`;
    } else if (fromDate) {
      return fromDate;
    } else {
      return 'Select date range';
    }
  };

  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <span>{formatDateRange()}</span>
          <Calendar className="h-4 w-4 opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
