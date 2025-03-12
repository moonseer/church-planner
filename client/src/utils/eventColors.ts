import { EventType } from '../types/event';

/**
 * Event color utility functions
 * These functions provide consistent color schemes for event types across the application
 */

// Get class for event type (for calendar events)
export const getEventClass = (type: EventType): string => {
  switch (type) {
    case 'service':
      return 'bg-primary-100 text-primary-800 border-primary-500';
    case 'rehearsal':
      return 'bg-secondary-100 text-secondary-800 border-secondary-500';
    case 'meeting':
      return 'bg-accent-100 text-accent-800 border-accent-500';
    case 'youth':
      return 'bg-purple-100 text-purple-800 border-purple-500';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Get background color for event type (for calendar events)
export const getEventBgColor = (type: EventType): string => {
  switch (type) {
    case 'service':
      return 'bg-primary-100';
    case 'rehearsal':
      return 'bg-secondary-100';
    case 'meeting':
      return 'bg-accent-100';
    case 'youth':
      return 'bg-purple-100';
    default:
      return 'bg-gray-100';
  }
};

// Get text color for event type
export const getEventTextColor = (type: EventType): string => {
  switch (type) {
    case 'service':
      return 'text-primary-800';
    case 'rehearsal':
      return 'text-secondary-800';
    case 'meeting':
      return 'text-accent-800';
    case 'youth':
      return 'text-purple-800';
    default:
      return 'text-gray-800';
  }
};

// Get border color for event type
export const getEventBorderColor = (type: EventType): string => {
  switch (type) {
    case 'service':
      return 'border-primary-500';
    case 'rehearsal':
      return 'border-secondary-500';
    case 'meeting':
      return 'border-accent-500';
    case 'youth':
      return 'border-purple-500';
    default:
      return 'border-gray-300';
  }
};

// Get badge class for event status
export const getStatusBadgeClass = (status?: 'draft' | 'published' | 'completed'): string => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Get human-readable event type name
export const getEventTypeName = (type: EventType): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
}; 