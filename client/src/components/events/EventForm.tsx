import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { Event, FormEvent, EventType, EventStatus } from '../../types/event';

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
  const [type, setType] = useState<EventType>('service');
  const [status, setStatus] = useState<EventStatus>('draft');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [attendeesText, setAttendeesText] = useState('');

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
      setType(event.type || 'service');
      setStatus(event.status || 'draft');
      setDescription(event.description || '');
      setLocation(event.location || '');
      setOrganizer(event.organizer || '');
      setAttendeesText(event.attendees ? event.attendees.join(', ') : '');
    } else if (initialDate) {
      // If no event but initialDate is provided, set the date field
      setDate(format(initialDate, 'yyyy-MM-dd'));
      
      // Set default time based on event type
      if (type === 'service') {
        setTime('9:00 AM - 11:00 AM');
      } else if (type === 'rehearsal') {
        setTime('6:00 PM - 8:00 PM');
      } else if (type === 'youth') {
        setTime('7:00 PM - 9:00 PM');
      } else {
        setTime('12:00 PM - 1:00 PM');
      }
    }
  }, [event, initialDate, type]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse attendees from comma-separated text
    const attendees = attendeesText
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    // Create event object
    const eventData: FormEvent = {
      ...(event?.id ? { id: event.id } : {}),
      title,
      date,
      time,
      type,
      status,
      description: description || undefined,
      location: location || undefined,
      organizer: organizer || undefined,
      attendees: attendees.length > 0 ? attendees : undefined
    };
    
    onSubmit(eventData);
  };

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
            <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
              Event Type *
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="service">Service</option>
              <option value="rehearsal">Rehearsal</option>
              <option value="meeting">Meeting</option>
              <option value="youth">Youth</option>
            </select>
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
            Attendees (comma-separated)
          </label>
          <textarea
            id="attendees"
            value={attendeesText}
            onChange={(e) => setAttendeesText(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. Worship Team, Tech Team, Hospitality Team"
            rows={2}
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              event?.id ? 'Update Event' : 'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm; 