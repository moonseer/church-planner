/**
 * Error utilities for handling and formatting errors throughout the application
 */

import axios, { AxiosError } from 'axios';

/**
 * Format an error message for display to the user
 * @param error - The error object
 * @returns A user-friendly error message
 */
export const formatErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (axios.isAxiosError(error)) {
    return handleAxiosError(error);
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Handle Axios errors and return a user-friendly message
 * @param error - The Axios error
 * @returns A user-friendly error message
 */
export const handleAxiosError = (error: AxiosError): string => {
  // Network error (no response from server)
  if (error.code === 'ECONNABORTED' || !error.response) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  // Server returned an error response
  const status = error.response.status;
  const data = error.response.data as any;
  
  // Check if the server returned a message
  if (data && data.message) {
    return data.message;
  }
  
  // Default messages based on status code
  switch (status) {
    case 400:
      return 'The request was invalid. Please check your input and try again.';
    case 401:
      return 'You are not authorized to perform this action. Please log in and try again.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'The request could not be completed due to a conflict with the current state of the resource.';
    case 422:
      return 'The request was well-formed but was unable to be followed due to semantic errors.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'An internal server error occurred. Please try again later.';
    case 503:
      return 'The service is temporarily unavailable. Please try again later.';
    default:
      return `An error occurred (${status}). Please try again later.`;
  }
};

/**
 * Log an error to the console and potentially to an error tracking service
 * @param error - The error object
 * @param context - Additional context about where the error occurred
 */
export const logError = (error: unknown, context: string): void => {
  console.error(`Error in ${context}:`, error);
  
  // In a production app, you would send this to an error tracking service like Sentry
  // Example: Sentry.captureException(error, { extra: { context } });
};

/**
 * Create a retry function that will retry a function multiple times with exponential backoff
 * @param fn - The function to retry
 * @param maxRetries - The maximum number of retries (default: 3)
 * @param initialDelay - The initial delay in milliseconds (default: 1000)
 * @returns A function that will retry the original function
 */
export const withRetry = <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): () => Promise<T> => {
  return async (): Promise<T> => {
    let lastError: unknown;
    let delay = initialDelay;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Wait for the delay before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Exponential backoff
        delay *= 2;
      }
    }
    
    throw lastError;
  };
}; 