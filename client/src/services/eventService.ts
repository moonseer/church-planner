import api from './api';
import { Event, ApiEventData, FormEvent, formatEventForCalendar } from '../types/event';
import { getCacheItem, setCacheItem, removeCacheItem, generateEventsCacheKey } from '../utils/cacheUtils';

// API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Get events for a specific church and month
 * @param churchId - The ID of the church
 * @param month - The month (0-11)
 * @param year - The year
 * @returns Promise with the events data
 */
export const getEvents = async (
  churchId: string,
  month: number,
  year: number
): Promise<ApiResponse<Event[]>> => {
  try {
    // Generate cache key
    const cacheKey = generateEventsCacheKey(churchId, month, year);
    
    // Check cache first
    const cachedEvents = getCacheItem<ApiResponse<Event[]>>(cacheKey);
    if (cachedEvents) {
      console.log(`Using cached events for ${month + 1}/${year}`);
      return cachedEvents;
    }
    
    console.log(`Fetching events for month ${month + 1}, year ${year}`);
    
    const response = await api.get(`/events/${churchId}?month=${month + 1}&year=${year}`);
    
    // Cache the response for 30 minutes
    setCacheItem(cacheKey, response.data, 30);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      success: false,
      message: 'Failed to fetch events. Please try again later.'
    };
  }
};

/**
 * Seed events for a specific church (for development/demo purposes)
 * @param churchId - The ID of the church
 * @returns Promise with the seeded events data
 */
export const seedEvents = async (churchId: string): Promise<ApiResponse<Event[]>> => {
  try {
    const response = await api.post(`/events/${churchId}/seed`);
    
    // Clear all event caches for this church since we've seeded new data
    // This is a simple approach - in a production app, we might want to be more selective
    clearEventCachesForChurch(churchId);
    
    return response.data;
  } catch (error) {
    console.error('Error seeding events:', error);
    return {
      success: false,
      message: 'Failed to seed events. Please try again later.'
    };
  }
};

/**
 * Create a new event
 * @param churchId - The ID of the church
 * @param eventData - The event data
 * @returns Promise with the created event data
 */
export const createEvent = async (
  churchId: string,
  eventData: ApiEventData
): Promise<ApiResponse<Event>> => {
  try {
    const response = await api.post(`/events/${churchId}`, eventData);
    
    // Invalidate cache for the month/year of the new event
    if (response.data.success && response.data.data) {
      const eventDate = new Date(eventData.date);
      const month = eventDate.getMonth();
      const year = eventDate.getFullYear();
      const cacheKey = generateEventsCacheKey(churchId, month, year);
      removeCacheItem(cacheKey);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      success: false,
      message: 'Failed to create event. Please try again later.'
    };
  }
};

/**
 * Update an existing event
 * @param eventId - The ID of the event to update
 * @param eventData - The updated event data
 * @returns Promise with the updated event data
 */
export const updateEvent = async (
  eventId: string,
  eventData: ApiEventData
): Promise<ApiResponse<Event>> => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData);
    
    // Invalidate cache for the month/year of the updated event
    if (response.data.success && response.data.data) {
      const eventDate = new Date(eventData.date);
      const month = eventDate.getMonth();
      const year = eventDate.getFullYear();
      
      // We don't know the churchId from this context, so we'll need to extract it from the response
      if (response.data.data.churchId) {
        const cacheKey = generateEventsCacheKey(response.data.data.churchId, month, year);
        removeCacheItem(cacheKey);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      success: false,
      message: 'Failed to update event. Please try again later.'
    };
  }
};

/**
 * Delete an event
 * @param eventId - The ID of the event to delete
 * @returns Promise with the success status
 */
export const deleteEvent = async (eventId: string): Promise<ApiResponse<null>> => {
  try {
    // First, get the event to know which cache to invalidate
    const eventResponse = await api.get(`/events/${eventId}`);
    const event = eventResponse.data.data;
    
    const response = await api.delete(`/events/${eventId}`);
    
    // Invalidate cache for the month/year of the deleted event
    if (response.data.success && event) {
      const eventDate = new Date(event.date);
      const month = eventDate.getMonth();
      const year = eventDate.getFullYear();
      
      if (event.churchId) {
        const cacheKey = generateEventsCacheKey(event.churchId, month, year);
        removeCacheItem(cacheKey);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      message: 'Failed to delete event. Please try again later.'
    };
  }
};

/**
 * Clear all event caches for a specific church
 * @param churchId - The ID of the church
 */
const clearEventCachesForChurch = (churchId: string): void => {
  try {
    // This is a simple approach that clears all localStorage items that start with 'events_churchId'
    // In a production app, we might want to be more selective
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`events_${churchId}`)) {
        localStorage.removeItem(key);
      }
    }
    console.log(`Cleared all event caches for church: ${churchId}`);
  } catch (error) {
    console.error('Error clearing event caches:', error);
  }
};

// Export the formatEventForCalendar function from our types
export { formatEventForCalendar }; 