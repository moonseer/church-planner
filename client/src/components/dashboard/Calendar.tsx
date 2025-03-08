import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addWeeks, subWeeks, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';

// Types for events
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'service' | 'rehearsal' | 'meeting';
  status?: 'draft' | 'published' | 'completed';
}

// Props for the Calendar component
interface CalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date) => void;
}

// View type for the calendar
type CalendarView = 'month' | 'week' | 'day';

const Calendar = ({ events, onEventClick, onDateClick }: CalendarProps) => {
  // State for the current date and view
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  
  // Get days for the current view
  const getDays = () => {
    switch (view) {
      case 'month':
        return eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        });
      case 'week':
        return eachDayOfInterval({
          start: startOfWeek(currentDate, { weekStartsOn: 0 }),
          end: endOfWeek(currentDate, { weekStartsOn: 0 })
        });
      case 'day':
        return [currentDate];
      default:
        return [];
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  // Navigation functions
  const previous = () => {
    switch (view) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const next = () => {
    switch (view) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  // Get the title for the current view
  const getViewTitle = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        const start = startOfWeek(currentDate, { weekStartsOn: 0 });
        const end = endOfWeek(currentDate, { weekStartsOn: 0 });
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return '';
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
    const days = getDays();
    const firstDayOfMonth = startOfMonth(currentDate);
    const dayOfWeek = firstDayOfMonth.getDay();
    
    // Create an array of blank days to fill in the beginning of the month
    const blankDays = Array(dayOfWeek).fill(null);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-neutral-500 py-2">
            {day}
          </div>
        ))}
        
        {/* Blank days */}
        {blankDays.map((_, index) => (
          <div key={`blank-${index}`} className="h-24 border border-neutral-200 bg-neutral-50"></div>
        ))}
        
        {/* Calendar days */}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toString()} 
              className={`h-24 border border-neutral-200 ${isToday ? 'bg-primary-50' : 'bg-white'} overflow-hidden`}
              onClick={() => onDateClick(day)}
            >
              <div className={`text-right p-1 ${isToday ? 'font-bold text-primary-600' : ''}`}>
                {format(day, 'd')}
              </div>
              <div className="px-1 space-y-1 overflow-y-auto max-h-16">
                {dayEvents.slice(0, 3).map((event) => (
                  <div 
                    key={event.id} 
                    className={`text-xs p-1 rounded border truncate cursor-pointer ${getEventClass(event.type)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.time} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-neutral-500 pl-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render the week view
  const renderWeekView = () => {
    const days = getDays();
    
    return (
      <div className="flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b border-neutral-200">
          <div className="py-2 text-center text-sm font-medium text-neutral-500">Time</div>
          {days.map((day) => (
            <div 
              key={day.toString()} 
              className={`py-2 text-center text-sm font-medium ${isSameDay(day, new Date()) ? 'text-primary-600 font-bold' : 'text-neutral-500'}`}
            >
              {format(day, 'EEE')}<br />
              {format(day, 'MMM d')}
            </div>
          ))}
        </div>
        
        {/* Time slots */}
        {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'].map((time) => (
          <div key={time} className="grid grid-cols-8 border-b border-neutral-200 min-h-16">
            <div className="py-2 text-xs text-neutral-500 border-r border-neutral-200 text-center">
              {time}
            </div>
            {days.map((day) => {
              const dayEvents = getEventsForDay(day).filter(event => event.time.includes(time.split(' ')[0]));
              
              return (
                <div 
                  key={day.toString()} 
                  className="p-1 relative"
                  onClick={() => onDateClick(day)}
                >
                  {dayEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`text-xs p-1 rounded border truncate cursor-pointer ${getEventClass(event.type)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Render the day view
  const renderDayView = () => {
    const dayEvents = getEventsForDay(currentDate);
    
    return (
      <div className="flex flex-col">
        {/* Time slots */}
        {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'].map((time) => {
          const timeEvents = dayEvents.filter(event => event.time.includes(time.split(' ')[0]));
          
          return (
            <div key={time} className="flex border-b border-neutral-200 min-h-16">
              <div className="w-20 py-2 text-sm text-neutral-500 border-r border-neutral-200 text-center">
                {time}
              </div>
              <div 
                className="flex-1 p-1"
                onClick={() => onDateClick(currentDate)}
              >
                {timeEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className={`text-sm p-2 rounded border mb-1 cursor-pointer ${getEventClass(event.type)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs">{event.time}</div>
                    {event.status && (
                      <div className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' : 
                        event.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
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
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-neutral-900">{getViewTitle()}</h2>
          <div className="flex space-x-1">
            <button 
              onClick={previous}
              className="p-1 rounded-full hover:bg-neutral-100"
              aria-label="Previous"
            >
              <ChevronLeftIcon className="h-5 w-5 text-neutral-500" />
            </button>
            <button 
              onClick={next}
              className="p-1 rounded-full hover:bg-neutral-100"
              aria-label="Next"
            >
              <ChevronRightIcon className="h-5 w-5 text-neutral-500" />
            </button>
          </div>
          <button 
            onClick={today}
            className="px-3 py-1 text-sm rounded-md border border-neutral-300 hover:bg-neutral-50"
          >
            Today
          </button>
        </div>
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 text-sm font-medium ${
              view === 'month'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            } border border-neutral-300 rounded-l-md`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 text-sm font-medium ${
              view === 'week'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            } border-t border-b border-neutral-300`}
          >
            Week
          </button>
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 text-sm font-medium ${
              view === 'day'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            } border border-neutral-300 rounded-r-md`}
          >
            Day
          </button>
        </div>
      </div>
      <div className="p-4">
        {renderView()}
      </div>
    </div>
  );
};

export default Calendar; 