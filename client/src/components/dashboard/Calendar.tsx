import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addWeeks, subWeeks, startOfWeek, endOfWeek, addDays, subDays, isToday, getDay, getMonth, getYear, Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Types for events
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'service' | 'rehearsal' | 'meeting' | 'youth';
  status?: 'draft' | 'published' | 'completed';
}

// Props for the Calendar component
interface CalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
  locale?: Locale;
  initialView?: CalendarView;
}

// View type for the calendar
type CalendarView = 'month' | 'week' | 'day';

const Calendar = ({ 
  events = [], 
  onEventClick = () => {}, 
  onDateClick = () => {}, 
  locale = enUS,
  initialView = 'month'
}: CalendarProps) => {
  // Immediately log the events received as props
  console.log('Calendar component received events:', events);
  
  // State for the current date and view
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1));
  const [view, setView] = useState<CalendarView>(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedDay, setFocusedDay] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Effect to announce view changes to screen readers
  useEffect(() => {
    const announceElement = document.getElementById('calendar-announce');
    if (announceElement) {
      announceElement.textContent = `Calendar view changed to ${view} view. Showing ${getViewTitle()}.`;
    }
  }, [view, currentDate]);

  // Effect to log events when component mounts
  useEffect(() => {
    console.log('Calendar component mounted with events:', events);
    console.log('Current date:', format(currentDate, 'yyyy-MM-dd'));
    
    // Check if any events match the current month
    const eventsInCurrentMonth = events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return getMonth(eventDate) === getMonth(currentDate) && 
               getYear(eventDate) === getYear(currentDate);
      } catch (error) {
        console.error('Error parsing date:', error, event.date);
        return false;
      }
    });
    
    console.log('Events in current month:', eventsInCurrentMonth);
    
    // Force a re-render after a short delay
    const timer = setTimeout(() => {
      console.log('Forcing re-render...');
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 100);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [events, currentDate]);

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
    console.log(`Checking events for day: ${format(day, 'yyyy-MM-dd')}`);
    console.log('All events:', events);
    
    const dayEvents = events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        console.log(`Comparing event date ${format(eventDate, 'yyyy-MM-dd')} with day ${format(day, 'yyyy-MM-dd')}`);
        const isSame = isSameDay(eventDate, day);
        if (isSame) {
          console.log(`✅ Found event for ${format(day, 'yyyy-MM-dd')}:`, event.title);
        }
        return isSame;
      } catch (error) {
        console.error('Error parsing date:', error, event.date);
        return false;
      }
    });
    
    if (dayEvents.length > 0) {
      console.log(`Total events for ${format(day, 'yyyy-MM-dd')}:`, dayEvents.length);
    }
    
    return dayEvents;
  };

  // Navigation functions with loading states and animations
  const previous = () => {
    setIsLoading(true);
    setTimeout(() => {
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
      setIsLoading(false);
    }, 150);
  };

  const next = () => {
    setIsLoading(true);
    setTimeout(() => {
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
      setIsLoading(false);
    }, 150);
  };

  const today = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentDate(new Date());
      setIsLoading(false);
    }, 150);
  };

  // Get the title for the current view
  const getViewTitle = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale });
      case 'week':
        const start = startOfWeek(currentDate, { weekStartsOn: 0 });
        const end = endOfWeek(currentDate, { weekStartsOn: 0 });
        return `${format(start, 'MMM d', { locale })} - ${format(end, 'MMM d, yyyy', { locale })}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy', { locale });
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
      case 'youth':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, day?: Date) => {
    if (!day && !focusedDay) return;
    
    const currentFocusDay = day || focusedDay;
    if (!currentFocusDay) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedDay(subDays(currentFocusDay, 1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setFocusedDay(addDays(currentFocusDay, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedDay(subDays(currentFocusDay, 7));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedDay(addDays(currentFocusDay, 7));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onDateClick(currentFocusDay);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedDay(startOfWeek(currentFocusDay, { weekStartsOn: 0 }));
        break;
      case 'End':
        e.preventDefault();
        setFocusedDay(endOfWeek(currentFocusDay, { weekStartsOn: 0 }));
        break;
      case 'PageUp':
        e.preventDefault();
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'PageDown':
        e.preventDefault();
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  // Render the month view
  const renderMonthView = () => {
    const days = getDays();
    const firstDayOfMonth = startOfMonth(currentDate);
    const dayOfWeek = getDay(firstDayOfMonth);
    
    // Create an array of blank days to fill in the beginning of the month
    const blankDays = Array(dayOfWeek).fill(null);
    
    // Get days from previous month to fill in the beginning
    const prevMonthDays = dayOfWeek > 0 
      ? eachDayOfInterval({
          start: subDays(firstDayOfMonth, dayOfWeek),
          end: subDays(firstDayOfMonth, 1)
        })
      : [];
    
    // Get days from next month to fill in the end
    const daysInGrid = blankDays.length + days.length;
    const nextMonthDays = daysInGrid < 42 
      ? eachDayOfInterval({
          start: addDays(endOfMonth(currentDate), 1),
          end: addDays(endOfMonth(currentDate), 42 - daysInGrid)
        })
      : [];
    
    // All days to display in the grid
    const allDays = [...prevMonthDays, ...days, ...nextMonthDays];
    
    return (
      <div 
        className="grid grid-cols-7 gap-1"
        role="grid"
        aria-label={`Calendar for ${format(currentDate, 'MMMM yyyy', { locale })}`}
      >
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div 
            key={day} 
            className="text-center text-sm font-medium text-neutral-500 py-2"
            role="columnheader"
            aria-label={day}
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {allDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          const isFocused = focusedDay ? isSameDay(day, focusedDay) : false;
          
          return (
            <div 
              key={day.toString()} 
              className={`
                h-24 border transition-all duration-150
                ${isCurrentMonth ? 'border-neutral-200' : 'border-neutral-100'} 
                ${isTodayDate ? 'bg-primary-50 border-primary-300' : isCurrentMonth ? 'bg-white' : 'bg-neutral-50'} 
                ${isFocused ? 'ring-2 ring-primary-500 z-10' : ''}
                ${isCurrentMonth ? 'hover:bg-neutral-50' : 'hover:bg-neutral-100'}
                overflow-hidden relative
              `}
              onClick={() => {
                onDateClick(day);
                setFocusedDay(day);
              }}
              onKeyDown={(e) => handleKeyDown(e, day)}
              tabIndex={isFocused || (isTodayDate && !focusedDay) ? 0 : -1}
              role="gridcell"
              aria-label={`${format(day, 'EEEE, MMMM d, yyyy', { locale })}${dayEvents.length > 0 ? `. ${dayEvents.length} events.` : ''}`}
              aria-selected={isFocused}
              aria-current={isTodayDate ? 'date' : undefined}
              data-date={format(day, 'yyyy-MM-dd')}
              ref={isFocused ? (el) => el?.focus() : undefined}
            >
              <div className={`
                text-right p-1 font-medium
                ${isTodayDate ? 'text-primary-600' : isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'}
              `}>
                {format(day, 'd', { locale })}
              </div>
              <div className="px-1 space-y-1 overflow-y-auto max-h-16">
                {/* Direct test event for March 2, 2025 */}
                {isSameDay(day, new Date(2025, 2, 2)) && (
                  <div 
                    className="text-xs p-1 rounded border truncate cursor-pointer bg-primary-100 text-primary-800 border-primary-300 font-bold border-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Test event clicked");
                      onEventClick({
                        id: 'test',
                        title: 'Test Event',
                        date: new Date(2025, 2, 2, 9, 0).toISOString(),
                        time: '9:00 AM - 11:00 AM',
                        type: 'service',
                        status: 'published'
                      });
                    }}
                  >
                    9:00 AM Test Event
                  </div>
                )}
                
                {/* Regular events */}
                {dayEvents.slice(0, 3).map((event) => (
                  <div 
                    key={event.id} 
                    className={`
                      text-xs p-1 rounded border truncate cursor-pointer
                      ${getEventClass(event.type)}
                      hover:brightness-95 transition-all
                      font-bold border-2
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Event clicked:", event);
                      onEventClick(event);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${event.title} at ${event.time}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onEventClick(event);
                      }
                    }}
                  >
                    {event.time} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div 
                    className="text-xs text-neutral-500 pl-1 hover:text-neutral-700 cursor-pointer font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Show more events
                      onDateClick(day);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${dayEvents.length - 3} more events`}
                  >
                    +{dayEvents.length - 3} more
                  </div>
                )}
                {dayEvents.length === 0 && day.getDate() === 2 && (
                  <div className="text-xs text-red-500 font-bold">
                    Sunday Service should be here!
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
      <div 
        className="flex flex-col"
        role="grid"
        aria-label={`Week view for ${format(days[0], 'MMMM d', { locale })} - ${format(days[days.length - 1], 'MMMM d, yyyy', { locale })}`}
      >
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b border-neutral-200" role="row">
          <div className="py-2 text-center text-sm font-medium text-neutral-500" role="columnheader">Time</div>
          {days.map((day) => (
            <div 
              key={day.toString()} 
              className={`
                py-2 text-center text-sm font-medium 
                ${isToday(day) ? 'text-primary-600 font-bold' : 'text-neutral-500'}
                ${isToday(day) ? 'bg-primary-50' : ''}
              `}
              role="columnheader"
              aria-label={format(day, 'EEEE, MMMM d', { locale })}
              aria-current={isToday(day) ? 'date' : undefined}
            >
              {format(day, 'EEE', { locale })}<br />
              {format(day, 'MMM d', { locale })}
            </div>
          ))}
        </div>
        
        {/* Time slots */}
        {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'].map((time) => (
          <div key={time} className="grid grid-cols-8 border-b border-neutral-200 min-h-16" role="row">
            <div 
              className="py-2 text-xs text-neutral-500 border-r border-neutral-200 text-center"
              role="rowheader"
              aria-label={time}
            >
              {time}
            </div>
            {days.map((day) => {
              const dayEvents = getEventsForDay(day).filter(event => event.time.includes(time.split(' ')[0]));
              const isTodayDate = isToday(day);
              
              return (
                <div 
                  key={day.toString()} 
                  className={`
                    p-1 relative
                    ${isTodayDate ? 'bg-primary-50' : 'hover:bg-neutral-50'}
                    transition-colors duration-150
                  `}
                  onClick={() => onDateClick(day)}
                  role="gridcell"
                  aria-label={`${format(day, 'EEEE, MMMM d', { locale })} at ${time}`}
                  aria-current={isTodayDate ? 'date' : undefined}
                  tabIndex={dayEvents.length > 0 ? 0 : -1}
                >
                  {dayEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`
                        text-xs p-1 rounded border truncate cursor-pointer
                        ${getEventClass(event.type)}
                        hover:brightness-95 transition-all
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${event.title} at ${event.time}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onEventClick(event);
                        }
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
      <div 
        className="flex flex-col"
        role="grid"
        aria-label={`Day view for ${format(currentDate, 'EEEE, MMMM d, yyyy', { locale })}`}
      >
        {/* Time slots */}
        {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'].map((time) => {
          const timeEvents = dayEvents.filter(event => event.time.includes(time.split(' ')[0]));
          
          return (
            <div 
              key={time} 
              className="flex border-b border-neutral-200 min-h-16 hover:bg-neutral-50 transition-colors duration-150"
              role="row"
            >
              <div 
                className="w-20 py-2 text-sm text-neutral-500 border-r border-neutral-200 text-center"
                role="rowheader"
                aria-label={time}
              >
                {time}
              </div>
              <div 
                className="flex-1 p-1"
                role="gridcell"
                aria-label={`${format(currentDate, 'EEEE, MMMM d', { locale })} at ${time}`}
                tabIndex={timeEvents.length > 0 ? 0 : -1}
              >
                {timeEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className={`
                      p-2 mb-1 rounded border cursor-pointer
                      ${getEventClass(event.type)}
                      hover:brightness-95 transition-all
                    `}
                    onClick={() => onEventClick(event)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${event.title} at ${event.time}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onEventClick(event);
                      }
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm">{event.time}</div>
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
    <div 
      className="bg-white rounded-lg shadow-sm p-4"
      ref={calendarRef}
      onKeyDown={handleKeyDown}
    >
      {/* Screen reader announcements */}
      <div 
        id="calendar-announce" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>
      
      {/* Calendar header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            onClick={previous}
            aria-label="Previous"
            disabled={isLoading}
          >
            <ChevronLeftIcon className="h-5 w-5 text-neutral-600" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            onClick={next}
            aria-label="Next"
            disabled={isLoading}
          >
            <ChevronRightIcon className="h-5 w-5 text-neutral-600" />
          </button>
          <button
            className="px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            onClick={today}
            aria-label="Today"
            disabled={isLoading}
          >
            Today
          </button>
        </div>
        
        <h2 className="text-lg font-semibold text-neutral-900">
          {getViewTitle()}
        </h2>
        
        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${view === 'month' ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'}`}
            onClick={() => setView('month')}
            aria-label="Month view"
            aria-pressed={view === 'month'}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${view === 'week' ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'}`}
            onClick={() => setView('week')}
            aria-label="Week view"
            aria-pressed={view === 'week'}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${view === 'day' ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'}`}
            onClick={() => setView('day')}
            aria-label="Day view"
            aria-pressed={view === 'day'}
          >
            Day
          </button>
        </div>
      </div>
      
      {/* Debug output */}
      <div className="mb-4 p-2 bg-gray-100 text-xs overflow-auto max-h-32 rounded">
        <p className="font-bold">Debug Info:</p>
        <p>Current Date: {format(currentDate, 'yyyy-MM-dd')}</p>
        <p>Events Count: {events.length}</p>
        <p>Events in Current Month: {events.filter(event => {
          try {
            const eventDate = parseISO(event.date);
            return getMonth(eventDate) === getMonth(currentDate) && 
                  getYear(eventDate) === getYear(currentDate);
          } catch (error) {
            return false;
          }
        }).length}</p>
        <div>
          <p className="font-bold mt-1">Events:</p>
          <ul>
            {events.map((event, index) => (
              <li key={index} className="truncate">
                {event.title} - {event.date} - {event.type}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Calendar content with loading state */}
      <div className={`relative transition-opacity duration-150 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
        {renderView()}
      </div>
    </div>
  );
};

export default Calendar; 