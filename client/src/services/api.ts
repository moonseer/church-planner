import axios from 'axios';

// In Docker, containers can communicate using the service name as hostname
// For local development outside Docker, use localhost
// We'll use environment variables to handle different environments
// @ts-ignore - Vite specific environment variables
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080/api';

// Override API_URL if we're in a browser environment to ensure we use localhost
const BROWSER_API_URL = 'http://localhost:8080/api';

// Use the browser URL when in a browser environment
const BASE_URL = typeof window !== 'undefined' ? BROWSER_API_URL : API_URL;

console.log('API Base URL:', BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
  // Important for containerized apps - allow credentials
  withCredentials: true
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token found in localStorage, adding to request headers');
    } else {
      console.warn('No token found in localStorage');
    }
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      code: error.code,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL
      } : 'No config'
    });
    
    if (error.response) {
      console.error('Error Response Details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('No response received. Request details:', error.request);
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (name: string, email: string, password: string, churchName: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, churchName });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    console.log('Attempting login with email:', email);
    
    try {
      // First check if the server is reachable
      console.log('Performing health check before login...');
      try {
        const healthResponse = await axios.get(`${BASE_URL.replace('/api', '')}/api/health`);
        console.log('Health check response:', healthResponse.data);
      } catch (healthError: any) {
        console.error('Health check failed:', healthError.message);
        if (healthError.response) {
          console.error('Health check error response:', healthError.response.data);
        } else if (healthError.request) {
          console.error('Health check no response received. Network issue?');
        }
      }
      
      // Now attempt the login
      console.log('Sending login request to:', `${BASE_URL}/auth/login`);
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      console.log('Login response received:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.message);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        throw error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received. Network issue?');
        throw { message: 'Network error. Please check your connection.' };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        throw { message: 'An unexpected error occurred.' };
      }
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
};

// Health check API call
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

export default api; 