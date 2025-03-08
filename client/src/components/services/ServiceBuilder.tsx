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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ServiceItem, { ServiceItemData } from './ServiceItem';
import ServiceItemForm from './ServiceItemForm';

interface ServiceBuilderProps {
  initialItems?: ServiceItemData[];
  onSave?: (items: ServiceItemData[]) => void;
}

const ServiceBuilder: React.FC<ServiceBuilderProps> = ({
  initialItems = [],
  onSave,
}) => {
  const [items, setItems] = useState<ServiceItemData[]>(initialItems);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItemData | undefined>(undefined);
  const [totalDuration, setTotalDuration] = useState(
    initialItems.reduce((total, item) => total + item.duration, 0)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddItem = (item: ServiceItemData) => {
    setItems((prevItems) => [...prevItems, item]);
    setTotalDuration((prev) => prev + item.duration);
    setIsAddingItem(false);
  };

  const handleUpdateItem = (updatedItem: ServiceItemData) => {
    setItems((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === updatedItem.id);
      const oldDuration = prevItems[index].duration;
      const newItems = [...prevItems];
      newItems[index] = updatedItem;
      
      setTotalDuration((prev) => prev - oldDuration + updatedItem.duration);
      
      return newItems;
    });
    
    setEditingItem(undefined);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => {
      const itemToDelete = prevItems.find((item) => item.id === id);
      if (itemToDelete) {
        setTotalDuration((prev) => prev - itemToDelete.duration);
      }
      
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(items);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-neutral-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Service Builder</h2>
            <p className="text-sm text-neutral-500">
              Total Duration: {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAddingItem(true)}
              className="px-3 py-1 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm flex items-center"
              disabled={isAddingItem || !!editingItem}
            >
              Add Item
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
            </button>
            
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors text-sm"
              disabled={isAddingItem || !!editingItem}
            >
              Save Service
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {(isAddingItem || editingItem) && (
          <div className="mb-6">
            <ServiceItemForm
              item={editingItem}
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              onCancel={() => {
                setIsAddingItem(false);
                setEditingItem(undefined);
              }}
            />
          </div>
        )}
        
        <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
          <h3 className="text-lg font-medium mb-4">Service Items</h3>
          
          {items.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <p>No items added yet. Click "Add Item" to start building your service.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                <div>
                  {items.map((item) => (
                    <ServiceItem
                      key={item.id}
                      item={item}
                      onEdit={setEditingItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceBuilder; 