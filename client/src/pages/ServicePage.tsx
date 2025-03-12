import React, { useState, useEffect } from 'react';
import ServiceBuilder from '../components/services/ServiceBuilder';
import { ServiceItemData } from '../components/services/ServiceItem';
import { getServices, createService, updateService, seedServices, Service as ServiceType } from '../services/serviceService';
import { format, parseISO, getMonth, getYear } from 'date-fns';

const ServicePage: React.FC = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [currentService, setCurrentService] = useState<ServiceType | null>(null);
  const [serviceItems, setServiceItems] = useState<ServiceItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('Sunday Morning Service');
  const [newServiceDate, setNewServiceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newServiceTime, setNewServiceTime] = useState('10:00 AM - 11:30 AM');
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth());
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [isFilteringByMonth, setIsFilteringByMonth] = useState(true);

  // For demo purposes, we'll use a hardcoded church ID
  // In a real app, you'd get this from user context or auth state
  const churchId = '65ef1234abcd5678ef901234'; // Replace with a real church ID

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch services from API
        const response = await getServices(
          churchId,
          isFilteringByMonth ? filterMonth : undefined,
          isFilteringByMonth ? filterYear : undefined
        );
        
        if (response.success && response.data && response.data.length > 0) {
          // Set services and current service
          setServices(response.data);
          setCurrentService(response.data[0]);
          setServiceItems(response.data[0].items);
        } else {
          console.log('No services found, trying to seed services');
          // If no services, try to seed the database
          try {
            const seedResponse = await seedServices(churchId);
            if (seedResponse.success && seedResponse.data && seedResponse.data.length > 0) {
              setServices(seedResponse.data);
              setCurrentService(seedResponse.data[0]);
              setServiceItems(seedResponse.data[0].items);
            } else {
              setError('No services found and failed to seed services.');
            }
          } catch (seedError) {
            console.error('Error seeding services:', seedError);
            setError('Failed to seed services. Please try again later.');
          }
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to fetch services. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [churchId, filterMonth, filterYear, isFilteringByMonth]);

  const handleServiceChange = (serviceId: string) => {
    const selectedService = services.find(service => service.id === serviceId);
    if (selectedService) {
      setCurrentService(selectedService);
      setServiceItems(selectedService.items);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setIsFilteringByMonth(false);
    } else {
      const [year, month] = value.split('-').map(Number);
      setFilterYear(year);
      setFilterMonth(month);
      setIsFilteringByMonth(true);
    }
  };

  const handleCreateNewService = async () => {
    setIsSaving(true);
    
    try {
      // Create new service
      const serviceData = {
        title: newServiceTitle,
        date: new Date(newServiceDate).toISOString(),
        time: newServiceTime,
        items: []
      };
      
      const response = await createService(churchId, serviceData);
      
      if (response.success && response.data) {
        // Add new service to list
        setServices(prevServices => [...prevServices, response.data!]);
        setCurrentService(response.data);
        setServiceItems([]);
        setIsSaved(true);
        setIsCreatingNew(false);
        
        // Update filter to show the month of the new service
        const newServiceMonth = getMonth(parseISO(response.data.date));
        const newServiceYear = getYear(parseISO(response.data.date));
        setFilterMonth(newServiceMonth);
        setFilterYear(newServiceYear);
        setIsFilteringByMonth(true);
      } else {
        setError(response.message || 'Failed to create service');
      }
    } catch (err) {
      console.error('Error creating service:', err);
      setError('An error occurred while creating the service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveService = async (items: ServiceItemData[]) => {
    setIsSaving(true);
    
    try {
      if (currentService) {
        // Update existing service
        const serviceData = {
          title: currentService.title,
          date: currentService.date,
          time: currentService.time,
          items
        };
        
        const response = await updateService(currentService.id, serviceData);
        
        if (response.success && response.data) {
          // Update services list
          setServices(prevServices => 
            prevServices.map(service => 
              service.id === currentService.id ? response.data! : service
            )
          );
          setServiceItems(items);
          setIsSaved(true);
        } else {
          setError(response.message || 'Failed to update service');
        }
      } else {
        // Create new service
        const today = new Date();
        const serviceData = {
          title: `Sunday Morning Service`,
          date: today.toISOString(),
          time: '10:00 AM - 11:30 AM',
          items
        };
        
        const response = await createService(churchId, serviceData);
        
        if (response.success && response.data) {
          // Add new service to list
          setServices(prevServices => [...prevServices, response.data!]);
          setCurrentService(response.data);
          setServiceItems(items);
          setIsSaved(true);
        } else {
          setError(response.message || 'Failed to create service');
        }
      }
    } catch (err) {
      console.error('Error saving service:', err);
      setError('An error occurred while saving the service');
    } finally {
      setIsSaving(false);
      
      // Reset the saved state after a delay
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }
  };

  // Generate month options for the filter
  const getMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const options = [];
    
    // Add "All Services" option
    options.push(
      <option key="all" value="all">
        All Services
      </option>
    );
    
    // Add current month and previous 11 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentDate.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const value = `${year}-${month}`;
      const label = format(date, 'MMMM yyyy');
      
      options.push(
        <option key={value} value={value}>
          {label}
        </option>
      );
    }
    
    return options;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-800">
            {currentService ? currentService.title : 'New Service'}
          </h1>
          <p className="text-neutral-600">
            {currentService 
              ? `${format(parseISO(currentService.date), 'MMMM d, yyyy')} • ${currentService.time}`
              : format(new Date(), 'MMMM d, yyyy')
            }
          </p>
        </div>
        
        <div className="flex space-x-2">
          {/* Month filter */}
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white border border-neutral-300 hover:border-neutral-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={isFilteringByMonth ? `${filterYear}-${filterMonth}` : 'all'}
              onChange={handleFilterChange}
            >
              {getMonthOptions()}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          {/* Service selector */}
          {services.length > 0 && (
            <div className="relative">
              <select
                className="block appearance-none w-full bg-white border border-neutral-300 hover:border-neutral-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={currentService?.id || ''}
                onChange={(e) => handleServiceChange(e.target.value)}
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title} - {format(parseISO(service.date), 'MMM d, yyyy')}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          )}
          
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setIsCreatingNew(true)}
          >
            New Service
          </button>
        </div>
      </div>
      
      {isCreatingNew && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="title">
                Service Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder="Sunday Morning Service"
                value={newServiceTitle}
                onChange={(e) => setNewServiceTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="date">
                Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                id="date"
                type="date"
                value={newServiceDate}
                onChange={(e) => setNewServiceDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="time">
                Time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-700 leading-tight focus:outline-none focus:shadow-outline"
                id="time"
                type="text"
                placeholder="10:00 AM - 11:30 AM"
                value={newServiceTime}
                onChange={(e) => setNewServiceTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="bg-neutral-300 hover:bg-neutral-400 text-neutral-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setIsCreatingNew(false)}
            >
              Cancel
            </button>
            <button
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleCreateNewService}
              disabled={isSaving}
            >
              {isSaving ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </div>
      )}
      
      {isSaved && (
        <div className="mb-6 p-3 bg-green-100 text-green-800 rounded-md">
          Service plan saved successfully!
        </div>
      )}
      
      <ServiceBuilder
        initialItems={serviceItems}
        onSave={handleSaveService}
      />
    </div>
  );
};

export default ServicePage; 