import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageNumbers?: boolean;
  showJumpToPage?: boolean;
}

/**
 * A component for pagination that allows users to navigate through large datasets
 * with page numbers, previous/next buttons, and the ability to jump to a specific page.
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showPageNumbers = true,
  showJumpToPage = false,
}) => {
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page);
  };

  // Generate page numbers to display
  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pageNumbers.push(-1); // -1 represents ellipsis
    }
    
    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push(-2); // -2 represents ellipsis
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Handle jump to page input
  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(e.currentTarget.value);
      if (!isNaN(page)) {
        handlePageChange(page);
      }
      e.currentTarget.value = '';
    }
  };

  // If there's only one page or less, don't show pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div className="flex items-center">
          {showJumpToPage && (
            <div className="mr-4">
              <label htmlFor="jump-to-page" className="sr-only">
                Jump to page
              </label>
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Go to:</span>
                <input
                  id="jump-to-page"
                  type="number"
                  min={1}
                  max={totalPages}
                  onKeyDown={handleJumpToPage}
                  className="w-16 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          )}
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {showPageNumbers &&
              getPageNumbers().map((pageNumber, index) => {
                // Render ellipsis
                if (pageNumber < 0) {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }
                
                // Render page number
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === pageNumber
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination; 