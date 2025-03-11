import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchServices, fetchServiceById, createService, updateService, deleteService } from '../api/services';

// Mock fetch
global.fetch = vi.fn();

describe('Service API', () => {
  const mockToken = 'mock-token';
  const mockApiUrl = 'http://localhost:8080/api';
  
  beforeEach(() => {
    // Store original environment variables
    vi.stubEnv('VITE_API_URL', mockApiUrl);
    
    // Reset mocks
    vi.resetAllMocks();
  });
  
  afterEach(() => {
    // Restore environment variables
    vi.unstubAllEnvs();
  });
  
  describe('fetchServices', () => {
    it('should fetch services successfully', async () => {
      // Mock successful response
      const mockServices = [
        { _id: 'service1', title: 'Sunday Service' },
        { _id: 'service2', title: 'Midweek Service' },
      ];
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, services: mockServices }),
      });
      
      // Call the function
      const result = await fetchServices(mockToken);
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(`${mockApiUrl}/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
      });
      
      // Check the result
      expect(result).toEqual(mockServices);
    });
    
    it('should throw an error when fetch fails', async () => {
      // Mock failed response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ success: false, message: 'Unauthorized' }),
      });
      
      // Call the function and expect it to throw
      await expect(fetchServices(mockToken)).rejects.toThrow('Unauthorized');
      
      // Check that fetch was called
      expect(global.fetch).toHaveBeenCalled();
    });
  });
  
  describe('fetchServiceById', () => {
    it('should fetch a service by ID successfully', async () => {
      // Mock successful response
      const mockService = { _id: 'service1', title: 'Sunday Service' };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, service: mockService }),
      });
      
      // Call the function
      const result = await fetchServiceById('service1', mockToken);
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(`${mockApiUrl}/services/service1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
      });
      
      // Check the result
      expect(result).toEqual(mockService);
    });
  });
  
  describe('createService', () => {
    it('should create a service successfully', async () => {
      // Mock service data
      const mockServiceData = {
        title: 'New Service',
        date: '2023-06-10',
        description: 'A new service',
        teams: ['worship'],
      };
      
      const mockCreatedService = {
        ...mockServiceData,
        _id: 'service3',
      };
      
      // Mock successful response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, service: mockCreatedService }),
      });
      
      // Call the function
      const result = await createService(mockServiceData, mockToken);
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(`${mockApiUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(mockServiceData),
      });
      
      // Check the result
      expect(result).toEqual(mockCreatedService);
    });
  });
  
  describe('updateService', () => {
    it('should update a service successfully', async () => {
      // Mock service data
      const mockServiceId = 'service1';
      const mockServiceData = {
        title: 'Updated Service',
        date: '2023-06-10',
        description: 'An updated service',
        teams: ['worship', 'tech'],
      };
      
      const mockUpdatedService = {
        ...mockServiceData,
        _id: mockServiceId,
      };
      
      // Mock successful response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, service: mockUpdatedService }),
      });
      
      // Call the function
      const result = await updateService(mockServiceId, mockServiceData, mockToken);
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(`${mockApiUrl}/services/${mockServiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(mockServiceData),
      });
      
      // Check the result
      expect(result).toEqual(mockUpdatedService);
    });
  });
  
  describe('deleteService', () => {
    it('should delete a service successfully', async () => {
      // Mock service ID
      const mockServiceId = 'service1';
      
      // Mock successful response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Service deleted' }),
      });
      
      // Call the function
      await deleteService(mockServiceId, mockToken);
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(`${mockApiUrl}/services/${mockServiceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
      });
    });
  });
}); 