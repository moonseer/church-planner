import { useState, useEffect } from 'react';
import CustomizableDashboard, { Widget } from '../components/dashboard/CustomizableDashboard';
import Calendar from '../components/dashboard/Calendar';
import AnalyticsWidgets from '../components/dashboard/AnalyticsWidgets';

// Mock data for analytics
const mockAnalyticsData = {
  attendance: [65, 59, 80, 81, 56, 55, 40],
  volunteers: [28, 48, 40, 19, 86, 27, 90],
  songs: [
    { name: 'Amazing Grace', count: 12 },
    { name: 'How Great Is Our God', count: 10 },
    { name: 'Good Good Father', count: 8 },
    { name: 'What A Beautiful Name', count: 7 },
    { name: 'Cornerstone', count: 6 }
  ],
  timeLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
};

// Mock events for calendar
const mockEvents = [
  {
    id: '1',
    title: 'Sunday Service',
    start: new Date(2023, 5, 4, 9, 0),
    end: new Date(2023, 5, 4, 11, 0),
    type: 'service'
  },
  {
    id: '2',
    title: 'Worship Practice',
    start: new Date(2023, 5, 2, 18, 0),
    end: new Date(2023, 5, 2, 20, 0),
    type: 'rehearsal'
  },
  {
    id: '3',
    title: 'Youth Group',
    start: new Date(2023, 5, 7, 19, 0),
    end: new Date(2023, 5, 7, 21, 0),
    type: 'youth'
  }
];

// Mock data for upcoming services
const mockUpcomingServices = [
  {
    id: '1',
    date: new Date(2023, 5, 11),
    title: 'Sunday Morning Service',
    team: 'Team A',
    status: 'Planning'
  },
  {
    id: '2',
    date: new Date(2023, 5, 18),
    title: 'Sunday Morning Service',
    team: 'Team B',
    status: 'Confirmed'
  },
  {
    id: '3',
    date: new Date(2023, 5, 25),
    title: 'Sunday Morning Service',
    team: 'Team C',
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
const UpcomingServices = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-neutral-900">Upcoming Services</h3>
      <div className="space-y-2">
        {mockUpcomingServices.map((service) => (
          <div key={service.id} className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
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
  // Default widgets configuration
  const defaultWidgets: Widget[] = [
    {
      id: 'calendar',
      type: 'calendar',
      title: 'Calendar',
      size: 'large',
      component: <Calendar events={mockEvents} />,
      isVisible: true
    },
    {
      id: 'analytics',
      type: 'analytics',
      title: 'Analytics',
      size: 'medium',
      component: <AnalyticsWidgets data={mockAnalyticsData} />,
      isVisible: true
    },
    {
      id: 'volunteers',
      type: 'volunteers',
      title: 'Volunteer Status',
      size: 'small',
      component: <VolunteerStats />,
      isVisible: true
    },
    {
      id: 'upcoming',
      type: 'upcoming',
      title: 'Upcoming Services',
      size: 'small',
      component: <UpcomingServices />,
      isVisible: true
    },
    {
      id: 'actions',
      type: 'actions',
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
    </div>
  );
};

export default Dashboard; 