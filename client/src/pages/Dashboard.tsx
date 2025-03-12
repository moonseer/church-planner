import { useState, useEffect } from 'react';
import CustomizableDashboard, { Widget, WidgetType } from '../components/dashboard/CustomizableDashboard';
import SimpleCalendar from '../components/dashboard/SimpleCalendar';
import CalendarEventDetails from '../components/dashboard/CalendarEventDetails';
import AnalyticsWidgets from '../components/dashboard/AnalyticsWidgets';
import { parseISO, getMonth, getYear } from 'date-fns';
import { getEvents, seedEvents, formatEventForCalendar } from '../services/eventService';

// Define Event type to match Calendar component's requirements
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'service' | 'rehearsal' | 'meeting' | 'youth';
  status?: 'draft' | 'published' | 'completed';
  description?: string;
  location?: string;
  organizer?: string;
  attendees?: string[];
}

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
  
  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // For demo purposes, we'll use a hardcoded church ID
        // In a real app, you'd get this from user context or auth state
        const churchId = '65ef1234abcd5678ef901234'; // Replace with a real church ID
        
        // Try to fetch events from API
        const response = await getEvents(churchId, 2, 2025); // March 2025
        
        if (response.success && response.data) {
          // Format events for the calendar
          const formattedEvents = response.data.map(formatEventForCalendar);
          console.log('Fetched events:', formattedEvents);
          setEvents(formattedEvents);
        } else {
          console.log('No events found, using mock data');
          // If no events, try to seed the database
          try {
            const seedResponse = await seedEvents(churchId);
            if (seedResponse.success && seedResponse.data) {
              const formattedSeedEvents = seedResponse.data.map(formatEventForCalendar);
              console.log('Seeded events:', formattedSeedEvents);
              setEvents(formattedSeedEvents);
            } else {
              // Fall back to mock data
              setEvents(mockEvents);
            }
          } catch (seedError) {
            console.error('Error seeding events:', seedError);
            // Fall back to mock data
            setEvents(mockEvents);
          }
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Using mock data instead.');
        // Fall back to mock data
        setEvents(mockEvents);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
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
  
  // Effect to log when selectedEvent changes
  useEffect(() => {
    console.log("selectedEvent changed:", selectedEvent);
  }, [selectedEvent]);
  
  // Default widgets configuration
  const defaultWidgets: Widget[] = [
    {
      id: 'calendar',
      type: 'calendar',
      title: 'Calendar',
      size: 'large',
      component: (
        <div>
          {/* Debug output for events */}
          <div className="mb-4 p-2 bg-red-100 text-xs overflow-auto max-h-32 rounded">
            <p className="font-bold">Dashboard Debug Info:</p>
            <p>Events Count: {events.length}</p>
            <p>Events for March 2025: {events.filter(event => {
              try {
                const eventDate = parseISO(event.date);
                return getMonth(eventDate) === 2 && getYear(eventDate) === 2025;
              } catch (error) {
                return false;
              }
            }).length}</p>
            {error && <p className="text-red-600 font-bold">Error: {error}</p>}
            {isLoading && <p className="text-blue-600 font-bold">Loading events...</p>}
            <div>
              <p className="font-bold mt-1">First 3 Events:</p>
              <ul>
                {events.slice(0, 3).map((event, index) => (
                  <li key={index} className="truncate">
                    {event.title} - {new Date(event.date).toLocaleDateString()} - {event.type}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <SimpleCalendar 
            events={events} 
            onEventClick={(event) => {
              console.log("Event clicked in Dashboard:", event);
              setSelectedEvent(event);
            }}
            onDateClick={(date) => console.log('Date clicked:', date)}
          />
        </div>
      ),
      isVisible: true
    },
    {
      id: 'analytics',
      type: 'analytics',
      title: 'Analytics',
      size: 'medium',
      component: <AnalyticsWidgets 
        data={mockAnalyticsData} 
        onTimeRangeChange={(range) => console.log('Time range changed:', range)} 
      />,
      isVisible: true
    },
    {
      id: 'volunteers',
      type: 'volunteers' as WidgetType,
      title: 'Volunteer Status',
      size: 'small',
      component: <VolunteerStats />,
      isVisible: true
    },
    {
      id: 'upcoming',
      type: 'custom' as WidgetType,
      title: 'Upcoming Services',
      size: 'small',
      component: <UpcomingServices onServiceClick={handleServiceClick} />,
      isVisible: true
    },
    {
      id: 'actions',
      type: 'custom' as WidgetType,
      title: 'Quick Actions',
      size: 'medium',
      component: <QuickActions />,
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

  return (
    <div className="container mx-auto px-4 py-8">
      <CustomizableDashboard widgets={widgets} onWidgetsChange={handleWidgetsChange} />
      
      {/* Render the event details popup outside of the widgets */}
      {selectedEvent && (
        <CalendarEventDetails 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          onEdit={(event) => console.log('Edit event:', event)}
          onDelete={(event) => {
            console.log('Delete event:', event);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard; 