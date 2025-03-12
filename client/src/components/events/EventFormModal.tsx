import React from 'react';
import EventForm from './EventForm';
import { Event, FormEvent } from '../../types/event';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  onSubmit: (event: FormEvent) => void;
  isLoading?: boolean;
  error?: string;
  initialDate?: Date;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  event,
  onSubmit,
  isLoading = false,
  error,
  initialDate
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <EventForm
          event={event}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          error={error}
          initialDate={initialDate}
        />
      </div>
    </div>
  );
};

export default EventFormModal; 