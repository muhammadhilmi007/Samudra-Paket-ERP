"use client";

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  subDays,
  parseISO,
  isWithinInterval,
} from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import cn from 'classnames';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

/**
 * Calendar Component
 * A flexible calendar component with month, week, and day views
 */
const Calendar = ({
  events = [],
  onEventClick,
  onDateClick,
  onRangeChange,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  view = 'month',
  date = new Date(),
  className = '',
  headerClassName = '',
  dayClassName = '',
  eventClassName = '',
  firstDayOfWeek = 0, // 0 = Sunday, 1 = Monday, etc.
  showHeader = true,
  showViewSelector = true,
  showCreateButton = true,
  createButtonText = 'Add Event',
  dayStartHour = 8,
  dayEndHour = 18,
  timeSlotInterval = 30, // in minutes
  eventMinHeight = 24, // in pixels
  readonly = false,
  loading = false,
  loadingMessage = 'Loading events...',
  ...props
}) => {
  // State for internal calendar management
  const [currentDate, setCurrentDate] = useState(date);
  const [currentView, setCurrentView] = useState(view);
  const [selectedDate, setSelectedDate] = useState(null);
  const [draggedEvent, setDraggedEvent] = useState(null);

  // Update internal state when props change
  useEffect(() => {
    setCurrentDate(date);
  }, [date]);

  useEffect(() => {
    setCurrentView(view);
  }, [view]);

  // Calculate visible date range based on current view
  const visibleDateRange = useMemo(() => {
    let start, end;

    switch (currentView) {
      case 'day':
        start = currentDate;
        end = currentDate;
        break;
      case 'week':
        start = startOfWeek(currentDate, { weekStartsOn: firstDayOfWeek });
        end = endOfWeek(currentDate, { weekStartsOn: firstDayOfWeek });
        break;
      case 'month':
      default:
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        break;
    }

    return { start, end };
  }, [currentDate, currentView, firstDayOfWeek]);

  // Notify parent component when visible date range changes
  useEffect(() => {
    if (onRangeChange) {
      onRangeChange(visibleDateRange);
    }
  }, [visibleDateRange, onRangeChange]);

  // Filter events based on visible date range
  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      const eventEnd = typeof event.end === 'string' ? parseISO(event.end) : event.end || eventStart;

      return isWithinInterval(eventStart, {
        start: visibleDateRange.start,
        end: visibleDateRange.end,
      }) || isWithinInterval(eventEnd, {
        start: visibleDateRange.start,
        end: visibleDateRange.end,
      });
    });
  }, [events, visibleDateRange]);

  // Navigation handlers
  const handlePrevious = () => {
    switch (currentView) {
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subDays(currentDate, 7));
        break;
      case 'month':
      default:
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (currentView) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addDays(currentDate, 7));
        break;
      case 'month':
      default:
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // View change handler
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Date click handler
  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onDateClick) {
      onDateClick(date);
    }
  };

  // Event click handler
  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Event creation handler
  const handleEventCreate = (event) => {
    if (onEventCreate) {
      onEventCreate(event);
    }
  };

  // Event drag handlers
  const handleDragStart = (event) => {
    if (readonly) return;
    setDraggedEvent(event);
  };

  const handleDragOver = (date) => {
    if (readonly || !draggedEvent) return;
    // Implement drag over logic
  };

  const handleDrop = (date) => {
    if (readonly || !draggedEvent) return;
    
    if (onEventUpdate) {
      const updatedEvent = {
        ...draggedEvent,
        start: date,
        // Calculate new end time based on event duration
        end: addDays(date, 1), // Simplified for now
      };
      onEventUpdate(updatedEvent);
    }
    
    setDraggedEvent(null);
  };

  // Render calendar header
  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <div className={cn('flex items-center justify-between mb-4', headerClassName)}>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrevious}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
            aria-label="Next"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {currentView === 'day'
              ? format(currentDate, 'MMMM d, yyyy')
              : currentView === 'week'
              ? `${format(visibleDateRange.start, 'MMM d')} - ${format(visibleDateRange.end, 'MMM d, yyyy')}`
              : format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            type="button"
            onClick={handleToday}
            className="ml-2 px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {showViewSelector && (
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => handleViewChange('month')}
                className={cn(
                  'px-3 py-1 text-sm',
                  currentView === 'month'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('week')}
                className={cn(
                  'px-3 py-1 text-sm',
                  currentView === 'week'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('day')}
                className={cn(
                  'px-3 py-1 text-sm',
                  currentView === 'day'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                Day
              </button>
            </div>
          )}

          {showCreateButton && !readonly && (
            <button
              type="button"
              onClick={() => handleEventCreate({ start: selectedDate || currentDate })}
              className="flex items-center px-3 py-1 text-sm rounded-md bg-primary-500 text-white hover:bg-primary-600"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              {createButtonText}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render appropriate view based on currentView
  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          {loadingMessage}
        </div>
      );
    }

    const commonProps = {
      events: visibleEvents,
      onEventClick: handleEventClick,
      onDateClick: handleDateClick,
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      selectedDate,
      dayClassName,
      eventClassName,
      readonly,
    };

    switch (currentView) {
      case 'day':
        return (
          <DayView
            {...commonProps}
            date={currentDate}
            startHour={dayStartHour}
            endHour={dayEndHour}
            timeSlotInterval={timeSlotInterval}
            eventMinHeight={eventMinHeight}
          />
        );
      case 'week':
        return (
          <WeekView
            {...commonProps}
            date={currentDate}
            firstDayOfWeek={firstDayOfWeek}
            startHour={dayStartHour}
            endHour={dayEndHour}
            timeSlotInterval={timeSlotInterval}
            eventMinHeight={eventMinHeight}
          />
        );
      case 'month':
      default:
        return (
          <MonthView
            {...commonProps}
            date={currentDate}
            firstDayOfWeek={firstDayOfWeek}
          />
        );
    }
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {renderHeader()}
      {renderView()}
    </div>
  );
};

