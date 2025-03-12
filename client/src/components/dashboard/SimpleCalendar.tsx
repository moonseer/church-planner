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
  isToday,
  getDay,
  getMonth,
  getYear
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Event, EventType } from '../../types/event';
import { getEventClass, getEventBgColor, getEventTextColor, getEventTypeName } from '../../utils/eventColors';

// Props for the Calendar component
interface SimpleCalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
  onCreateEvent?: () => void;
  onCreateEventForDate?: (date: Date) => void;
  onMonthChange?: (month: number, year: number) => void;
}

const SimpleCalendar: React.FC<SimpleCalendarProps> = ({ 
  events = [], 
  onEventClick = () => {}, 
  onDateClick = () => {},
  onCreateEvent = () => {},
  onCreateEventForDate = () => {},
  onMonthChange = () => {}
}) => {
  // State for current date - default to current month
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State for event type filters
  const [activeFilters, setActiveFilters] = useState<EventType[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // All available event types
  const eventTypes: EventType[] = ['service', 'rehearsal', 'meeting', 'youth'];
  
  // Navigation functions
  const previousMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    // Notify parent component about month change
    onMonthChange(getMonth(newDate), getYear(newDate));
  };
  
  const nextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    // Notify parent component about month change
    onMonthChange(getMonth(newDate), getYear(newDate));
  };
  
  const goToToday = () => {
    const newDate = new Date();
    setCurrentDate(newDate);
    // Notify parent component about month change
    onMonthChange(getMonth(newDate), getYear(newDate));
  };
  
  // Toggle filter for an event type
  const toggleFilter = (type: EventType) => {
    setActiveFilters(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
  };
  
  // Get days for the current month
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };
  
  // Get events for a specific day, applying filters if active
  const getEventsForDay = (day: Date): Event[] => {
    let filteredEvents = events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, day);
      } catch (error) {
        console.error('Error parsing date:', error, event.date);
        return false;
      }
    });
    
    // Apply type filters if any are active
    if (activeFilters.length > 0) {
      filteredEvents = filteredEvents.filter(event => activeFilters.includes(event.type));
    }
    
    return filteredEvents;
  };
  
  // Handle day click
  const handleDayClick = (day: Date) => {
    // Call both onDateClick and onCreateEventForDate
    onDateClick(day);
    onCreateEventForDate(day);
  };
  
  // Render calendar
  const renderCalendar = () => {
    const days = getDaysInMonth();
    const firstDayOfMonth = startOfMonth(currentDate);
    const dayOfWeek = getDay(firstDayOfMonth); // 0 for Sunday, 1 for Monday, etc.
    
    // Create blank days to fill in the beginning of the month
    const blankDays = Array(dayOfWeek).fill(null);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers - hide on small screens */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1 sm:py-2">
            {day.substring(0, 1)}
            <span className="hidden sm:inline">{day.substring(1)}</span>
          </div>
        ))}
        
        {/* Blank days */}
        {blankDays.map((_, index) => (
          <div key={`blank-${index}`} className="h-16 sm:h-24 md:h-28 bg-gray-50 border border-gray-100"></div>
        ))}
        
        {/* Calendar days */}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          
          return (
            <div 
              key={day.toString()} 
              className={`
                h-16 sm:h-24 md:h-28 border p-1 overflow-hidden relative
                ${isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'} 
                ${isTodayDate ? 'bg-blue-50 border-blue-300' : ''}
                hover:bg-gray-50 cursor-pointer group
              `}
              onClick={() => handleDayClick(day)}
            >
              <div className={`
                text-right p-1 font-medium text-xs sm:text-sm
                ${isTodayDate ? 'text-blue-600' : 'text-gray-700'}
              `}>
                {format(day, 'd')}
                
                {/* Add event button that appears on hover */}
                <button 
                  className="hidden group-hover:flex absolute top-1 left-1 items-center justify-center w-5 h-5 bg-primary-500 text-white rounded-full opacity-80 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateEventForDate(day);
                  }}
                  title="Add event"
                >
                  <PlusIcon className="w-3 h-3" />
                </button>
              </div>
              
              {/* Events for this day */}
              <div className="space-y-1 overflow-y-auto max-h-10 sm:max-h-16 md:max-h-20">
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
                      console.log('Event clicked in SimpleCalendar:', event);
                      onEventClick(event);
                    }}
                    title={`${event.title} - ${event.time} - Click for details`}
                  >
                    <span className="hidden sm:inline">{event.time.split(' ')[0]}</span> {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-2 sm:p-4">
      {/* Calendar header with navigation, create button, and filters */}
      <div className="flex flex-wrap justify-between items-center mb-2 sm:mb-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            onClick={previousMonth}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button 
            onClick={nextMonth}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2 mt-2 sm:mt-0">
          <button 
            onClick={goToToday}
            className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Today
          </button>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium border rounded-md flex items-center ${
              activeFilters.length > 0 
                ? 'text-primary-700 bg-primary-50 border-primary-300' 
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            }`}
            aria-expanded={showFilters}
            aria-controls="filter-menu"
          >
            <FunnelIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span>
              {activeFilters.length > 0 ? `Filtered (${activeFilters.length})` : 'Filter'}
            </span>
          </button>
          
          <button 
            onClick={onCreateEvent}
            className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-white bg-primary-600 border border-primary-600 rounded-md hover:bg-primary-700 flex items-center"
          >
            <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden xs:inline">Create Event</span>
            <span className="xs:hidden">New</span>
          </button>
        </div>
      </div>
      
      {/* Filter menu */}
      {showFilters && (
        <div id="filter-menu" className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Filter by event type</h3>
            {activeFilters.length > 0 && (
              <button 
                onClick={clearFilters}
                className="text-xs text-primary-600 hover:text-primary-800"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map(type => (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`px-2 py-1 text-xs rounded-full border ${
                  activeFilters.includes(type)
                    ? getEventClass(type)
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {getEventTypeName(type)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Calendar grid */}
      {renderCalendar()}
    </div>
  );
};

export default SimpleCalendar; 