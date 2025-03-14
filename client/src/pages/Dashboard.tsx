import { useState, useEffect } from 'react';
import CustomizableDashboard, { Widget, WidgetType } from '../components/dashboard/CustomizableDashboard';
import SimpleCalendar from '../components/dashboard/SimpleCalendar';
import CalendarEventDetails from '../components/dashboard/CalendarEventDetails';
import AnalyticsWidgets from '../components/dashboard/AnalyticsWidgets';
import { parseISO, getMonth, getYear } from 'date-fns';
import { getEvents, seedEvents, formatEventForCalendar, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import EventFormModal from '../components/events/EventFormModal';
import CreateEventButton from '../components/events/CreateEventButton';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Event, FormEvent, ApiEventData, LegacyEventType, EventStatus } from '../types/event';
import { useAuth } from '../hooks/useAuth';

// Mock data for analytics
const mockAnalyticsData = {
  serviceAttendance: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Attendance',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1
    }]
  },
  volunteerParticipation: {
    labels: ['Worship', 'Tech', 'Hospitality', 'Children'],
    data: [28, 48, 40, 19],
    backgroundColor: [
      'rgba(99, 102, 241, 0.7)',
      'rgba(14, 165, 233, 0.7)',
      'rgba(249, 115, 22, 0.7)',
      'rgba(16, 185, 129, 0.7)'
    ],
    borderColor: [
      'rgb(99, 102, 241)',
      'rgb(14, 165, 233)',
      'rgb(249, 115, 22)',
      'rgb(16, 185, 129)'
    ],
    borderWidth: 1
  },
  songUsage: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Song Usage',
      data: [12, 10, 8, 7, 6, 8, 9],
      backgroundColor: 'rgba(249, 115, 22, 0.5)',
      borderColor: 'rgb(249, 115, 22)',
      borderWidth: 1,
      tension: 0.1
    }]
  },
  stats: {
    totalServices: 24,
    totalServicesChange: 4,
    activeVolunteers: 45,
    activeVolunteersChange: -2,
    songsUsed: 32,
    songsUsedChange: 5,
    averageAttendance: 120,
    averageAttendanceChange: 8
  }
};

// Mock events for calendar (fallback if API fails)
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Sunday Service',
    date: new Date(2025, 2, 2, 9, 0).toISOString(), // March 2, 2025
    time: '9:00 AM - 11:00 AM',
    eventTypeId: 'service-type-id', // Default event type ID
    type: 'service',
    status: 'published',
    description: 'Regular Sunday worship service with communion.',
    location: 'Main Sanctuary',
    organizer: 'Pastor Johnson',
    attendees: ['Worship Team', 'Tech Team', 'Hospitality Team']
  },
  {
    id: '2',
    title: 'Worship Practice',
    date: new Date(2025, 2, 4, 18, 0).toISOString(), // March 4, 2025
    time: '6:00 PM - 8:00 PM',
    eventTypeId: 'rehearsal-type-id', // Default event type ID
    type: 'rehearsal',
    status: 'draft',
    description: 'Weekly worship team rehearsal for upcoming Sunday service.',
    location: 'Worship Room',
    organizer: 'Worship Leader',
    attendees: ['Vocalists', 'Band Members', 'Sound Engineer']
  },
  {
    id: '3',
    title: 'Youth Group',
    date: new Date(2025, 2, 7, 19, 0).toISOString(), // March 7, 2025
    time: '7:00 PM - 9:00 PM',
    eventTypeId: 'youth-type-id', // Default event type ID
    type: 'youth',
    status: 'draft',
    description: 'Weekly youth group meeting with games, worship, and Bible study.',
    location: 'Youth Room',
    organizer: 'Youth Pastor',
    attendees: ['Youth Leaders', 'Students']
  },
  {
    id: '4',
    title: 'Leadership Meeting',
    date: new Date(2025, 2, 15, 12, 0).toISOString(), // March 15, 2025
    time: '12:00 PM - 1:30 PM',
    eventTypeId: 'meeting-type-id', // Default event type ID
    type: 'meeting',
    status: 'published',
    description: 'Monthly leadership team meeting to discuss church vision and upcoming events.',
    location: 'Conference Room',
    organizer: 'Senior Pastor',
    attendees: ['Elders', 'Ministry Leaders', 'Staff']
  },
  // Add events for the upcoming services
  {
    id: '5',
    title: 'Sunday Morning Service',
    date: new Date(2025, 2, 9, 9, 0).toISOString(), // March 9, 2025
    time: '9:00 AM - 11:00 AM',
    eventTypeId: 'service-type-id', // Default event type ID
    type: 'service',
    status: 'draft',
    description: 'Regular Sunday morning worship service.',
    location: 'Main Sanctuary',
    organizer: 'Pastor Johnson',
    attendees: ['Team A', 'Tech Team', 'Hospitality Team']
  },
  {
    id: '6',
    title: 'Sunday Morning Service',
    date: new Date(2025, 2, 16, 9, 0).toISOString(), // March 16, 2025
    time: '9:00 AM - 11:00 AM',
    eventTypeId: 'service-type-id', // Default event type ID
    type: 'service',
    status: 'published',
    description: 'Regular Sunday morning worship service.',
    location: 'Main Sanctuary',
    organizer: 'Pastor Johnson',
    attendees: ['Team B', 'Tech Team', 'Hospitality Team']
  },
  {
    id: '7',
    title: 'Sunday Morning Service',
    date: new Date(2025, 2, 23, 9, 0).toISOString(), // March 23, 2025
    time: '9:00 AM - 11:00 AM',
    eventTypeId: 'service-type-id', // Default event type ID
    type: 'service',
    status: 'draft',
    description: 'Regular Sunday morning worship service.',
    location: 'Main Sanctuary',
    organizer: 'Pastor Johnson',
    attendees: ['Team C', 'Tech Team', 'Hospitality Team']
  },
  {
    id: '8',
    title: 'Sunday Morning Service',
    date: new Date(2025, 2, 30, 9, 0).toISOString(), // March 30, 2025
    time: '9:00 AM - 11:00 AM',
    eventTypeId: 'service-type-id', // Default event type ID
    type: 'service',
    status: 'draft',
    description: 'Regular Sunday morning worship service.',
    location: 'Main Sanctuary',
    organizer: 'Pastor Johnson',
    attendees: ['Team D', 'Tech Team', 'Hospitality Team']
  }
];

