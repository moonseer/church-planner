import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CogIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Types for dashboard widgets
export type WidgetType = 'calendar' | 'stats' | 'analytics' | 'volunteers' | 'songs' | 'messages' | 'custom';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  component: React.ReactNode;
  isVisible: boolean;
}

// Props for the CustomizableDashboard component
interface CustomizableDashboardProps {
  widgets: Widget[];
  onWidgetsChange: (widgets: Widget[]) => void;
}

const CustomizableDashboard = ({ widgets, onWidgetsChange }: CustomizableDashboardProps) => {
  const [items, setItems] = useState<Widget[]>(widgets);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  // Update items when widgets prop changes
  useEffect(() => {
    setItems(widgets);
  }, [widgets]);

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle DnD end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        onWidgetsChange(newItems);
        return newItems;
      });
    }
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (id: string) => {
    const newItems = items.map((item) => 
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    );
    setItems(newItems);
    onWidgetsChange(newItems);
  };

  // Change widget size
  const changeWidgetSize = (id: string, size: Widget['size']) => {
    const newItems = items.map((item) => 
      item.id === id ? { ...item, size } : item
    );
    setItems(newItems);
    onWidgetsChange(newItems);
  };

  // Get grid class based on widget size
  const getGridClass = (size: Widget['size']) => {
    switch (size) {
      case 'small':
        return 'col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3';
      case 'medium':
        return 'col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6';
      case 'large':
        return 'col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-9';
      case 'full':
        return 'col-span-12';
      default:
        return 'col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3';
    }
  };

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Dashboard</h1>
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-neutral-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isCustomizing ? (
            <>
              <XMarkIcon className="-ml-0.5 mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" aria-hidden="true" />
              Done
            </>
          ) : (
            <>
              <CogIcon className="-ml-0.5 mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" aria-hidden="true" />
              Customize
            </>
          )}
        </button>
      </div>

      {isCustomizing && (
        <div className="bg-primary-50 p-3 sm:p-4 rounded-lg border border-primary-200 mb-4">
          <h2 className="text-base sm:text-lg font-medium text-primary-800 mb-2">Dashboard Customization</h2>
          <p className="text-xs sm:text-sm text-primary-700 mb-4">Drag and drop widgets to reorder them. Toggle visibility or change size using the controls.</p>
          
          <div className="space-y-2">
            {items.map((widget) => (
              <div key={widget.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-2 sm:p-3 rounded-md shadow-sm">
                <div className="flex items-center mb-2 sm:mb-0">
                  <span className="font-medium text-sm sm:text-base text-neutral-900">{widget.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={widget.size}
                    onChange={(e) => changeWidgetSize(widget.id, e.target.value as Widget['size'])}
                    className="block w-20 sm:w-24 pl-2 sm:pl-3 pr-6 sm:pr-10 py-1 text-xs sm:text-sm border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="full">Full Width</option>
                  </select>
                  <div className="relative inline-block w-8 sm:w-10 mr-1 sm:mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id={`toggle-${widget.id}`}
                      checked={widget.isVisible}
                      onChange={() => toggleWidgetVisibility(widget.id)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`toggle-${widget.id}`}
                      className={`block overflow-hidden h-5 sm:h-6 rounded-full bg-neutral-200 cursor-pointer ${
                        widget.isVisible ? 'bg-primary-500' : 'bg-neutral-200'
                      }`}
                    >
                      <span
                        className={`block h-5 sm:h-6 w-5 sm:w-6 rounded-full bg-white shadow transform transition-transform ${
                          widget.isVisible ? 'translate-x-3 sm:translate-x-4' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
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
        <div className="grid grid-cols-12 gap-2 sm:gap-4">
          <SortableContext items={items.map(item => item.id)}>
            {items
              .filter(widget => widget.isVisible)
              .map(widget => (
                <SortableWidget 
                  key={widget.id} 
                  widget={widget} 
                  gridClass={getGridClass(widget.size)}
                  isCustomizing={isCustomizing}
                />
              ))
            }
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

// Sortable Widget Component
interface SortableWidgetProps {
  widget: Widget;
  gridClass: string;
  isCustomizing: boolean;
}

const SortableWidget = ({ widget, gridClass, isCustomizing }: SortableWidgetProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${gridClass} ${isCustomizing ? 'cursor-move' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="bg-white rounded-lg shadow overflow-hidden h-full">
        <div className="p-2 sm:p-4 border-b border-neutral-200">
          <h2 className="text-base sm:text-lg font-medium text-neutral-900">{widget.title}</h2>
        </div>
        <div className="p-2 sm:p-4 overflow-auto">
          {widget.component}
        </div>
      </div>
    </div>
  );
};

export default CustomizableDashboard; 