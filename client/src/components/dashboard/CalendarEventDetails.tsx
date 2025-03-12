import { XMarkIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

// Types for events
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

interface CalendarEventDetailsProps {
  event: Event;
  onClose: () => void;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

const CalendarEventDetails = ({ event, onClose, onEdit, onDelete }: CalendarEventDetailsProps) => {
  // Get the event type color class
  const getEventTypeClass = (type: Event['type']) => {
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

  // Get the status badge class
  const getStatusBadgeClass = (status?: Event['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  // Format the date
  const formattedDate = () => {
    try {
      return format(parseISO(event.date), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      console.error('Error parsing date:', error);
      return event.date;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="event-title">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-200">
          <h2 id="event-title" className="text-xl font-semibold text-neutral-900">{event.title}</h2>
          <button 
            className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6 text-neutral-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Type and Status */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 text-sm rounded-full ${getEventTypeClass(event.type)}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
            {event.status && (
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeClass(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            )}
          </div>
          
          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-neutral-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-neutral-700">{formattedDate()}</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-neutral-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-neutral-700">{event.time}</span>
            </div>
          </div>
          
          {/* Location */}
          {event.location && (
            <div className="flex items-start">
              <svg className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-neutral-700">{event.location}</span>
            </div>
          )}
          
          {/* Organizer */}
          {event.organizer && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-neutral-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-neutral-700">{event.organizer}</span>
            </div>
          )}
          
          {/* Description */}
          {event.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Description</h3>
              <p className="text-neutral-700 whitespace-pre-line">{event.description}</p>
            </div>
          )}
          
          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Attendees</h3>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((attendee, index) => (
                  <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-sm">
                    {attendee}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 flex justify-end space-x-2">
          {onDelete && (
            <button 
              className="px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded transition-colors"
              onClick={() => onDelete(event)}
              aria-label="Delete event"
            >
              Delete
            </button>
          )}
          {onEdit && (
            <button 
              className="px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50 rounded transition-colors"
              onClick={() => onEdit(event)}
              aria-label="Edit event"
            >
              Edit
            </button>
          )}
          <button 
            className="px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded transition-colors"
            onClick={onClose}
            aria-label="Close details"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarEventDetails; 