import React, { useState, useEffect } from 'react';
import { ServiceItemData, ServiceItemType } from './ServiceItem';

interface ServiceItemFormProps {
  item?: ServiceItemData;
  onSubmit: (item: ServiceItemData) => void;
  onCancel: () => void;
}

const ServiceItemForm: React.FC<ServiceItemFormProps> = ({
  item,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ServiceItemType>('custom');
  const [details, setDetails] = useState('');
  const [duration, setDuration] = useState(5);
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setType(item.type);
      setDetails(item.details || '');
      setDuration(item.duration);
      setAssignedTo(item.assignedTo || '');
      setNotes(item.notes || '');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: ServiceItemData = {
      id: item?.id || `item-${Date.now()}`,
      title,
      type,
      details: details || undefined,
      duration,
      assignedTo: assignedTo || undefined,
      notes: notes || undefined,
    };
    
    onSubmit(newItem);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {item ? 'Edit Service Item' : 'Add Service Item'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter title"
              required
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
              Type *
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ServiceItemType)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="song">Song</option>
              <option value="scripture">Scripture</option>
              <option value="prayer">Prayer</option>
              <option value="sermon">Sermon</option>
              <option value="announcement">Announcement</option>
              <option value="offering">Offering</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="details" className="block text-sm font-medium text-neutral-700 mb-1">
            Details
          </label>
          <input
            id="details"
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Additional details (e.g., song key, scripture reference)"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-neutral-700 mb-1">
              Duration (minutes) *
            </label>
            <input
              id="duration"
              type="number"
              min="1"
              max="120"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="assigned-to" className="block text-sm font-medium text-neutral-700 mb-1">
              Assigned To
            </label>
            <input
              id="assigned-to"
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Person responsible"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Additional notes or instructions"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {item ? 'Update' : 'Add'} Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceItemForm; 