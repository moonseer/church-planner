import { LegacyEventType, EventTypeDefinition } from '../types/event';

/**
 * Event color utility functions
 * These functions provide consistent color schemes for event types across the application
 */

// Convert hex color to Tailwind-like classes
export const hexToTailwindClasses = (hexColor: string): { bg: string, text: string, border: string } => {
  // Default fallback colors
  const defaultClasses = {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300'
  };
  
  try {
    // Simple validation for hex color
    if (!hexColor || !hexColor.startsWith('#')) {
      return defaultClasses;
    }
    
    // For now, we'll use a simple mapping approach
    // In a real implementation, you might want to use a more sophisticated color manipulation library
    
    // Extract the hex color without the #
    const hex = hexColor.substring(1);
    
    // Generate classes based on predefined colors
    // This is a simplified approach - in a real app, you'd want to generate proper color variants
    switch (hex.toLowerCase()) {
      // Indigo (service)
      case '4f46e5':
        return {
          bg: 'bg-primary-100',
          text: 'text-primary-800',
          border: 'border-primary-500'
        };
      // Sky (rehearsal)
      case '0ea5e9':
        return {
          bg: 'bg-secondary-100',
          text: 'text-secondary-800',
          border: 'border-secondary-500'
        };
      // Emerald (meeting)
      case '10b981':
        return {
          bg: 'bg-accent-100',
          text: 'text-accent-800',
          border: 'border-accent-500'
        };
      // Violet (youth)
      case '8b5cf6':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-500'
        };
      // For custom colors, we'll use a generic approach
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: `border-[${hexColor}]` // Use the actual color for border
        };
    }
  } catch (error) {
    console.error('Error converting hex to Tailwind classes:', error);
    return defaultClasses;
  }
};

// Get class for event type (for calendar events)
export const getEventClass = (eventType?: EventTypeDefinition, legacyType?: LegacyEventType): string => {
  // If we have an event type with a color, use it
  if (eventType?.color) {
    const classes = hexToTailwindClasses(eventType.color);
    return `${classes.bg} ${classes.text} ${classes.border}`;
  }
  
  // Fall back to legacy type if available
  if (legacyType) {
    switch (legacyType) {
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
  }
  
  // Default fallback
  return 'bg-gray-100 text-gray-800 border-gray-300';
};

// Get background color for event type (for calendar events)
export const getEventBgColor = (eventType?: EventTypeDefinition, legacyType?: LegacyEventType): string => {
  // If we have an event type with a color, use it
  if (eventType?.color) {
    return hexToTailwindClasses(eventType.color).bg;
  }
  
  // Fall back to legacy type if available
  if (legacyType) {
    switch (legacyType) {
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
  }
  
  // Default fallback
  return 'bg-gray-100';
};

// Get text color for event type
export const getEventTextColor = (eventType?: EventTypeDefinition, legacyType?: LegacyEventType): string => {
  // If we have an event type with a color, use it
  if (eventType?.color) {
    return hexToTailwindClasses(eventType.color).text;
  }
  
  // Fall back to legacy type if available
  if (legacyType) {
    switch (legacyType) {
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
  }
  
  // Default fallback
  return 'text-gray-800';
};

// Get border color for event type
export const getEventBorderColor = (eventType?: EventTypeDefinition, legacyType?: LegacyEventType): string => {
  // If we have an event type with a color, use it
  if (eventType?.color) {
    return hexToTailwindClasses(eventType.color).border;
  }
  
  // Fall back to legacy type if available
  if (legacyType) {
    switch (legacyType) {
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
  }
  
  // Default fallback
  return 'border-gray-300';
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
export const getEventTypeName = (eventType?: EventTypeDefinition, legacyType?: LegacyEventType): string => {
  // If we have an event type with a name, use it
  if (eventType?.name) {
    return eventType.name;
  }
  
  // Fall back to legacy type if available
  if (legacyType) {
    return legacyType.charAt(0).toUpperCase() + legacyType.slice(1);
  }
  
  // Default fallback
  return 'Event';
}; 