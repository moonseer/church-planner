import api from './api';
import { ServiceItemData } from '../components/services/ServiceItem';
import { getCacheItem, setCacheItem, removeCacheItem, generateServicesCacheKey } from '../utils/cacheUtils';

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
    // Generate cache key
    const cacheKey = generateServicesCacheKey(churchId, month, year);
    
    // Check cache first
    const cachedServices = getCacheItem<ApiResponse<Service[]>>(cacheKey);
    if (cachedServices) {
      console.log(`Using cached services for ${month !== undefined ? month + 1 : 'all'}/${year || 'all'}`);
      return cachedServices;
    }
    
    let url = `/api/services/${churchId}`;
    
    // Add month and year query parameters if provided
    if (month !== undefined && year !== undefined) {
      url += `?month=${month + 1}&year=${year}`;
      console.log(`Fetching services for ${month + 1}/${year} using URL: ${url}`);
    } else {
      console.log(`Fetching all services using URL: ${url}`);
    }
    
    const response = await api.get(url);
    console.log('Service API response:', response.data);
    
    // Cache the response for 30 minutes
    setCacheItem(cacheKey, response.data, 30);
    
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
    // Generate cache key for a single service
    const cacheKey = `service_${serviceId}`;
    
    // Check cache first
    const cachedService = getCacheItem<ApiResponse<Service>>(cacheKey);
    if (cachedService) {
      console.log(`Using cached service for ID: ${serviceId}`);
      return cachedService;
    }
    
    const response = await api.get(`/api/services/${serviceId}`);
    
    // Cache the response for 30 minutes
    setCacheItem(cacheKey, response.data, 30);
    
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
    const response = await api.post(`/api/services/${churchId}`, serviceData);
    
    // Invalidate cache for the month/year of the new service
    if (response.data.success && response.data.data) {
      const serviceDate = new Date(serviceData.date);
      const month = serviceDate.getMonth();
      const year = serviceDate.getFullYear();
      
      // Invalidate specific month cache
      const monthCacheKey = generateServicesCacheKey(churchId, month, year);
      removeCacheItem(monthCacheKey);
      
      // Also invalidate the "all services" cache
      const allCacheKey = generateServicesCacheKey(churchId);
      removeCacheItem(allCacheKey);
    }
    
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
    const response = await api.put(`/api/services/${serviceId}`, serviceData);
    
    // Invalidate cache for the month/year of the updated service
    if (response.data.success && response.data.data) {
      const serviceDate = new Date(serviceData.date);
      const month = serviceDate.getMonth();
      const year = serviceDate.getFullYear();
      
      // We don't know the churchId from this context, so we'll need to extract it from the response
      if (response.data.data.churchId) {
        // Invalidate specific month cache
        const monthCacheKey = generateServicesCacheKey(response.data.data.churchId, month, year);
        removeCacheItem(monthCacheKey);
        
        // Also invalidate the "all services" cache
        const allCacheKey = generateServicesCacheKey(response.data.data.churchId);
        removeCacheItem(allCacheKey);
        
        // Invalidate the specific service cache
        const serviceCacheKey = `service_${serviceId}`;
        removeCacheItem(serviceCacheKey);
      }
    }
    
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
    // First, get the service to know which cache to invalidate
    const serviceResponse = await api.get(`/api/services/${serviceId}`);
    const service = serviceResponse.data.data;
    
    const response = await api.delete(`/api/services/${serviceId}`);
    
    // Invalidate cache for the month/year of the deleted service
    if (response.data.success && service) {
      const serviceDate = new Date(service.date);
      const month = serviceDate.getMonth();
      const year = serviceDate.getFullYear();
      
      if (service.churchId) {
        // Invalidate specific month cache
        const monthCacheKey = generateServicesCacheKey(service.churchId, month, year);
        removeCacheItem(monthCacheKey);
        
        // Also invalidate the "all services" cache
        const allCacheKey = generateServicesCacheKey(service.churchId);
        removeCacheItem(allCacheKey);
        
        // Invalidate the specific service cache
        const serviceCacheKey = `service_${serviceId}`;
        removeCacheItem(serviceCacheKey);
      }
    }
    
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
    const response = await api.post(`/api/services/${churchId}/seed`);
    
    // Clear all service caches for this church since we've seeded new data
    clearServiceCachesForChurch(churchId);
    
    return response.data;
  } catch (error) {
    console.error('Error seeding services:', error);
    return {
      success: false,
      message: 'Failed to seed services. Please try again later.'
    };
  }
};

/**
 * Clear all service caches for a specific church
 * @param churchId - The ID of the church
 */
const clearServiceCachesForChurch = (churchId: string): void => {
  try {
    // This is a simple approach that clears all localStorage items that start with 'services_churchId'
    // In a production app, we might want to be more selective
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(`services_${churchId}`) || key.startsWith('service_'))) {
        localStorage.removeItem(key);
      }
    }
    console.log(`Cleared all service caches for church: ${churchId}`);
  } catch (error) {
    console.error('Error clearing service caches:', error);
  }
}; 