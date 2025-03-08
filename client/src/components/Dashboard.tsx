import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import DashboardWidget from './DashboardWidget';

export interface Widget {
  id: string;
  title: string;
  type: string;
  content: React.ReactNode;
  size: 'small' | 'medium' | 'large';
}

interface DashboardProps {
  widgets: Widget[];
  onWidgetsChange?: (widgets: Widget[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  widgets: initialWidgets,
  onWidgetsChange,
}) => {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [availableWidgets, setAvailableWidgets] = useState<Widget[]>([]);
  const [isAddingWidget, setIsAddingWidget] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newWidgets = arrayMove(items, oldIndex, newIndex);
        if (onWidgetsChange) {
          onWidgetsChange(newWidgets);
        }
        return newWidgets;
      });
    }
  };

  const handleRemoveWidget = (id: string) => {
    const widgetToRemove = widgets.find((widget) => widget.id === id);
    
    if (widgetToRemove) {
      setWidgets((prevWidgets) => {
        const newWidgets = prevWidgets.filter((widget) => widget.id !== id);
        if (onWidgetsChange) {
          onWidgetsChange(newWidgets);
        }
        return newWidgets;
      });
      
      setAvailableWidgets((prev) => [...prev, widgetToRemove]);
    }
  };

  const handleAddWidget = (widget: Widget) => {
    setWidgets((prev) => {
      const newWidgets = [...prev, widget];
      if (onWidgetsChange) {
        onWidgetsChange(newWidgets);
      }
      return newWidgets;
    });
    
    setAvailableWidgets((prev) => 
      prev.filter((w) => w.id !== widget.id)
    );
    
    setIsAddingWidget(false);
  };

  const getSizeClass = (size: Widget['size']) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-2';
      case 'large':
        return 'col-span-3';
      default:
        return 'col-span-1';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-neutral-800">Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsAddingWidget(!isAddingWidget)}
            className="px-3 py-1 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm flex items-center"
          >
            {isAddingWidget ? 'Cancel' : 'Add Widget'}
            {!isAddingWidget && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isAddingWidget && availableWidgets.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-medium mb-3">Available Widgets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableWidgets.map((widget) => (
              <div
                key={widget.id}
                className="border border-neutral-200 rounded-md p-3 hover:bg-neutral-50 cursor-pointer"
                onClick={() => handleAddWidget(widget)}
              >
                <h4 className="font-medium">{widget.title}</h4>
                <p className="text-sm text-neutral-500">{widget.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <DashboardWidget
                key={widget.id}
                id={widget.id}
                title={widget.title}
                onRemove={() => handleRemoveWidget(widget.id)}
                className={getSizeClass(widget.size)}
              >
                {widget.content}
              </DashboardWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Dashboard; 