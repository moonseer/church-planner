import api from './api';
import { Event, ApiEventData, FormEvent, formatEventForCalendar } from '../types/event';

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
    const response = await api.get(`/events/${churchId}?month=${month}&year=${year}`);
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
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      message: 'Failed to delete event. Please try again later.'
    };
  }
};

// Export the formatEventForCalendar function from our types
export { formatEventForCalendar }; 