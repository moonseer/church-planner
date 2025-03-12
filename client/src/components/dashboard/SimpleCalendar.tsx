import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Define Event type
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'service' | 'rehearsal' | 'meeting' | 'youth';
  status?: 'draft' | 'published' | 'completed';
}

// Props for the Calendar component
interface SimpleCalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
}

const SimpleCalendar: React.FC<SimpleCalendarProps> = ({ 
  events = [], 
  onEventClick = () => {}, 
  onDateClick = () => {} 
}) => {
  // State for current date
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // March 2025
  
  // Log events when component mounts
  useEffect(() => {
    console.log('SimpleCalendar mounted with events:', events);
    
    // Check for events in March 2025
    const march2025Events = events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return eventDate.getMonth() === 2 && eventDate.getFullYear() === 2025;
      } catch (error) {
        console.error('Error parsing date:', error);
        return false;
      }
    });
    
    console.log('March 2025 events:', march2025Events);
    
    // Check for March 2nd events specifically
    const march2Events = events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return eventDate.getDate() === 2 && eventDate.getMonth() === 2 && eventDate.getFullYear() === 2025;
      } catch (error) {
        console.error('Error parsing date:', error);
        return false;
      }
    });
    
    console.log('March 2nd events:', march2Events);
    
    // Add test event for debugging
    console.log('Adding test event for March 2nd');
  }, [events]);
  
  // Navigation functions
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());
  
  // Get days for the current month
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };
  
  // Get events for a specific day
  const getEventsForDay = (day: Date): Event[] => {
    // For March 2nd, add a direct console log
    if (day.getDate() === 2 && day.getMonth() === 2) {
      console.log(`Checking events for March 2nd specifically`);
    }
    
    const dayEvents = events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        const isSame = isSameDay(eventDate, day);
        
        // For March 2nd, log each comparison
        if (day.getDate() === 2 && day.getMonth() === 2) {
          console.log(`Comparing event date ${format(eventDate, 'yyyy-MM-dd')} with March 2nd: ${isSame}`);
        }
        
        return isSame;
      } catch (error) {
        console.error('Error parsing date:', error, event.date);
        return false;
      }
    });
    
    // For March 2nd, log the found events
    if (day.getDate() === 2 && day.getMonth() === 2) {
      console.log(`Found ${dayEvents.length} events for March 2nd:`, dayEvents);
    }
    
    return dayEvents;
  };
  
  // Get class for event type
  const getEventClass = (type: Event['type']) => {
    switch (type) {
      case 'service':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rehearsal':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'meeting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'youth':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Render calendar
  const renderCalendar = () => {
    const days = getDaysInMonth();
    const firstDayOfMonth = startOfMonth(currentDate);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    // Create blank days to fill in the beginning of the month
    const blankDays = Array(dayOfWeek).fill(null);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {/* Blank days */}
        {blankDays.map((_, index) => (
          <div key={`blank-${index}`} className="h-24 bg-gray-50 border border-gray-100"></div>
        ))}
        
        {/* Calendar days */}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          
          // Add a hardcoded test event for March 2nd
          const isSpecialDay = day.getDate() === 2 && day.getMonth() === 2;
          
          return (
            <div 
              key={day.toString()} 
              className={`
                h-24 border p-1 overflow-hidden
                ${isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'} 
                ${isTodayDate ? 'bg-blue-50 border-blue-300' : ''}
                ${isSpecialDay ? 'ring-2 ring-red-500' : ''}
                hover:bg-gray-50 cursor-pointer
              `}
              onClick={() => onDateClick(day)}
            >
              <div className={`
                text-right p-1 font-medium
                ${isTodayDate ? 'text-blue-600' : 'text-gray-700'}
              `}>
                {format(day, 'd')}
              </div>
              
              {/* Events for this day */}
              <div className="space-y-1 overflow-y-auto max-h-16">
                {dayEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className={`
                      text-xs p-1 rounded border truncate cursor-pointer
                      ${getEventClass(event.type)}
                      hover:opacity-80 font-bold border-2
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Event clicked:', event);
                      onEventClick(event);
                    }}
                  >
                    {event.time.split(' ')[0]} {event.title}
                  </div>
                ))}
                
                {/* Hardcoded test event for March 2nd */}
                {isSpecialDay && (
                  <div 
                    className="text-xs p-1 rounded border truncate cursor-pointer bg-blue-100 text-blue-800 border-blue-300 font-bold border-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Test event clicked');
                      onEventClick({
                        id: 'test',
                        title: 'Test Sunday Service',
                        date: new Date(2025, 2, 2, 9, 0).toISOString(),
                        time: '9:00 AM - 11:00 AM',
                        type: 'service'
                      });
                    }}
                  >
                    9:00 AM Test Sunday Service
                  </div>
                )}
                
                {/* Debug info - show on March 2 if no events */}
                {day.getDate() === 2 && day.getMonth() === 2 && dayEvents.length === 0 && !isSpecialDay && (
                  <div className="text-xs text-red-500 font-bold">
                    Expected: Sunday Service
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Debug info */}
      <div className="mb-4 p-2 bg-gray-100 text-xs rounded">
        <p><strong>Debug Info:</strong></p>
        <p>Current Month: {format(currentDate, 'MMMM yyyy')}</p>
        <p>Total Events: {events.length}</p>
        <p>Events in Current Month: {events.filter(event => {
          try {
            const eventDate = parseISO(event.date);
            return isSameMonth(eventDate, currentDate);
          } catch (error) {
            return false;
          }
        }).length}</p>
        <div className="mt-1">
          <p><strong>First 3 Events:</strong></p>
          <ul>
            {events.slice(0, 3).map((event, index) => (
              <li key={index} className="truncate">
                {event.title} - {new Date(event.date).toLocaleDateString()} - {event.type}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Add a direct check for March 2nd event */}
        <div className="mt-1 p-1 bg-red-100">
          <p><strong>March 2nd Event Check:</strong></p>
          {events.some(event => {
            try {
              const eventDate = parseISO(event.date);
              return eventDate.getDate() === 2 && eventDate.getMonth() === 2 && eventDate.getFullYear() === 2025;
            } catch (error) {
              return false;
            }
          }) ? (
            <p className="text-green-600">✓ Found event for March 2nd</p>
          ) : (
            <p className="text-red-600">✗ No event found for March 2nd</p>
          )}
        </div>
      </div>
      
      {/* Calendar header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={previousMonth}
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
            onClick={goToToday}
          >
            Today
          </button>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>
      
      {/* Calendar grid */}
      {renderCalendar()}
    </div>
  );
};

export default SimpleCalendar; 