/**
 * Event types for the church-planner application
 * These types are used across the application to ensure consistency
 */

// Event type options
export type EventType = 'service' | 'rehearsal' | 'meeting' | 'youth';

// Event status options
export type EventStatus = 'draft' | 'published' | 'completed';

// Base Event interface
export interface Event {
  id: string;
  title: string;
  date: string; // ISO string format
  time: string; // Display format (e.g., "9:00 AM - 11:00 AM")
  type: EventType;
  status?: EventStatus;
  description?: string;
  location?: string;
  organizer?: string;
  attendees?: string[];
}

// For form submission, we need to allow id to be optional for new events
export interface FormEvent extends Omit<Event, 'id'> {
  id?: string;
}

// API Event data for creating/updating events
export interface ApiEventData {
  title: string;
  date: string;
  time: string;
  type: EventType;
  status: EventStatus;
  description?: string;
  location?: string;
  organizer?: string;
  attendees?: string[];
}

// Calendar event display properties
export interface CalendarEventDisplay {
  id: string;
  title: string;
  date: string;
  time: string;
  type: EventType;
  status?: EventStatus;
  className?: string;
  isEditable?: boolean;
}

// Helper function to format an event for calendar display
export const formatEventForCalendar = (event: Event): Event => {
  return {
    ...event,
    // Ensure date is in ISO format
    date: event.date,
    // Ensure time is in display format
    time: event.time || '',
    // Ensure type is valid
    type: event.type as EventType,
    // Ensure status is valid
    status: (event.status as EventStatus) || 'draft'
  };
}; 