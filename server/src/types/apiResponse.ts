/**
 * Standard API response interface for consistent responses across the application
 */
export interface ApiResponse<T> {
  /**
   * Indicates whether the request was successful
   */
  success: boolean;
  
  /**
   * The data returned by the API
   * For successful requests, this will contain the requested data
   * For failed requests, this may be null or an empty array
   */
  data: T;
  
  /**
   * Optional count of items in the data array
   * Useful for pagination
   */
  count?: number;
  
  /**
   * Optional message providing additional information
   * For successful requests, this may be a success message
   * For failed requests, this will contain an error message
   */
  message?: string;
}

/**
 * Helper function to create a successful API response
 * @param data The data to include in the response
 * @param message Optional success message
 * @param count Optional count of items in the data array
 * @returns A standardized successful API response
 */
export function createSuccessResponse<T>(data: T, message?: string, count?: number): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
    ...(count !== undefined && { count })
  };
}

/**
 * Helper function to create a failed API response
 * @param message Error message
 * @param data Optional data to include in the response (defaults to null)
 * @returns A standardized failed API response
 */
export function createErrorResponse<T>(message: string, data: T): ApiResponse<T> {
  return {
    success: false,
    data,
    message
  };
} 