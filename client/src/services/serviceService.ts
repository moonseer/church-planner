import api from './api';
import { ServiceItemData } from '../components/services/ServiceItem';

// Service data interface
export interface Service {
  id: string;
  title: string;
  date: string; // ISO string format
  time: string;
  items: ServiceItemData[];
  churchId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

// Service data for creating/updating services
export interface ApiServiceData {
  title: string;
  date: string;
  time: string;
  items: ServiceItemData[];
}

/**
 * Get services for a specific church and month
 * @param churchId - The ID of the church
 * @param month - The month (0-11)
 * @param year - The year
 * @returns Promise with the services data
 */
export const getServices = async (
  churchId: string,
  month?: number,
  year?: number
): Promise<ApiResponse<Service[]>> => {
  try {
    let url = `/services/${churchId}`;
    
    // Add month and year query parameters if provided
    if (month !== undefined && year !== undefined) {
      url += `?month=${month + 1}&year=${year}`;
      console.log(`Fetching services for ${month + 1}/${year} using URL: ${url}`);
    } else {
      console.log(`Fetching all services using URL: ${url}`);
    }
    
    const response = await api.get(url);
    console.log('Service API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return {
      success: false,
      message: 'Failed to fetch services. Please try again later.'
    };
  }
};

/**
 * Get a single service
 * @param serviceId - The ID of the service to retrieve
 * @returns Promise with the service data
 */
export const getService = async (
  serviceId: string
): Promise<ApiResponse<Service>> => {
  try {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    return {
      success: false,
      message: 'Failed to fetch service. Please try again later.'
    };
  }
};

/**
 * Create a new service
 * @param churchId - The ID of the church
 * @param serviceData - The service data
 * @returns Promise with the created service data
 */
export const createService = async (
  churchId: string,
  serviceData: ApiServiceData
): Promise<ApiResponse<Service>> => {
  try {
    const response = await api.post(`/services/${churchId}`, serviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    return {
      success: false,
      message: 'Failed to create service. Please try again later.'
    };
  }
};

/**
 * Update an existing service
 * @param serviceId - The ID of the service to update
 * @param serviceData - The updated service data
 * @returns Promise with the updated service data
 */
export const updateService = async (
  serviceId: string,
  serviceData: ApiServiceData
): Promise<ApiResponse<Service>> => {
  try {
    const response = await api.put(`/services/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    return {
      success: false,
      message: 'Failed to update service. Please try again later.'
    };
  }
};

/**
 * Delete a service
 * @param serviceId - The ID of the service to delete
 * @returns Promise with the success status
 */
export const deleteService = async (
  serviceId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    return {
      success: false,
      message: 'Failed to delete service. Please try again later.'
    };
  }
};

/**
 * Seed services for a specific church (for development/demo purposes)
 * @param churchId - The ID of the church
 * @returns Promise with the seeded services data
 */
export const seedServices = async (
  churchId: string
): Promise<ApiResponse<Service[]>> => {
  try {
    const response = await api.post(`/services/${churchId}/seed`);
    return response.data;
  } catch (error) {
    console.error('Error seeding services:', error);
    return {
      success: false,
      message: 'Failed to seed services. Please try again later.'
    };
  }
}; 