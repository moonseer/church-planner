import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type ServiceItemType = 'song' | 'scripture' | 'prayer' | 'sermon' | 'announcement' | 'offering' | 'custom';

export interface ServiceItemData {
  id: string;
  type: ServiceItemType;
  title: string;
  details?: string;
  duration: number; // in minutes
  assignedTo?: string;
  notes?: string;
}

interface ServiceItemProps {
  item: ServiceItemData;
  onEdit: (item: ServiceItemData) => void;
  onDelete: (id: string) => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ item, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const getItemIcon = (type: ServiceItemType) => {
    switch (type) {
      case 'song':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      case 'scripture':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'prayer':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
        );
      case 'sermon':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'announcement':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      case 'offering':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        );
    }
  };

  const getItemColor = (type: ServiceItemType) => {
    switch (type) {
      case 'song':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'scripture':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'prayer':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'sermon':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'announcement':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'offering':
        return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-md mb-2 ${getItemColor(item.type)} ${
        isDragging ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="p-3 flex items-center cursor-move"
      >
        <div className="flex-shrink-0 mr-3">
          {getItemIcon(item.type)}
        </div>
        
        <div className="flex-grow">
          <h3 className="font-medium">{item.title}</h3>
          {item.details && (
            <p className="text-sm opacity-75">{item.details}</p>
          )}
          <div className="flex items-center text-xs mt-1 space-x-3">
            <span>{item.duration} min</span>
            {item.assignedTo && <span>Assigned: {item.assignedTo}</span>}
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-2 space-x-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1 rounded-md hover:bg-white/50"
            aria-label="Edit item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 rounded-md hover:bg-white/50"
            aria-label="Delete item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {item.notes && (
        <div className="px-3 py-2 border-t border-dashed border-current/30 text-sm">
          <p className="opacity-75">{item.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ServiceItem; 