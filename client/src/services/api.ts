import axios from 'axios';

// In Docker, containers can communicate using the service name as hostname
// For local development outside Docker, use localhost
// We'll use environment variables to handle different environments
// @ts-ignore - Vite specific environment variables
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080';

console.log('API URL:', API_URL); // Add logging to debug

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
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
      const response = await api.post('/api/auth/register', { name, email, password, churchName });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post('/api/auth/reset-password', { token, password });
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