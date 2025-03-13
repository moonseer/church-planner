/**
 * Event types for the church-planner application
 * These types are used across the application to ensure consistency
 */

// Legacy event type options (kept for backward compatibility)
export type LegacyEventType = 'service' | 'rehearsal' | 'meeting' | 'youth';

// Event status options
export type EventStatus = 'draft' | 'published' | 'completed';

// Event Type definition
export interface EventTypeDefinition {
  id: string;
  name: string;
  code: string;
  color: string;
  icon?: string;
  isDefault?: boolean;
}

// Base Event interface
export interface Event {
  id: string;
  title: string;
  date: string; // ISO string format
  time: string; // Display format (e.g., "9:00 AM - 11:00 AM")
  // New fields for custom event types
  eventTypeId: string;
  eventType?: EventTypeDefinition;
  // Legacy field kept for backward compatibility
  type?: LegacyEventType;
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
  // Updated to use eventTypeId instead of type
  eventTypeId: string;
  // Legacy field kept for backward compatibility
  type?: LegacyEventType;
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
  // Updated to use eventTypeId and eventType
  eventTypeId: string;
  eventType?: EventTypeDefinition;
  // Legacy field kept for backward compatibility
  type?: LegacyEventType;
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
    // Include both new and legacy type fields
    eventTypeId: event.eventTypeId,
    eventType: event.eventType,
    type: event.type,
    // Ensure status is valid
    status: (event.status as EventStatus) || 'draft'
  };
};

// API response for event types
export interface EventTypeResponse {
  success: boolean;
  count?: number;
  data: EventTypeDefinition | EventTypeDefinition[];
  message?: string;
}

// Form data for creating/updating event types
export interface EventTypeFormData {
  name: string;
  code: string;
  color: string;
  icon?: string;
} 