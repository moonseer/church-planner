import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Set up axios instance with auth header
const setupAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
};

// Interface for Event
export interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  type: 'service' | 'rehearsal' | 'meeting' | 'youth';
  status: 'draft' | 'published' | 'completed';
  description?: string;
  location?: string;
  organizer?: string;
  attendees?: string[];
  churchId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Get all events for a church
export const getEvents = async (churchId: string, month?: number, year?: number) => {
  try {
    const api = setupAxios();
    let url = `/churches/${churchId}/events`;
    
    // Add query parameters if month and year are provided
    if (month !== undefined && year !== undefined) {
      url += `?month=${month + 1}&year=${year}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get a single event
export const getEvent = async (eventId: string) => {
  try {
    const api = setupAxios();
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// Create a new event
export const createEvent = async (churchId: string, eventData: Omit<Event, '_id' | 'churchId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
  try {
    const api = setupAxios();
    const response = await api.post(`/churches/${churchId}/events`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an event
export const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
  try {
    const api = setupAxios();
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId: string) => {
  try {
    const api = setupAxios();
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Seed events (for development/testing)
export const seedEvents = async (churchId: string) => {
  try {
    const api = setupAxios();
    const response = await api.post(`/churches/${churchId}/events/seed`);
    return response.data;
  } catch (error) {
    console.error('Error seeding events:', error);
    throw error;
  }
};

// Format API event to match the format expected by the Calendar component
export const formatEventForCalendar = (event: Event) => {
  return {
    id: event._id,
    title: event.title,
    date: new Date(event.date).toISOString(),
    time: event.time,
    type: event.type,
    status: event.status,
    description: event.description,
    location: event.location,
    organizer: event.organizer,
    attendees: event.attendees
  };
}; 