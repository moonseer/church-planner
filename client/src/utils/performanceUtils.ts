/**
 * Performance utility functions for optimizing user interactions
 */

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 * Useful for functions that are expensive to run or cause layout reflows.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @param immediate Whether to invoke the function on the leading edge instead of the trailing edge
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every specified wait milliseconds.
 * Useful for limiting the rate at which a function can fire, such as during scrolling or resizing.
 * 
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @param options Additional options for controlling throttle behavior
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;
  const { leading = true, trailing = true } = options;
  
  return function(this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    const context = this;
    
    if (!previous && !leading) {
      previous = now;
    }
    
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      previous = now;
      func.apply(context, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

/**
 * Creates a function that will only execute once, no matter how many times it's called.
 * Useful for initialization code that should only run once.
 * 
 * @param func The function to execute once
 * @returns A function that will only execute once
 */
export function once<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let called = false;
  let result: ReturnType<T> | undefined;
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    if (!called) {
      called = true;
      result = func.apply(this, args);
    }
    return result;
  };
}

/**
 * Creates a memoized version of a function that caches the result based on the arguments provided.
 * Useful for expensive calculations that are called with the same arguments multiple times.
 * 
 * @param func The function to memoize
 * @param resolver Optional function to resolve the cache key from the arguments
 * @returns A memoized version of the function
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * Creates a function that will execute after a specified delay.
 * Useful for delaying operations without debouncing them.
 * 
 * @param func The function to delay
 * @param wait The number of milliseconds to delay
 * @returns A delayed version of the function
 */
export function delay<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return function(this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(func.apply(this, args));
      }, wait);
    });
  };
}

/**
 * Measures the execution time of a function.
 * Useful for performance testing and optimization.
 * 
 * @param func The function to measure
 * @param label Optional label for the console output
 * @returns A wrapped function that logs execution time
 */
export function measureExecutionTime<T extends (...args: any[]) => any>(
  func: T,
  label: string = 'Execution time'
): (...args: Parameters<T>) => ReturnType<T> {
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = func.apply(this, args);
    const end = performance.now();
    
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
    
    return result;
  };
} 