import api from './api';
import { EventTypeDefinition, EventTypeFormData, EventTypeResponse } from '../types/event';
import { getCacheItem, setCacheItem, removeCacheItem } from '../utils/cacheUtils';

// Cache keys
const EVENT_TYPES_CACHE_KEY = 'eventTypes';

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

/**
 * Generate a cache key for event types
 */
const generateEventTypesCacheKey = (churchId: string) => {
  return `${EVENT_TYPES_CACHE_KEY}_${churchId}`;
};

/**
 * Get all event types for the current church
 */
export const getEventTypes = async (): Promise<EventTypeDefinition[]> => {
  try {
    console.log('Starting getEventTypes request');
    
    // Check cache first
    const cacheKey = generateEventTypesCacheKey('current');
    const cachedData = getCacheItem<EventTypeDefinition[]>(cacheKey);
    
    if (cachedData) {
      console.log('Using cached event types:', cachedData);
      return cachedData;
    }
    
    console.log('No cached event types found, fetching from API');
    
    // Fetch from API if not in cache
    // The server will get the churchId from the authenticated user
    const response = await api.get<EventTypeResponse>('/api/event-types');
    
    console.log('Event types API response:', response);
    
    if (response.data && response.data.success) {
      const eventTypes = Array.isArray(response.data.data) 
        ? response.data.data 
        : [response.data.data];
      
      console.log('Processed event types:', eventTypes);
      
      // Cache the result
      setCacheItem(cacheKey, eventTypes, CACHE_EXPIRATION);
      
      return eventTypes;
    }
    
    console.error('API returned unsuccessful response:', response.data);
    throw new Error((response.data && response.data.message) || 'Failed to fetch event types');
  } catch (error) {
    console.error('Error fetching event types:', error);
    throw error;
  }
};

/**
 * Get a single event type by ID
 */
export const getEventType = async (id: string): Promise<EventTypeDefinition> => {
  try {
    // Check cache first
    const cacheKey = `${EVENT_TYPES_CACHE_KEY}_${id}`;
    const cachedData = getCacheItem<EventTypeDefinition>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // Fetch from API if not in cache
    const response = await api.get<EventTypeResponse>(`/api/event-types/${id}`);
    
    if (response.data && response.data.success) {
      const eventType = response.data.data as EventTypeDefinition;
      
      // Cache the result
      setCacheItem(cacheKey, eventType, CACHE_EXPIRATION);
      
      return eventType;
    }
    
    throw new Error((response.data && response.data.message) || 'Failed to fetch event type');
  } catch (error) {
    console.error(`Error fetching event type ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new event type
 */
export const createEventType = async (eventTypeData: EventTypeFormData): Promise<EventTypeDefinition> => {
  try {
    const response = await api.post<EventTypeResponse>('/api/event-types', eventTypeData);
    
    if (response.data && response.data.success) {
      const eventType = response.data.data as EventTypeDefinition;
      
      // Invalidate the event types cache
      removeCacheItem(generateEventTypesCacheKey('current'));
      
      return eventType;
    }
    
    throw new Error((response.data && response.data.message) || 'Failed to create event type');
  } catch (error) {
    console.error('Error creating event type:', error);
    throw error;
  }
};

/**
 * Update an existing event type
 */
export const updateEventType = async (id: string, eventTypeData: Partial<EventTypeFormData>): Promise<EventTypeDefinition> => {
  try {
    const response = await api.put<EventTypeResponse>(`/api/event-types/${id}`, eventTypeData);
    
    if (response.data && response.data.success) {
      const eventType = response.data.data as EventTypeDefinition;
      
      // Invalidate caches
      removeCacheItem(generateEventTypesCacheKey('current'));
      removeCacheItem(`${EVENT_TYPES_CACHE_KEY}_${id}`);
      
      return eventType;
    }
    
    throw new Error((response.data && response.data.message) || 'Failed to update event type');
  } catch (error) {
    console.error(`Error updating event type ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an event type
 */
export const deleteEventType = async (id: string): Promise<void> => {
  try {
    const response = await api.delete<EventTypeResponse>(`/api/event-types/${id}`);
    
    if (response.data && response.data.success) {
      // Invalidate caches
      removeCacheItem(generateEventTypesCacheKey('current'));
      removeCacheItem(`${EVENT_TYPES_CACHE_KEY}_${id}`);
      
      return;
    }
    
    throw new Error((response.data && response.data.message) || 'Failed to delete event type');
  } catch (error) {
    console.error(`Error deleting event type ${id}:`, error);
    throw error;
  }
};

/**
 * Seed default event types
 */
export const seedDefaultEventTypes = async (): Promise<EventTypeDefinition[]> => {
  try {
    console.log('Starting seedDefaultEventTypes request');
    
    const response = await api.post<EventTypeResponse>('/api/event-types/seed');
    
    console.log('Seed event types API response:', response);
    
    if (response.data && response.data.success) {
      const eventTypes = Array.isArray(response.data.data) 
        ? response.data.data 
        : [response.data.data];
      
      console.log('Processed seeded event types:', eventTypes);
      
      // Update cache
      setCacheItem(generateEventTypesCacheKey('current'), eventTypes, CACHE_EXPIRATION);
      
      return eventTypes;
    }
    
    console.error('API returned unsuccessful response for seeding:', response.data);
    throw new Error((response.data && response.data.message) || 'Failed to seed default event types');
  } catch (error) {
    console.error('Error seeding default event types:', error);
    throw error;
  }
};

/**
 * Get event type usage statistics
 */
export const getEventTypeStats = async (id: string): Promise<any> => {
  try {
    const response = await api.get<any>(`/api/event-types/${id}/stats`);
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    
    throw new Error((response.data && response.data.message) || 'Failed to fetch event type statistics');
  } catch (error) {
    console.error(`Error fetching statistics for event type ${id}:`, error);
    throw error;
  }
}; 