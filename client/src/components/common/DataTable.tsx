import React, { useState, useEffect, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { processData } from '../../utils/dataUtils';
import Pagination from './Pagination';
import SearchInput from './SearchInput';
import ErrorMessage from './ErrorMessage';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  className?: string;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  initialSortField?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
  pageSize?: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  errorMessage?: string;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  className?: string;
  rowClassName?: string | ((item: T) => string);
}

/**
 * A reusable data table component with sorting, filtering, and pagination
 */
function DataTable<T extends Record<string, any>>({
  data,
  columns,
  initialSortField,
  initialSortDirection = 'asc',
  pageSize = 10,
  showSearch = true,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  errorMessage = '',
  isLoading = false,
  onRowClick,
  className = '',
  rowClassName = '',
}: DataTableProps<T>) {
  // State for sorting
  const [sortField, setSortField] = useState<keyof T | undefined>(initialSortField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for search
  const [searchText, setSearchText] = useState('');
  
  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);
  
  // Get searchable fields from columns
  const searchFields = useMemo(() => {
    return columns
      .filter(column => column.searchable !== false)
      .map(column => column.key);
  }, [columns]);
  
  // Process data with filtering, sorting, and pagination
  const processedData = useMemo(() => {
    try {
      return processData(data, {
        searchText,
        searchFields,
        sortField,
        sortDirection,
        page: currentPage,
        pageSize,
      });
    } catch (error) {
      console.error('Error processing table data:', error);
      return {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          pageSize,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  }, [data, searchText, searchFields, sortField, sortDirection, currentPage, pageSize]);
  
  // Handle sort click
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
    // Reset to first page when sort changes
    setCurrentPage(1);
  };
  
  // Handle search
  const handleSearch = (text: string) => {
    setSearchText(text);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Get row class name
  const getRowClassName = (item: T): string => {
    const baseClass = 'hover:bg-gray-50 dark:hover:bg-gray-700';
    
    if (typeof rowClassName === 'function') {
      return `${baseClass} ${rowClassName(item)}`;
    }
    
    return `${baseClass} ${rowClassName}`;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden ${className}`}>
        <div className="p-4 flex justify-center items-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (errorMessage) {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden ${className}`}>
        <div className="p-4">
          <ErrorMessage message={errorMessage} severity="error" />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden ${className}`}>
      {/* Search input */}
      {showSearch && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SearchInput
            onSearch={handleSearch}
            placeholder={searchPlaceholder}
            className="w-full max-w-md"
          />
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer select-none' : ''
                  } ${column.className || ''}`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable !== false && sortField === column.key && (
                      sortDirection === 'asc' 
                        ? <ChevronUpIcon className="h-4 w-4" /> 
                        : <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {processedData.data.length > 0 ? (
              processedData.data.map((item, index) => (
                <tr
                  key={index}
                  className={getRowClassName(item)}
                  onClick={() => onRowClick && onRowClick(item)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => (
                    <td
                      key={`${index}-${column.key.toString()}`}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]?.toString() || ''}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {processedData.pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={processedData.pagination.currentPage}
            totalPages={processedData.pagination.totalPages}
            onPageChange={handlePageChange}
            showJumpToPage={true}
          />
        </div>
      )}
    </div>
  );
}

export default DataTable;