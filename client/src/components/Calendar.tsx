import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, startOfDay, endOfDay, addWeeks, subWeeks } from 'date-fns';

// Types for events
interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'service' | 'rehearsal' | 'meeting' | 'other';
}

// Props for the Calendar component
interface CalendarProps {
  events?: Event[];
}

// Calendar view types
type CalendarView = 'month' | 'week' | 'day';

const Calendar: React.FC<CalendarProps> = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(day, event.start) || 
      (event.start < day && event.end > day)
    );
  };

  // Navigation functions
  const previous = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const next = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  // Get the header title based on the current view
  const getViewTitle = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (view === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  // Get the class for an event based on its type
  const getEventClass = (type: Event['type']) => {
    switch (type) {
      case 'service':
        return 'bg-primary-100 text-primary-800 border-primary-300';
      case 'rehearsal':
        return 'bg-secondary-100 text-secondary-800 border-secondary-300';
      case 'meeting':
        return 'bg-accent-100 text-accent-800 border-accent-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  // Render the month view
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    // Render the days of the week header
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      daysOfWeek.push(
        <div key={i} className="text-center font-medium py-2">
          {format(addDays(startOfWeek(new Date()), i), 'EEEEEE')}
        </div>
      );
    }

    // Render the calendar cells
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayEvents = getEventsForDay(cloneDay);
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] p-1 border border-neutral-200 ${
              !isSameMonth(day, monthStart)
                ? 'text-neutral-400 bg-neutral-50'
                : isSameDay(day, new Date())
                ? 'bg-primary-50 text-primary-900'
                : 'text-neutral-900'
            }`}
          >
            <div className="text-right p-1">{formattedDate}</div>
            <div className="overflow-y-auto max-h-[80px]">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className={`text-xs p-1 mb-1 rounded truncate border-l-2 ${getEventClass(event.type)}`}
                >
                  {format(event.start, 'h:mm a')} - {event.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div>
        <div className="grid grid-cols-7">{daysOfWeek}</div>
        {rows}
      </div>
    );
  };

  // Render the week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(weekStart);
    const hours = [];

    // Create time slots for each hour
    for (let hour = 6; hour < 22; hour++) {
      const hourRow = [];
      const timeLabel = format(new Date().setHours(hour, 0, 0, 0), 'h a');
      
      // Add time label column
      hourRow.push(
        <div key="time" className="text-right pr-2 text-xs text-neutral-500">
          {timeLabel}
        </div>
      );

      // Add a column for each day of the week
      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);
        const startHour = new Date(day).setHours(hour, 0, 0, 0);
        const endHour = new Date(day).setHours(hour + 1, 0, 0, 0);
        
        // Find events that occur during this hour
        const hourEvents = events.filter(event => {
          const eventStart = event.start.getTime();
          const eventEnd = event.end.getTime();
          return (eventStart >= startHour && eventStart < endHour) || 
                 (eventEnd > startHour && eventEnd <= endHour) ||
                 (eventStart <= startHour && eventEnd >= endHour);
        });

        hourRow.push(
          <div 
            key={`day-${i}`} 
            className={`border border-neutral-200 p-1 min-h-[50px] ${
              isSameDay(day, new Date()) ? 'bg-primary-50' : ''
            }`}
          >
            {hourEvents.map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 mb-1 rounded truncate border-l-2 ${getEventClass(event.type)}`}
              >
                {event.title}
              </div>
            ))}
          </div>
        );
      }

      hours.push(
        <div key={`hour-${hour}`} className="grid grid-cols-8">
          {hourRow}
        </div>
      );
    }

    // Create day headers
    const dayHeaders = [<div key="empty" className="text-center py-2"></div>];
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      dayHeaders.push(
        <div 
          key={`header-${i}`} 
          className={`text-center font-medium py-2 ${
            isSameDay(day, new Date()) ? 'text-primary-600' : ''
          }`}
        >
          {format(day, 'EEE')}<br />
          {format(day, 'd')}
        </div>
      );
    }

    return (
      <div>
        <div className="grid grid-cols-8">{dayHeaders}</div>
        {hours}
      </div>
    );
  };

  // Render the day view
  const renderDayView = () => {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    const hours = [];

    // Create time slots for each hour
    for (let hour = 6; hour < 22; hour++) {
      const timeLabel = format(new Date().setHours(hour, 0, 0, 0), 'h a');
      const startHour = new Date(dayStart).setHours(hour, 0, 0, 0);
      const endHour = new Date(dayStart).setHours(hour + 1, 0, 0, 0);
      
      // Find events that occur during this hour
      const hourEvents = events.filter(event => {
        const eventStart = event.start.getTime();
        const eventEnd = event.end.getTime();
        return (eventStart >= startHour && eventStart < endHour) || 
               (eventEnd > startHour && eventEnd <= endHour) ||
               (eventStart <= startHour && eventEnd >= endHour);
      });

      hours.push(
        <div key={`hour-${hour}`} className="grid grid-cols-8">
          <div className="text-right pr-2 text-xs text-neutral-500">
            {timeLabel}
          </div>
          <div className="col-span-7 border border-neutral-200 p-2 min-h-[60px]">
            {hourEvents.map(event => (
              <div
                key={event.id}
                className={`p-2 mb-1 rounded border-l-2 ${getEventClass(event.type)}`}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-neutral-500">
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <div>{hours}</div>;
  };

  // Render the appropriate view
  const renderView = () => {
    switch (view) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-neutral-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              onClick={previous}
              className="p-2 rounded-md hover:bg-neutral-100"
            >
              &lt;
            </button>
            <button
              onClick={today}
              className="px-3 py-1 rounded-md border border-neutral-300 text-sm"
            >
              Today
            </button>
            <button
              onClick={next}
              className="p-2 rounded-md hover:bg-neutral-100"
            >
              &gt;
            </button>
          </div>
          <h2 className="text-xl font-bold">{getViewTitle()}</h2>
          <div className="flex space-x-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded-md text-sm ${
                view === 'month'
                  ? 'bg-primary-100 text-primary-800'
                  : 'hover:bg-neutral-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-md text-sm ${
                view === 'week'
                  ? 'bg-primary-100 text-primary-800'
                  : 'hover:bg-neutral-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 rounded-md text-sm ${
                view === 'day'
                  ? 'bg-primary-100 text-primary-800'
                  : 'hover:bg-neutral-100'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">{renderView()}</div>
    </div>
  );
};

export default Calendar; 