// Mock data for upcoming services
const mockUpcomingServices = [
  {
    id: '5',
    date: new Date(2025, 2, 9), // March 9, 2025
    title: 'Sunday Morning Service',
    team: 'Team A',
    status: 'Planning'
  },
  {
    id: '6',
    date: new Date(2025, 2, 16), // March 16, 2025
    title: 'Sunday Morning Service',
    team: 'Team B',
    status: 'Confirmed'
  },
  {
    id: '7',
    date: new Date(2025, 2, 23), // March 23, 2025
    title: 'Sunday Morning Service',
    team: 'Team C',
    status: 'Draft'
  },
  {
    id: '8',
    date: new Date(2025, 2, 30), // March 30, 2025
    title: 'Sunday Morning Service',
    team: 'Team D',
    status: 'Draft'
  }
];

// Volunteer stats component
const VolunteerStats = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-neutral-900">Volunteer Status</h3>
      <div className="space-y-2">
        {['Worship', 'Tech', 'Hospitality', 'Children'].map((team) => (
          <div key={team} className="flex justify-between items-center">
            <span className="text-sm text-neutral-600">{team}</span>
            <div className="flex items-center">
              <span className="text-sm font-medium text-neutral-900 mr-2">
                {Math.floor(Math.random() * 10) + 1}/{Math.floor(Math.random() * 5) + 10}
              </span>
              <div className="w-24 bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full" 
                  style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Upcoming services component
const UpcomingServices = ({ onServiceClick }: { onServiceClick: (id: string) => void }) => {
  console.log("UpcomingServices component rendered");
  
  const handleClick = (id: string) => {
    console.log("Service clicked with ID:", id);
    onServiceClick(id);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-neutral-900">Upcoming Services</h3>
      <div className="space-y-2">
        {mockUpcomingServices.map((service) => (
          <div 
            key={service.id} 
            className="p-3 bg-neutral-50 rounded-md border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition-colors"
            onClick={() => handleClick(service.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-900">{service.title}</p>
                <p className="text-xs text-neutral-500">
                  {service.date.toLocaleDateString()} • {service.team}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                service.status === 'Confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : service.status === 'Planning' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {service.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick actions component
const QuickActions = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-neutral-900">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {[
          { title: 'Create Service', icon: '📅' },
          { title: 'Add Song', icon: '🎵' },
          { title: 'Schedule Team', icon: '👥' },
          { title: 'Send Message', icon: '✉️' }
        ].map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center p-4 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
          >
            <span className="text-2xl mb-2">{action.icon}</span>
            <span className="text-sm font-medium text-neutral-900">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  // State for selected event
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  // State for events
  const [events, setEvents] = useState<Event[]>(mockEvents);
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  // State for error
  const [error, setError] = useState<string | null>(null);
  // State for event form modal
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  // State for event being edited
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  // State for form loading
  const [isFormLoading, setIsFormLoading] = useState(false);
  // State for form error
  const [formError, setFormError] = useState<string | undefined>(undefined);
  // State for selected date for new event
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  // State for seeding status
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Get user data from auth hook
  const { userData } = useAuth();
  
  // Use the user's ID as the churchId
  const churchId = userData?.id || '';
  
  // Function to manually seed events
  const handleSeedEvents = async () => {
    try {
      setIsSeeding(true);
      console.log('Manually seeding events for church ID:', churchId);
      
      // Make a direct API call to seed events
      const response = await fetch(`http://localhost:8080/api/events/${churchId}/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      console.log('Seed response:', data);
      
      if (data.success) {
        alert('Events seeded successfully! Refreshing data...');
        // Refresh events
        fetchEvents();
      } else {
        alert(`Failed to seed events: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error seeding events:', error);
      alert('Error seeding events. See console for details.');
    } finally {
      setIsSeeding(false);
    }
  };
  
  // Function to manually seed event types
  const handleSeedEventTypes = async () => {
    try {
      console.log('Manually seeding event types for church ID:', churchId);
      
      // Make a direct API call to seed event types
      const response = await fetch(`http://localhost:8080/api/event-types/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      console.log('Seed event types response:', data);
      
      if (data.success) {
        alert('Event types seeded successfully!');
      } else {
        alert(`Failed to seed event types: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error seeding event types:', error);
      alert('Error seeding event types. See console for details.');
    }
  };
  
  // Fetch events from API
  const fetchEvents = async (month: number = new Date().getMonth(), year: number = new Date().getFullYear()) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Fetching events for month ${month + 1}, year ${year}`);
      
      // Try to fetch events from API
      const response = await getEvents(churchId, month, year);
      
      if (response.success && response.data && response.data.length > 0) {
        // Format events for the calendar
        const formattedEvents = response.data.map(formatEventForCalendar);
        console.log('Fetched events:', formattedEvents);
        console.log('Number of events fetched:', formattedEvents.length);
        
        // Log events by day to help debug
        const eventsByDay = new Map<number, Event[]>();
        formattedEvents.forEach(event => {
          try {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            if (!eventsByDay.has(day)) {
              eventsByDay.set(day, []);
            }
            eventsByDay.get(day)?.push(event);
          } catch (error) {
            console.error('Error parsing event date:', error, event.date);
          }
        });
        
        console.log('Events by day:');
        eventsByDay.forEach((events, day) => {
          console.log(`Day ${day}: ${events.length} events`);
          events.forEach(event => console.log(`  - ${event.title} (${event.time})`));
        });
        
        setEvents(formattedEvents);
      } else {
        console.log('No events found, seeding the database');
        // If no events, seed the database
        try {
          const seedResponse = await seedEvents(churchId);
          if (seedResponse.success && seedResponse.data) {
            const formattedSeedEvents = seedResponse.data.map(formatEventForCalendar);
            console.log('Seeded events:', formattedSeedEvents);
            console.log('Number of seeded events:', formattedSeedEvents.length);
            
            // Filter events for the current month/year
            const filteredEvents = formattedSeedEvents.filter(event => {
              try {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() === month && eventDate.getFullYear() === year;
              } catch (error) {
                console.error('Error filtering event by date:', error, event.date);
                return false;
              }
            });
            
            console.log('Filtered events for current month/year:', filteredEvents.length);
            
            setEvents(filteredEvents);
          } else {
            console.error('Failed to seed events');
            setError('Failed to load events. Please try again later.');
            setEvents([]);
          }
        } catch (seedError) {
          console.error('Error seeding events:', seedError);
          setError('Failed to load events. Please try again later.');
          setEvents([]);
        }
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch of events
  useEffect(() => {
    // Use current month and year instead of hardcoded values
    const currentDate = new Date();
    fetchEvents(currentDate.getMonth(), currentDate.getFullYear());
  }, []);
  
  // Function to find an event by ID
  const findEventById = (id: string) => {
    console.log("Finding event with ID:", id);
    const event = events.find(event => event.id === id);
    console.log("Found event:", event);
    return event || null;
  };
  
  // Handle service click from Upcoming Services
  const handleServiceClick = (id: string) => {
    console.log("handleServiceClick called with ID:", id);
    const event = findEventById(id);
    if (event) {
      console.log("Setting selected event:", event);
      setSelectedEvent(event);
    } else {
      console.log("No event found with ID:", id);
    }
  };
  
  // Add a useEffect to log when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      console.log('selectedEvent changed to:', selectedEvent);
    } else {
      console.log('selectedEvent is null');
    }
  }, [selectedEvent]);
  
  // Handle opening the event form for creating a new event
  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setSelectedDate(undefined);
    setFormError(undefined);
    setIsEventFormOpen(true);
  };
  
  // Handle opening the event form for creating a new event on a specific date
  const handleCreateEventForDate = (date: Date) => {
    setEditingEvent(undefined);
    setSelectedDate(date);
    setFormError(undefined);
    setIsEventFormOpen(true);
  };
  
  // Handle opening the event form for editing an existing event
  const handleEditEvent = (event?: Event) => {
    if (!event) return;
    
    setEditingEvent(event);
    setSelectedDate(undefined);
    setFormError(undefined);
    setIsEventFormOpen(true);
    setSelectedEvent(null);
  };
  
  // Handle event form submission
  const handleEventSubmit = async (eventData: FormEvent) => {
    setIsFormLoading(true);
    setFormError(undefined);
    
    try {
      // Convert to API format
      const apiEventData: ApiEventData = {
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        eventTypeId: eventData.eventTypeId,
        type: eventData.type,
        status: eventData.status || 'draft', // Default to draft if status is undefined
        description: eventData.description,
        location: eventData.location,
        organizer: eventData.organizer,
        attendees: eventData.attendees
      };
      
      console.log('Event data before submission:', apiEventData);
      
      if (eventData.id) {
        // Update existing event
        const response = await updateEvent(eventData.id, apiEventData);
        if (response.success && response.data) {
          // Update events list with type assertion
          setEvents(prevEvents => 
            prevEvents.map(event => 
              event.id === eventData.id ? formatEventForCalendar(response.data as Event) : event
            )
          );
          setIsEventFormOpen(false);
          
          // Refresh events to ensure we have the latest data
          const eventDate = new Date(eventData.date);
          fetchEvents(eventDate.getMonth(), eventDate.getFullYear());
        } else {
          setFormError(response.message || 'Failed to update event');
        }
      } else {
        // Create new event using direct fetch call
        console.log('Creating new event with data:', apiEventData);
        
        try {
          // Convert eventTypeId to a proper MongoDB ObjectId format if it's not already
          // This is a workaround for the "Cast to Object[] failed" error
          const formattedData = {
            ...apiEventData,
            // The server expects eventTypeId to be a valid MongoDB ObjectId
            // We're not actually creating an ObjectId here, just ensuring the string is in the correct format
            eventTypeId: apiEventData.eventTypeId
          };
          
          console.log('Formatted data for submission:', formattedData);
          
          const response = await fetch(`http://localhost:8080/api/events/${churchId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formattedData)
          });
          
          const data = await response.json();
          console.log('Create event response:', data);
          
          if (data.success && data.data) {
            // Add new event to list with type assertion
            setEvents(prevEvents => [...prevEvents, formatEventForCalendar(data.data as Event)]);
            setIsEventFormOpen(false);
            
            // Refresh events to ensure we have the latest data
            const eventDate = new Date(eventData.date);
            fetchEvents(eventDate.getMonth(), eventDate.getFullYear());
          } else {
            setFormError(data.message || 'Failed to create event');
          }
        } catch (fetchError) {
          console.error('Error creating event with fetch:', fetchError);
          setFormError('An error occurred while saving the event');
        }
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      setFormError('An error occurred while saving the event');
    } finally {
      setIsFormLoading(false);
    }
  };
  
  // Handle event deletion
  const handleDeleteEvent = async (event?: Event) => {
    if (!event || !event.id) return;
    
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        const response = await deleteEvent(event.id);
        if (response.success) {
          // Remove event from list
          setEvents(prevEvents => prevEvents.filter(e => e.id !== event.id));
          setSelectedEvent(null);
        } else {
          alert(response.message || 'Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('An error occurred while deleting the event');
      }
    }
  };
  
  // Default widgets configuration
  const defaultWidgets: Widget[] = [
    {
      id: 'calendar',
      type: 'calendar',
      title: 'Calendar',
      size: 'full',
      component: () => (
        <SimpleCalendar 
          events={events} 
          onEventClick={(event) => {
            console.log("Event clicked in Dashboard:", event);
            setSelectedEvent(event);
          }}
          onDateClick={(date) => console.log('Date clicked:', date)}
          onCreateEvent={handleCreateEvent}
          onCreateEventForDate={handleCreateEventForDate}
          onMonthChange={(month, year) => {
            console.log(`Month changed to ${month + 1}/${year}`);
            fetchEvents(month, year);
          }}
        />
      ),
      isVisible: true
    },
    {
      id: 'analytics',
      type: 'analytics',
      title: 'Analytics',
      size: 'medium',
      component: () => (
        <AnalyticsWidgets 
          data={mockAnalyticsData} 
          onTimeRangeChange={(range) => console.log('Time range changed:', range)} 
        />
      ),
      isVisible: true
    },
    {
      id: 'volunteers',
      type: 'volunteers' as WidgetType,
      title: 'Volunteer Status',
      size: 'small',
      component: () => <VolunteerStats />,
      isVisible: true
    },
    {
      id: 'upcoming',
      type: 'custom' as WidgetType,
      title: 'Upcoming Services',
      size: 'small',
      component: () => <UpcomingServices onServiceClick={handleServiceClick} />,
      isVisible: true
    },
    {
      id: 'actions',
      type: 'custom' as WidgetType,
      title: 'Quick Actions',
      size: 'medium',
      component: () => <QuickActions />,
      isVisible: true
    }
  ];

  // State for widgets
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);

  // Load saved widget configuration from localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      try {
        const parsedWidgets = JSON.parse(savedWidgets);
        // Reattach component references since they can't be serialized
        const hydratedWidgets = parsedWidgets.map((widget: Widget) => {
          const defaultWidget = defaultWidgets.find(w => w.id === widget.id);
          return {
            ...widget,
            component: defaultWidget ? defaultWidget.component : null
          };
        });
        setWidgets(hydratedWidgets);
      } catch (error) {
        console.error('Failed to parse saved widgets:', error);
      }
    }
  }, []);

  // Save widget configuration to localStorage
  const handleWidgetsChange = (newWidgets: Widget[]) => {
    setWidgets(newWidgets);
    // Save to localStorage without the component property
    const widgetsForStorage = newWidgets.map(({ component, ...rest }) => rest);
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgetsForStorage));
  };

  // Create type-safe wrapper functions for the event handlers
  const handleEditEventWrapper = (event: Event) => {
    handleEditEvent(event);
  };
  
  const handleDeleteEventWrapper = (event: Event) => {
    handleDeleteEvent(event);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-screen-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleSeedEventTypes}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Seed Event Types
          </button>
          <button
            onClick={handleSeedEvents}
            disabled={isSeeding}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSeeding ? 'Seeding...' : 'Seed Events'}
          </button>
          <CreateEventButton onClick={() => {
            setEditingEvent(undefined);
            setSelectedDate(new Date());
            setIsEventFormOpen(true);
          }} />
        </div>
      </div>
      
      <CustomizableDashboard widgets={widgets} onWidgetsChange={handleWidgetsChange} />
      
      {/* Render the event details popup outside of the widgets */}
      {selectedEvent && (
        <CalendarEventDetails 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEditEventWrapper}
          onDelete={handleDeleteEventWrapper}
        />
      )}
      
      {/* Event form modal */}
      <EventFormModal
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        event={editingEvent}
        onSubmit={handleEventSubmit}
        isLoading={isFormLoading}
        error={formError}
        initialDate={selectedDate}
      />
    </div>
  );
};

export default Dashboard; 