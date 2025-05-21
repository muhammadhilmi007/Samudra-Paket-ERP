"use client";

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  format,
  parseISO,
  addHours,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
  isSameDay,
  addMinutes,
} from 'date-fns';
import cn from 'classnames';

/**
 * DayView Component
 * Displays a calendar day view with events
 */
const DayView = ({
  date = new Date(),
  events = [],
  onDateClick,
  onEventClick,
  onDragStart,
  onDragOver,
  onDrop,
  selectedDate,
  dayClassName = '',
  eventClassName = '',
  startHour = 8,
  endHour = 18,
  timeSlotInterval = 30, // in minutes
  eventMinHeight = 24, // in pixels
  readonly = false,
}) => {
  // Calculate time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    const totalSlots = ((endHour - startHour) * 60) / timeSlotInterval;

    for (let i = 0; i <= totalSlots; i++) {
      const minutes = i * timeSlotInterval;
      const hour = startHour + Math.floor(minutes / 60);
      const minute = minutes % 60;
      
      slots.push({
        hour,
        minute,
        label: format(setMinutes(setHours(new Date(), hour), minute), 'h:mm a'),
      });
    }

    return slots;
  }, [startHour, endHour, timeSlotInterval]);

  // Filter and process events for the day
  const dayEvents = useMemo(() => {
    // Filter events for this day
    const filteredEvents = events.filter((event) => {
      const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      const eventEnd = typeof event.end === 'string' ? parseISO(event.end) : event.end || addHours(eventStart, 1);
      
      return (
        !event.allDay && // Skip all-day events
        (isSameDay(eventStart, date) || isSameDay(eventEnd, date) || (eventStart < date && eventEnd > date))
      );
    });
    
    // Process events to calculate position and size
    const processedEvents = filteredEvents.map((event) => {
      const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      const eventEnd = typeof event.end === 'string' ? parseISO(event.end) : event.end || addHours(eventStart, 1);
      
      // Calculate position and height for the event
      const eventStartHour = isSameDay(eventStart, date) ? getHours(eventStart) : 0;
      const eventStartMinute = isSameDay(eventStart, date) ? getMinutes(eventStart) : 0;
      const eventEndHour = isSameDay(eventEnd, date) ? getHours(eventEnd) : 23;
      const eventEndMinute = isSameDay(eventEnd, date) ? getMinutes(eventEnd) : 59;
      
      // Skip events that are outside the visible time range
      if (eventEndHour < startHour || eventStartHour > endHour) {
        return null;
      }
      
      // Calculate top position (percentage of the day)
      const dayStartMinutes = startHour * 60;
      const eventStartMinutes = eventStartHour * 60 + eventStartMinute;
      const eventEndMinutes = eventEndHour * 60 + eventEndMinute;
      const visibleDayMinutes = (endHour - startHour) * 60;
      
      const topPercentage = Math.max(0, ((eventStartMinutes - dayStartMinutes) / visibleDayMinutes) * 100);
      const heightPercentage = Math.min(
        100 - topPercentage,
        ((eventEndMinutes - Math.max(dayStartMinutes, eventStartMinutes)) / visibleDayMinutes) * 100
      );
      
      return {
        ...event,
        top: `${topPercentage}%`,
        height: `${Math.max(heightPercentage, (eventMinHeight / (visibleDayMinutes * 0.6)) * 100)}%`,
        start: eventStart,
        end: eventEnd,
      };
    }).filter(Boolean);
    
    // Sort events by start time
    processedEvents.sort((a, b) => a.start - b.start);
    
    // Handle overlapping events
    const columns = [];
    
    processedEvents.forEach((event) => {
      // Find the first column where the event doesn't overlap
      let columnIndex = 0;
      while (
        columns[columnIndex] &&
        columns[columnIndex].some((columnEvent) => {
          const eventStart = event.start;
          const eventEnd = event.end;
          const columnEventStart = columnEvent.start;
          const columnEventEnd = columnEvent.end;
          
          return (
            (eventStart >= columnEventStart && eventStart < columnEventEnd) ||
            (eventEnd > columnEventStart && eventEnd <= columnEventEnd) ||
            (eventStart <= columnEventStart && eventEnd >= columnEventEnd)
          );
        })
      ) {
        columnIndex++;
      }
      
      // Create column if it doesn't exist
      if (!columns[columnIndex]) {
        columns[columnIndex] = [];
      }
      
      // Add event to column
      columns[columnIndex].push(event);
      
      // Update event with column information
      event.column = columnIndex;
      event.totalColumns = 1; // Will be updated later
    });
    
    // Update total columns for each event
    const totalColumns = columns.length;
    processedEvents.forEach((event) => {
      event.totalColumns = totalColumns;
      event.width = `${100 / totalColumns}%`;
      event.left = `${(event.column * 100) / totalColumns}%`;
    });
    
    return processedEvents;
  }, [date, events, startHour, endHour, eventMinHeight]);

  // Get all-day events
  const allDayEvents = useMemo(() => {
    return events.filter((event) => {
      const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      const eventEnd = typeof event.end === 'string' ? parseISO(event.end) : event.end || eventStart;
      
      return (
        event.allDay &&
        (isSameDay(eventStart, date) || isSameDay(eventEnd, date) || (eventStart < date && eventEnd > date))
      );
    });
  }, [date, events]);

  // Handle date click
  const handleDateClick = (hour, minute) => {
    if (onDateClick) {
      const clickedDate = setMinutes(setHours(date, hour), minute);
      onDateClick(clickedDate);
    }
  };

  // Handle event click
  const handleEventClick = (e, event) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Handle drag and drop
  const handleDragStart = (e, event) => {
    if (readonly) return;
    e.stopPropagation();
    if (onDragStart) {
      onDragStart(event);
    }
  };

  const handleDragOver = (e, hour, minute) => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    if (onDragOver) {
      const dragOverDate = setMinutes(setHours(date, hour), minute);
      onDragOver(dragOverDate);
    }
  };

  const handleDrop = (e, hour, minute) => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    if (onDrop) {
      const dropDate = setMinutes(setHours(date, hour), minute);
      onDrop(dropDate);
    }
  };

  // Render day header
  const renderDayHeader = () => {
    return (
      <div className="py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-center text-gray-900">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>
    );
  };

  // Render all-day events
  const renderAllDayEvents = () => {
    if (allDayEvents.length === 0) return null;

    return (
      <div className="py-2 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-20 py-2 px-2 text-xs text-gray-500 font-medium">All Day</div>
          <div className="flex-1 px-2">
            {allDayEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  'text-xs px-2 py-1 mb-1 rounded truncate',
                  'cursor-pointer',
                  event.color ? `bg-${event.color}-100 text-${event.color}-800` : 'bg-primary-100 text-primary-800',
                  eventClassName,
                  event.className
                )}
                onClick={(e) => handleEventClick(e, event)}
                draggable={!readonly}
                onDragStart={(e) => handleDragStart(e, event)}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render time grid
  const renderTimeGrid = () => {
    return (
      <div className="grid grid-cols-[80px_1fr] h-[600px] overflow-y-auto relative">
        {/* Time labels */}
        <div className="border-r border-gray-200">
          {timeSlots.map((slot, i) => (
            <div
              key={i}
              className={cn(
                'text-xs text-gray-500 text-right pr-2 sticky left-0',
                i > 0 && 'border-t border-gray-200'
              )}
              style={{ height: `${100 / timeSlots.length}%` }}
            >
              {i > 0 && slot.minute === 0 && slot.label}
            </div>
          ))}
        </div>

        {/* Event container */}
        <div className="relative">
          {/* Time slots */}
          {timeSlots.map((slot, i) => (
            <div
              key={i}
              className={cn(
                'w-full',
                i > 0 && 'border-t border-gray-200',
                selectedDate &&
                  isSameDay(date, selectedDate) &&
                  getHours(selectedDate) === slot.hour &&
                  Math.floor(getMinutes(selectedDate) / timeSlotInterval) * timeSlotInterval === slot.minute &&
                  'bg-primary-50'
              )}
              style={{ height: `${100 / timeSlots.length}%` }}
              onClick={() => handleDateClick(slot.hour, slot.minute)}
              onDragOver={(e) => handleDragOver(e, slot.hour, slot.minute)}
              onDrop={(e) => handleDrop(e, slot.hour, slot.minute)}
            ></div>
          ))}

          {/* Events */}
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className={cn(
                'absolute rounded px-2 py-1 overflow-hidden text-xs',
                'cursor-pointer',
                event.color ? `bg-${event.color}-100 text-${event.color}-800` : 'bg-primary-100 text-primary-800',
                eventClassName,
                event.className
              )}
              style={{
                top: event.top,
                height: event.height,
                width: event.width,
                left: event.left,
              }}
              onClick={(e) => handleEventClick(e, event)}
              draggable={!readonly}
              onDragStart={(e) => handleDragStart(e, event)}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-xs opacity-75">
                {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
              </div>
              {event.description && (
                <div className="text-xs mt-1 opacity-75 truncate">{event.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full border border-gray-200 rounded-md overflow-hidden">
      {renderDayHeader()}
      {renderAllDayEvents()}
      {renderTimeGrid()}
    </div>
  );
};

DayView.propTypes = {
  /**
   * Current date to display
   */
  date: PropTypes.instanceOf(Date),
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
   * Callback when a date is clicked
   */
  onDateClick: PropTypes.func,
  /**
   * Callback when an event is clicked
   */
  onEventClick: PropTypes.func,
  /**
   * Callback when an event drag starts
   */
  onDragStart: PropTypes.func,
  /**
   * Callback when an event is dragged over a date
   */
  onDragOver: PropTypes.func,
  /**
   * Callback when an event is dropped on a date
   */
  onDrop: PropTypes.func,
  /**
   * Currently selected date
   */
  selectedDate: PropTypes.instanceOf(Date),
  /**
   * Additional CSS classes for calendar days
   */
  dayClassName: PropTypes.string,
  /**
   * Additional CSS classes for events
   */
  eventClassName: PropTypes.string,
  /**
   * Start hour for the time grid
   */
  startHour: PropTypes.number,
  /**
   * End hour for the time grid
   */
  endHour: PropTypes.number,
  /**
   * Time slot interval in minutes
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
};

export default DayView;