Calendar.propTypes = {
  /**
   * Array of event objects
   */
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      allDay: PropTypes.bool,
      color: PropTypes.string,
      className: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  /**
   * Callback when an event is clicked
   */
  onEventClick: PropTypes.func,
  /**
   * Callback when a date is clicked
   */
  onDateClick: PropTypes.func,
  /**
   * Callback when the visible date range changes
   */
  onRangeChange: PropTypes.func,
  /**
   * Callback when a new event is created
   */
  onEventCreate: PropTypes.func,
  /**
   * Callback when an event is updated
   */
  onEventUpdate: PropTypes.func,
  /**
   * Callback when an event is deleted
   */
  onEventDelete: PropTypes.func,
  /**
   * Current view mode
   */
  view: PropTypes.oneOf(['month', 'week', 'day']),
  /**
   * Current date to display
   */
  date: PropTypes.instanceOf(Date),
  /**
   * Additional CSS classes for the calendar container
   */
  className: PropTypes.string,
  /**
   * Additional CSS classes for the calendar header
   */
  headerClassName: PropTypes.string,
  /**
   * Additional CSS classes for calendar days
   */
  dayClassName: PropTypes.string,
  /**
   * Additional CSS classes for events
   */
  eventClassName: PropTypes.string,
  /**
   * First day of the week (0 = Sunday, 1 = Monday, etc.)
   */
  firstDayOfWeek: PropTypes.number,
  /**
   * Whether to show the calendar header
   */
  showHeader: PropTypes.bool,
  /**
   * Whether to show the view selector
   */
  showViewSelector: PropTypes.bool,
  /**
   * Whether to show the create button
   */
  showCreateButton: PropTypes.bool,
  /**
   * Text for the create button
   */
  createButtonText: PropTypes.string,
  /**
   * Start hour for day and week views
   */
  dayStartHour: PropTypes.number,
  /**
   * End hour for day and week views
   */
  dayEndHour: PropTypes.number,
  /**
   * Time slot interval in minutes for day and week views
   */
  timeSlotInterval: PropTypes.number,
  /**
   * Minimum height for events in pixels
   */
  eventMinHeight: PropTypes.number,
  /**
   * Whether the calendar is in readonly mode
   */
  readonly: PropTypes.bool,
  /**
   * Whether the calendar is in loading state
   */
  loading: PropTypes.bool,
  /**
   * Message to display when the calendar is loading
   */
  loadingMessage: PropTypes.string,
};

export default Calendar;
