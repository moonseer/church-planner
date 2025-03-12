import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CreateEventButtonProps {
  onClick: () => void;
  className?: string;
}

const CreateEventButton: React.FC<CreateEventButtonProps> = ({ 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${className}`}
      style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50 }}
      aria-label="Create Event"
      title="Create New Event"
    >
      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
      Create Event
    </button>
  );
};

export default CreateEventButton; 