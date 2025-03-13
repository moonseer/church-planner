import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { debounce } from '../../utils/performanceUtils';

interface SearchInputProps {
  onSearch: (searchText: string) => void;
  placeholder?: string;
  initialValue?: string;
  debounceTime?: number;
  className?: string;
  autoFocus?: boolean;
  minLength?: number;
}

/**
 * A reusable search input component with debounced search functionality
 * to improve performance when typing quickly.
 */
const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'Search...',
  initialValue = '',
  debounceTime = 300,
  className = '',
  autoFocus = false,
  minLength = 0,
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  // Create a debounced version of the search handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      if (text.length >= minLength || text.length === 0) {
        onSearch(text);
      }
    }, debounceTime),
    [onSearch, minLength, debounceTime]
  );

  // Update search when input changes
  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText, debouncedSearch]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // Handle clear button click
  const handleClear = () => {
    setSearchText('');
    onSearch('');
  };

  // Handle focus events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div 
      className={`relative flex items-center ${className}`}
    >
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MagnifyingGlassIcon 
          className={`h-5 w-5 ${
            isFocused ? 'text-primary-500' : 'text-gray-400'
          }`} 
          aria-hidden="true" 
        />
      </div>
      
      <input
        type="text"
        value={searchText}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                  bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500"
        aria-label="Search"
      />
      
      {searchText && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default SearchInput; 