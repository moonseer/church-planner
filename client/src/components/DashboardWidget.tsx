import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DashboardWidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  id,
  title,
  children,
  onRemove,
  className = '',
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow overflow-hidden ${className} ${
        isDragging ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="p-4 border-b border-neutral-200 flex justify-between items-center cursor-move bg-neutral-50"
      >
        <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-neutral-400 hover:text-neutral-600"
            aria-label="Remove widget"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default DashboardWidget; 