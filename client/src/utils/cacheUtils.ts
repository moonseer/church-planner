/**
 * Cache utilities for storing and retrieving data from localStorage
 * with expiration times to ensure data freshness.
 */

// Cache item interface with expiration time
interface CacheItem<T> {
  data: T;
  expiry: number; // Timestamp when the cache expires
}

/**
 * Set an item in the cache with an expiration time
 * @param key - The cache key
 * @param data - The data to cache
 * @param expiryMinutes - Minutes until the cache expires (default: 30)
 */
export const setCacheItem = <T>(key: string, data: T, expiryMinutes: number = 30): void => {
  try {
    const now = new Date();
    const expiry = now.getTime() + expiryMinutes * 60 * 1000;
    const cacheItem: CacheItem<T> = { data, expiry };
    localStorage.setItem(key, JSON.stringify(cacheItem));
    console.log(`Cached data for key: ${key}, expires in ${expiryMinutes} minutes`);
  } catch (error) {
    console.error('Error setting cache item:', error);
  }
};

/**
 * Get an item from the cache if it exists and hasn't expired
 * @param key - The cache key
 * @returns The cached data or null if not found or expired
 */
export const getCacheItem = <T>(key: string): T | null => {
  try {
    const cacheItemJson = localStorage.getItem(key);
    if (!cacheItemJson) {
      return null;
    }

    const cacheItem: CacheItem<T> = JSON.parse(cacheItemJson);
    const now = new Date().getTime();

    if (now > cacheItem.expiry) {
      // Cache has expired, remove it
      localStorage.removeItem(key);
      console.log(`Cache expired for key: ${key}`);
      return null;
    }

    console.log(`Retrieved cached data for key: ${key}`);
    return cacheItem.data;
  } catch (error) {
    console.error('Error getting cache item:', error);
    return null;
  }
};

/**
 * Remove an item from the cache
 * @param key - The cache key
 */
export const removeCacheItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
    console.log(`Removed cache for key: ${key}`);
  } catch (error) {
    console.error('Error removing cache item:', error);
  }
};

/**
 * Clear all cache items
 */
export const clearCache = (): void => {
  try {
    localStorage.clear();
    console.log('Cleared all cache items');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Generate a cache key for events based on church ID, month, and year
 * @param churchId - The church ID
 * @param month - The month (0-11)
 * @param year - The year
 * @returns The cache key
 */
export const generateEventsCacheKey = (churchId: string, month: number, year: number): string => {
  return `events_${churchId}_${month}_${year}`;
};

/**
 * Generate a cache key for services based on church ID, month, and year
 * @param churchId - The church ID
 * @param month - The month (0-11)
 * @param year - The year
 * @returns The cache key
 */
export const generateServicesCacheKey = (churchId: string, month?: number, year?: number): string => {
  if (month !== undefined && year !== undefined) {
    return `services_${churchId}_${month}_${year}`;
  }
  return `services_${churchId}_all`;
}; 