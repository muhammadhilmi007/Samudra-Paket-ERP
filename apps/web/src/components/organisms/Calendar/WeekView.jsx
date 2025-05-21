"use client";

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  addHours,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
  isWithinInterval,
  addMinutes,
} from 'date-fns';
import cn from 'classnames';

/**
 * WeekView Component
 * Displays a calendar week view with events
 */
const WeekView = ({
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
  firstDayOfWeek = 0, // 0 = Sunday, 1 = Monday, etc.
  startHour = 8,
  endHour = 18,
  timeSlotInterval = 30, // in minutes
  eventMinHeight = 24, // in pixels
  readonly = false,
}) => {
  // Calculate days to display in the week view
  const days = useMemo(() => {
    const weekStart = startOfWeek(date, { weekStartsOn: firstDayOfWeek });
    const weekEnd = endOfWeek(date, { weekStartsOn: firstDayOfWeek });

    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [date, firstDayOfWeek]);

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

  // Group events by day and time slot
  const eventsByDay = useMemo(() => {
    const eventMap = {};

    days.forEach((day) => {
      const dayKey = format(day, 'yyyy-MM-dd');
      eventMap[dayKey] = [];
    });

    events.forEach((event) => {
      const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      const eventEnd = typeof event.end === 'string' ? parseISO(event.end) : event.end || addHours(eventStart, 1);
      
      // Skip all-day events (they should be displayed in a separate section)
      if (event.allDay) return;
      
      // Find which day(s) this event belongs to
      days.forEach((day) => {
        // Check if event occurs on this day
        if (
          isSameDay(eventStart, day) ||
          isSameDay(eventEnd, day) ||
          (eventStart < day && eventEnd > day)
        ) {
          const dayKey = format(day, 'yyyy-MM-dd');
          
          // Calculate position and height for the event
          const eventStartHour = isSameDay(eventStart, day) ? getHours(eventStart) : 0;
          const eventStartMinute = isSameDay(eventStart, day) ? getMinutes(eventStart) : 0;
          const eventEndHour = isSameDay(eventEnd, day) ? getHours(eventEnd) : 23;
          const eventEndMinute = isSameDay(eventEnd, day) ? getMinutes(eventEnd) : 59;
          
          // Skip events that are outside the visible time range
          if (eventEndHour < startHour || eventStartHour > endHour) return;
          
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
          
          eventMap[dayKey].push({
            ...event,
            top: `${topPercentage}%`,
            height: `${Math.max(heightPercentage, (eventMinHeight / (visibleDayMinutes * 0.6)) * 100)}%`,
            start: eventStart,
            end: eventEnd,
          });
        }
      });
    });

    // Sort events by start time and handle overlapping events
    Object.keys(eventMap).forEach((dayKey) => {
      const dayEvents = eventMap[dayKey];
      
      // Sort by start time
      dayEvents.sort((a, b) => a.start - b.start);
      
      // Handle overlapping events
      const columns = [];
      
      dayEvents.forEach((event) => {
        // Find the first column where the event doesn't overlap
        let columnIndex = 0;
        while (
          columns[columnIndex] &&
          columns[columnIndex].some((columnEvent) =>
            isWithinInterval(event.start, { start: columnEvent.start, end: columnEvent.end }) ||
            isWithinInterval(event.end, { start: columnEvent.start, end: columnEvent.end }) ||
            isWithinInterval(columnEvent.start, { start: event.start, end: event.end })
          )
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
      dayEvents.forEach((event) => {
        event.totalColumns = totalColumns;
        event.width = `${100 / totalColumns}%`;
        event.left = `${(event.column * 100) / totalColumns}%`;
      });
      
      eventMap[dayKey] = dayEvents;
    });

    return eventMap;
  }, [days, events, startHour, endHour, eventMinHeight]);

  // Get all-day events
  const allDayEvents = useMemo(() => {
    const allDayMap = {};

    days.forEach((day) => {
      const dayKey = format(day, 'yyyy-MM-dd');
      allDayMap[dayKey] = [];
    });

    events
      .filter((event) => event.allDay)
      .forEach((event) => {
        const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
        const eventEnd = typeof event.end === 'string' ? parseISO(event.end) : event.end || eventStart;
        
        // Find which day(s) this event belongs to
        days.forEach((day) => {
          if (
            isSameDay(eventStart, day) ||
            isSameDay(eventEnd, day) ||
            (eventStart < day && eventEnd > day)
          ) {
            const dayKey = format(day, 'yyyy-MM-dd');
            allDayMap[dayKey].push({
              ...event,
              isStart: isSameDay(eventStart, day),
              isEnd: isSameDay(eventEnd, day),
              isMultiDay: !isSameDay(eventStart, eventEnd),
            });
          }
        });
      });

    return allDayMap;
  }, [days, events]);

  // Handle date click
  const handleDateClick = (day, hour, minute) => {
    if (onDateClick) {
      const clickedDate = setMinutes(setHours(day, hour), minute);
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

  const handleDragOver = (e, day, hour, minute) => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    if (onDragOver) {
      const dragOverDate = setMinutes(setHours(day, hour), minute);
      onDragOver(dragOverDate);
    }
  };

  const handleDrop = (e, day, hour, minute) => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    if (onDrop) {
      const dropDate = setMinutes(setHours(day, hour), minute);
      onDrop(dropDate);
    }
  };

  // Render day header
  const renderDayHeader = () => {
    return (
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="py-2 text-center text-gray-500 text-sm font-medium"></div>
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(
              'py-2 text-center',
              isSameDay(day, new Date()) && 'bg-blue-50 font-semibold text-primary-600'
            )}
          >
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className="text-lg">{format(day, 'd')}</div>
          </div>
        ))}
      </div>
    );
  };

  // Render all-day events
  const renderAllDayEvents = () => {
    return (
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="py-2 px-2 text-xs text-gray-500 font-medium">All Day</div>
        {days.map((day, i) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayEvents = allDayEvents[dayKey] || [];
          
          return (
            <div
              key={i}
              className={cn(
                'py-2 px-1 min-h-[40px]',
                isSameDay(day, new Date()) && 'bg-blue-50'
              )}
            >
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'text-xs px-2 py-1 mb-1 truncate',
                    'cursor-pointer',
                    event.isMultiDay && 'rounded-none',
                    event.isStart && 'rounded-l',
                    event.isEnd && 'rounded-r',
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
          );
        })}
      </div>
    );
  };

  // Render time grid
  const renderTimeGrid = () => {
    return (
      <div className="grid grid-cols-8 h-[600px] overflow-y-auto relative">
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

        {/* Day columns */}
        {days.map((day, dayIndex) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDay[dayKey] || [];
          
          return (
            <div
              key={dayIndex}
              className={cn(
                'relative border-r border-gray-200',
                isSameDay(day, new Date()) && 'bg-blue-50'
              )}
            >
              {/* Time slots */}
              {timeSlots.map((slot, slotIndex) => (
                <div
                  key={slotIndex}
                  className={cn(
                    'w-full',
                    slotIndex > 0 && 'border-t border-gray-200',
                    isSameDay(day, selectedDate) &&
                      selectedDate &&
                      getHours(selectedDate) === slot.hour &&
                      Math.floor(getMinutes(selectedDate) / timeSlotInterval) * timeSlotInterval === slot.minute &&
                      'bg-primary-50'
                  )}
                  style={{ height: `${100 / timeSlots.length}%` }}
                  onClick={() => handleDateClick(day, slot.hour, slot.minute)}
                  onDragOver={(e) => handleDragOver(e, day, slot.hour, slot.minute)}
                  onDrop={(e) => handleDrop(e, day, slot.hour, slot.minute)}
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
                </div>
              ))}
            </div>
          );
        })}
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

WeekView.propTypes = {
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
   * First day of the week (0 = Sunday, 1 = Monday, etc.)
   */
  firstDayOfWeek: PropTypes.number,
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

export default WeekView;
