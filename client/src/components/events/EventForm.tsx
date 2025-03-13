import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { Event, FormEvent, LegacyEventType, EventStatus, EventTypeDefinition } from '../../types/event';
import { getEventTypes, seedDefaultEventTypes } from '../../services/eventTypeService';
import { getEventClass } from '../../utils/eventColors';

interface EventFormProps {
  event?: Event;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
  initialDate?: Date;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  initialDate
}) => {
  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [eventTypeId, setEventTypeId] = useState('');
  const [status, setStatus] = useState<EventStatus>('draft');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [attendeesText, setAttendeesText] = useState('');
  
  // Event types state
  const [eventTypes, setEventTypes] = useState<EventTypeDefinition[]>([]);
  const [loadingEventTypes, setLoadingEventTypes] = useState(false);
  const [eventTypesError, setEventTypesError] = useState<string | null>(null);

  // Fetch event types on component mount
  useEffect(() => {
    const fetchEventTypes = async () => {
      console.log('Starting fetchEventTypes in EventForm');
      try {
        setLoadingEventTypes(true);
        setEventTypesError(null);
        console.log('Calling getEventTypes service function');
        const data = await getEventTypes();
        console.log('getEventTypes returned data:', data);
        setEventTypes(data);
        
        // If no event type is selected yet, select the first one
        if (!eventTypeId && data.length > 0) {
          console.log('Setting default event type ID:', data[0].id);
          setEventTypeId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching event types:', err);
        if (err instanceof Error) {
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
        }
        setEventTypesError('Failed to load event types');
      } finally {
        setLoadingEventTypes(false);
      }
    };
    
    fetchEventTypes();
  }, [eventTypeId]);

  // Function to seed default event types
  const handleSeedEventTypes = async () => {
    console.log('Starting handleSeedEventTypes in EventForm');
    try {
      setLoadingEventTypes(true);
      setEventTypesError(null);
      
      console.log('Calling seedDefaultEventTypes service function');
      // Seed default event types
      const data = await seedDefaultEventTypes();
      console.log('seedDefaultEventTypes returned data:', data);
      
      setEventTypes(data);
      
      // Select the first event type
      if (data.length > 0) {
        console.log('Setting first event type from seeded data:', data[0].id);
        setEventTypeId(data[0].id);
      } else {
        console.warn('No event types returned from seeding');
      }
      
      setEventTypesError(null);
    } catch (err) {
      console.error('Error seeding event types:', err);
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      }
      setEventTypesError('Failed to seed event types');
    } finally {
      setLoadingEventTypes(false);
    }
  };

  // Initialize form with event data if provided
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      
      // Format date for input
      try {
        const eventDate = parseISO(event.date);
        setDate(format(eventDate, 'yyyy-MM-dd'));
      } catch (error) {
        console.error('Error parsing date:', error);
        setDate('');
      }
      
      setTime(event.time || '');
      setEventTypeId(event.eventTypeId || '');
      setStatus(event.status || 'draft');
      setDescription(event.description || '');
      setLocation(event.location || '');
      setOrganizer(event.organizer || '');
      setAttendeesText(event.attendees ? event.attendees.join(', ') : '');
    } else if (initialDate) {
      // If no event but initialDate is provided, set the date field
      setDate(format(initialDate, 'yyyy-MM-dd'));
      
      // Set default time based on event type
      const selectedEventType = eventTypes.find(et => et.id === eventTypeId);
      if (selectedEventType) {
        switch (selectedEventType.code) {
          case 'service':
            setTime('9:00 AM - 11:00 AM');
            break;
          case 'rehearsal':
            setTime('6:00 PM - 8:00 PM');
            break;
          case 'youth':
            setTime('7:00 PM - 9:00 PM');
            break;
          default:
            setTime('12:00 PM - 1:00 PM');
        }
      } else {
        setTime('12:00 PM - 1:00 PM');
      }
    }
  }, [event, initialDate, eventTypes, eventTypeId]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse attendees from comma-separated text
    const attendees = attendeesText
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    // Find the selected event type
    const selectedEventType = eventTypes.find(et => et.id === eventTypeId);
    
    // Create event object
    const eventData: FormEvent = {
      ...(event?.id ? { id: event.id } : {}),
      title,
      date,
      time,
      eventTypeId,
      // Include legacy type for backward compatibility
      type: (selectedEventType?.code as LegacyEventType) || undefined,
      status,
      description: description || undefined,
      location: location || undefined,
      organizer: organizer || undefined,
      attendees: attendees.length > 0 ? attendees : undefined
    };
    
    onSubmit(eventData);
  };

  // Get the selected event type
  const selectedEventType = eventTypes.find(et => et.id === eventTypeId);

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center p-4 border-b border-neutral-200">
        <h2 className="text-xl font-semibold text-neutral-900">
          {event?.id ? 'Edit Event' : 'Create New Event'}
        </h2>
        <button 
          className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
          onClick={onCancel}
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6 text-neutral-500" />
        </button>
      </div>
      
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Event title"
            required
          />
        </div>
        
        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-1">
              Date *
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-neutral-700 mb-1">
              Time *
            </label>
            <input
              id="time"
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. 9:00 AM - 11:00 AM"
              required
            />
          </div>
        </div>
        
        {/* Type and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="eventTypeId" className="block text-sm font-medium text-neutral-700 mb-1">
              Event Type *
            </label>
            {loadingEventTypes ? (
              <div className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-gray-50">
                <div className="animate-pulse h-5 bg-gray-200 rounded w-24"></div>
              </div>
            ) : eventTypesError ? (
              <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-800 text-sm flex items-center justify-between">
                <span>{eventTypesError}</span>
                <button
                  type="button"
                  onClick={handleSeedEventTypes}
                  className="px-2 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Create Default Event Types
                </button>
              </div>
            ) : (
              <div className="relative">
                <select
                  id="eventTypeId"
                  value={eventTypeId}
                  onChange={(e) => setEventTypeId(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                  required
                >
                  {eventTypes.length === 0 ? (
                    <option value="" disabled>No event types available</option>
                  ) : (
                    eventTypes.map(eventType => (
                      <option key={eventType.id} value={eventType.id}>
                        {eventType.name}
                      </option>
                    ))
                  )}
                </select>
                {selectedEventType && (
                  <div 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: selectedEventType.color }}
                  ></div>
                )}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        {/* Location and Organizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Event location"
            />
          </div>
          <div>
            <label htmlFor="organizer" className="block text-sm font-medium text-neutral-700 mb-1">
              Organizer
            </label>
            <input
              id="organizer"
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Event organizer"
            />
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Event description"
            rows={3}
          />
        </div>
        
        {/* Attendees */}
        <div>
          <label htmlFor="attendees" className="block text-sm font-medium text-neutral-700 mb-1">
            Attendees <span className="text-xs text-neutral-500">(comma-separated)</span>
          </label>
          <textarea
            id="attendees"
            value={attendeesText}
            onChange={(e) => setAttendeesText(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="John Doe, Jane Smith, etc."
            rows={2}
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : event?.id ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm; 