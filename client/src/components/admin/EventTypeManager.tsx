import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { 
  getEventTypes, 
  createEventType, 
  updateEventType, 
  deleteEventType, 
  seedDefaultEventTypes 
} from '../../services/eventTypeService';
import { EventTypeDefinition, EventTypeFormData } from '../../types/event';
import { getEventClass } from '../../utils/eventColors';

const EventTypeManager: React.FC = () => {
  const [eventTypes, setEventTypes] = useState<EventTypeDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEventType, setEditingEventType] = useState<EventTypeDefinition | null>(null);
  const [formData, setFormData] = useState<EventTypeFormData>({
    name: '',
    code: '',
    color: '#4F46E5',
    icon: ''
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  // Fetch event types on component mount
  useEffect(() => {
    fetchEventTypes();
  }, []);

  // Fetch event types from the API
  const fetchEventTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEventTypes();
      setEventTypes(data);
    } catch (err) {
      setError('Failed to load event types. Please try again.');
      console.error('Error fetching event types:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open form for creating a new event type
  const handleAddNew = () => {
    setFormData({
      name: '',
      code: '',
      color: '#4F46E5',
      icon: ''
    });
    setEditingEventType(null);
    setIsFormOpen(true);
  };

  // Open form for editing an existing event type
  const handleEdit = (eventType: EventTypeDefinition) => {
    setFormData({
      name: eventType.name,
      code: eventType.code,
      color: eventType.color,
      icon: eventType.icon || ''
    });
    setEditingEventType(eventType);
    setIsFormOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (editingEventType) {
        // Update existing event type
        await updateEventType(editingEventType.id, formData);
      } else {
        // Create new event type
        await createEventType(formData);
      }
      
      // Refresh the list
      await fetchEventTypes();
      
      // Close the form
      setIsFormOpen(false);
      setEditingEventType(null);
      
    } catch (err: any) {
      setError(err.message || 'Failed to save event type. Please try again.');
      console.error('Error saving event type:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle event type deletion
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteEventType(id);
      
      // Refresh the list
      await fetchEventTypes();
      
      // Clear delete confirmation
      setDeleteConfirmation(null);
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete event type. Please try again.');
      console.error('Error deleting event type:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle seeding default event types
  const handleSeedDefaults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await seedDefaultEventTypes();
      
      // Refresh the list
      await fetchEventTypes();
      
    } catch (err: any) {
      setError(err.message || 'Failed to seed default event types. Please try again.');
      console.error('Error seeding default event types:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate a code from the name
  const generateCode = () => {
    const code = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')          // Replace spaces with hyphens
      .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
      .substring(0, 20);             // Limit to 20 characters
    
    setFormData(prev => ({ ...prev, code }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Event Types</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleSeedDefaults}
            className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors"
            disabled={loading}
          >
            Restore Defaults
          </button>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center"
            disabled={loading}
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add New
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {loading && !isFormOpen ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventTypes.map((eventType) => (
                <tr key={eventType.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="h-6 w-6 rounded-full border border-gray-300" 
                        style={{ backgroundColor: eventType.color }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {eventType.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {eventType.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${eventType.isDefault ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {eventType.isDefault ? 'Default' : 'Custom'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(eventType)}
                        className="text-indigo-600 hover:text-indigo-900"
                        disabled={loading}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      {!eventType.isDefault && (
                        <button
                          onClick={() => setDeleteConfirmation(eventType.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {eventTypes.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No event types found. Click "Add New" to create one or "Restore Defaults" to add the default types.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Event Type Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingEventType ? 'Edit Event Type' : 'Create Event Type'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => !formData.code && generateCode()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  disabled={loading || (editingEventType?.isDefault || false)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Code * <span className="text-xs text-gray-500">(Used in API and code)</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    pattern="[a-z0-9\-]+"
                    title="Only lowercase letters, numbers, and hyphens are allowed"
                    disabled={loading || (editingEventType?.isDefault || false)}
                  />
                  {!editingEventType?.isDefault && (
                    <button
                      type="button"
                      onClick={generateCode}
                      className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      disabled={loading || !formData.name}
                    >
                      Generate
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Only lowercase letters, numbers, and hyphens are allowed
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color *
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="h-10 w-10 border border-gray-300 rounded-md cursor-pointer"
                    required
                  />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="ml-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    title="Must be a valid hex color code (e.g., #FF0000)"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  Icon <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview
                </label>
                <div className="flex items-center space-x-2">
                  <div 
                    className={`px-3 py-1 rounded-md ${getEventClass({ id: '0', name: formData.name, code: formData.code, color: formData.color })}`}
                  >
                    {formData.name || 'Event Type'}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </span>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete this event type? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTypeManager; 