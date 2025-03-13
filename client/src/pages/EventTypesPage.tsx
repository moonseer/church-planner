import React from 'react';
import EventTypeManager from '../components/admin/EventTypeManager';

const EventTypesPage: React.FC = () => {
  // Set document title programmatically instead of using Helmet
  React.useEffect(() => {
    document.title = 'Event Types | Church Planner';
    return () => {
      // Reset title when component unmounts (optional)
      document.title = 'Church Planner';
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Types</h1>
        <p className="text-gray-600 mt-2">
          Manage custom event types for your church calendar. Create, edit, and delete event types to better organize your events.
        </p>
      </div>
      
      <EventTypeManager />
      
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">About Event Types</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700">What are event types?</h3>
            <p className="text-gray-600 mt-1">
              Event types help you categorize and visually distinguish different kinds of events in your church calendar.
              Each event type has a unique color and can be filtered in the calendar view.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700">Default event types</h3>
            <p className="text-gray-600 mt-1">
              The system comes with four default event types: Service, Rehearsal, Meeting, and Youth.
              These default types cannot be deleted, but you can customize their names and colors.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700">Custom event types</h3>
            <p className="text-gray-600 mt-1">
              You can create custom event types for specific ministries or activities in your church,
              such as "Bible Study", "Outreach", "Children's Ministry", or "Worship Team".
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700">Tips for creating event types</h3>
            <ul className="list-disc list-inside text-gray-600 mt-1">
              <li>Use clear, descriptive names that everyone in your team will understand</li>
              <li>Choose distinct colors that are easy to differentiate in the calendar</li>
              <li>Consider accessibility when selecting colors (high contrast is better)</li>
              <li>Don't create too many event types, as it can make the calendar confusing</li>
              <li>Group similar activities under the same event type for simplicity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTypesPage; 