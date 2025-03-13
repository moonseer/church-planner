/**
 * Utility functions for data manipulation, filtering, sorting, and pagination
 */

/**
 * Filter an array of objects based on search text and specified fields
 * @param data Array of objects to filter
 * @param searchText Text to search for
 * @param fields Array of object fields to search in
 * @returns Filtered array of objects
 */
export function filterData<T extends Record<string, any>>(
  data: T[],
  searchText: string,
  fields: (keyof T)[]
): T[] {
  if (!searchText || !searchText.trim()) {
    return data;
  }

  const normalizedSearchText = searchText.toLowerCase().trim();
  
  return data.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (value === null || value === undefined) {
        return false;
      }
      
      const stringValue = String(value).toLowerCase();
      return stringValue.includes(normalizedSearchText);
    });
  });
}

/**
 * Sort an array of objects by a specified field
 * @param data Array of objects to sort
 * @param field Field to sort by
 * @param direction Sort direction ('asc' or 'desc')
 * @returns Sorted array of objects
 */
export function sortData<T extends Record<string, any>>(
  data: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...data].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];
    
    // Handle null or undefined values
    if (valueA === null || valueA === undefined) {
      return direction === 'asc' ? -1 : 1;
    }
    if (valueB === null || valueB === undefined) {
      return direction === 'asc' ? 1 : -1;
    }
    
    // Handle different types
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Check if values are Date objects
    if (isDateObject(valueA) && isDateObject(valueB)) {
      return direction === 'asc' 
        ? valueA.getTime() - valueB.getTime() 
        : valueB.getTime() - valueA.getTime();
    }
    
    // Default comparison for numbers and other types
    return direction === 'asc' 
      ? (valueA > valueB ? 1 : -1) 
      : (valueA > valueB ? -1 : 1);
  });
}

/**
 * Type guard to check if a value is a Date object
 */
function isDateObject(value: any): value is Date {
  return value !== null && 
         typeof value === 'object' && 
         value instanceof Date && 
         !isNaN(value.getTime());
}

/**
 * Paginate an array of objects
 * @param data Array of objects to paginate
 * @param page Current page number (1-indexed)
 * @param pageSize Number of items per page
 * @returns Object containing paginated data and pagination info
 */
export function paginateData<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10
): {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
} {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
}

/**
 * Process data with filtering, sorting, and pagination in one operation
 * @param data Original data array
 * @param options Processing options
 * @returns Processed data with pagination information
 */
export function processData<T extends Record<string, any>>(
  data: T[],
  options: {
    searchText?: string;
    searchFields?: (keyof T)[];
    sortField?: keyof T;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }
): {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
} {
  const {
    searchText = '',
    searchFields = [],
    sortField,
    sortDirection = 'asc',
    page = 1,
    pageSize = 10,
  } = options;
  
  // Apply filtering
  let processedData = searchText && searchFields.length > 0
    ? filterData(data, searchText, searchFields)
    : [...data];
  
  // Apply sorting
  if (sortField) {
    processedData = sortData(processedData, sortField, sortDirection);
  }
  
  // Apply pagination
  return paginateData(processedData, page, pageSize);
}

/**
 * Group an array of objects by a specified field
 * @param data Array of objects to group
 * @param field Field to group by
 * @returns Object with keys as group values and values as arrays of items
 */
export function groupBy<T extends Record<string, any>>(
  data: T[],
  field: keyof T
): Record<string, T[]> {
  return data.reduce((acc, item) => {
    const key = String(item[field] || 'undefined');
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Calculate statistics for a numeric field in an array of objects
 * @param data Array of objects
 * @param field Numeric field to calculate statistics for
 * @returns Object containing min, max, sum, average, and count
 */
export function calculateStats<T extends Record<string, any>>(
  data: T[],
  field: keyof T
): {
  min: number;
  max: number;
  sum: number;
  average: number;
  count: number;
} {
  if (!data.length) {
    return { min: 0, max: 0, sum: 0, average: 0, count: 0 };
  }
  
  const validValues = data
    .map(item => item[field])
    .filter(value => typeof value === 'number' && !isNaN(value)) as number[];
  
  if (!validValues.length) {
    return { min: 0, max: 0, sum: 0, average: 0, count: 0 };
  }
  
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  
  return {
    min,
    max,
    sum,
    average: sum / validValues.length,
    count: validValues.length,
  };
} 