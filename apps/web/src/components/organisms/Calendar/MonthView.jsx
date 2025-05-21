"use client";

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  isWithinInterval,
  addDays,
} from 'date-fns';
import cn from 'classnames';

/**
 * MonthView Component
 * Displays a calendar month view with events
 */
const MonthView = ({
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
  readonly = false,
}) => {
  // Calculate days to display in the month view
  const days = useMemo(() => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const startDate = startOfWeek(monthStart, { weekStartsOn: firstDayOfWeek });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: firstDayOfWeek });

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [date, firstDayOfWeek]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const eventMap = {};

    events.forEach((event) => {
      const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      const eventEnd = typeof event.end === 'string' ? parseISO(event.end) : event.end || eventStart;
      
      // For multi-day events, add to each day in the range
      let currentDate = eventStart;
      while (currentDate <= eventEnd) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        
        if (!eventMap[dateKey]) {
          eventMap[dateKey] = [];
        }
        
        eventMap[dateKey].push({
          ...event,
          isStart: isSameDay(currentDate, eventStart),
          isEnd: isSameDay(currentDate, eventEnd),
          isMultiDay: !isSameDay(eventStart, eventEnd),
        });
        
        currentDate = addDays(currentDate, 1);
      }
    });

    return eventMap;
  }, [events]);

  // Handle date click
  const handleDateClick = (day) => {
    if (onDateClick) {
      onDateClick(day);
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

  const handleDragOver = (e, day) => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    if (onDragOver) {
      onDragOver(day);
    }
  };

  const handleDrop = (e, day) => {
    if (readonly) return;
    e.preventDefault();
    e.stopPropagation();
    if (onDrop) {
      onDrop(day);
    }
  };

  // Render day header (weekday names)
  const renderDayHeader = () => {
    const weekDays = [];
    const date = startOfWeek(new Date(), { weekStartsOn: firstDayOfWeek });

    for (let i = 0; i < 7; i++) {
      weekDays.push(
        <div key={i} className="font-medium text-center py-2 text-gray-500 text-sm">
          {format(addDays(date, i), 'EEEEEE')}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{weekDays}</div>;
  };

  // Render events for a specific day
  const renderEvents = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dateKey] || [];
    
    // Limit the number of events to display
    const maxEventsToShow = 3;
    const visibleEvents = dayEvents.slice(0, maxEventsToShow);
    const remainingCount = dayEvents.length - maxEventsToShow;

    return (
      <>
        {visibleEvents.map((event) => (
          <div
            key={event.id}
            className={cn(
              'text-xs px-2 py-1 mb-1 rounded truncate',
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
        
        {remainingCount > 0 && (
          <div className="text-xs text-gray-500 px-2">
            +{remainingCount} more
          </div>
        )}
      </>
    );
  };

  // Render days grid
  const renderDays = () => {
    const rows = [];
    let cells = [];

    days.forEach((day, i) => {
      cells.push(
        <div
          key={day.toString()}
          className={cn(
            'min-h-[100px] p-2 border border-gray-200',
            !isSameMonth(day, date) && 'bg-gray-50 text-gray-400',
            isSameDay(day, new Date()) && 'bg-blue-50',
            isSameDay(day, selectedDate) && 'bg-primary-50',
            'cursor-pointer hover:bg-gray-50',
            dayClassName
          )}
          onClick={() => handleDateClick(day)}
          onDragOver={(e) => handleDragOver(e, day)}
          onDrop={(e) => handleDrop(e, day)}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={cn(
              'text-sm font-medium',
              isSameDay(day, new Date()) && 'text-primary-600'
            )}>
              {format(day, 'd')}
            </span>
            {!readonly && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full -mr-1 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDateClick) {
                    onDateClick(day);
                  }
                }}
              >
                +
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-[80px]">
            {renderEvents(day)}
          </div>
        </div>
      );

      if ((i + 1) % 7 === 0) {
        rows.push(
          <div key={`row-${i}`} className="grid grid-cols-7">
            {cells}
          </div>
        );
        cells = [];
      }
    });

    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="w-full">
      {renderDayHeader()}
      {renderDays()}
    </div>
  );
};

MonthView.propTypes = {
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
   * Whether the calendar is in readonly mode
   */
  readonly: PropTypes.bool,
};

export default MonthView;
