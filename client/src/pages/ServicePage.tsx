import React, { useState } from 'react';
import ServiceBuilder from '../components/services/ServiceBuilder';
import { ServiceItemData } from '../components/services/ServiceItem';

// Sample service items for demonstration
const sampleServiceItems: ServiceItemData[] = [
  {
    id: 'item-1',
    type: 'song',
    title: 'Amazing Grace',
    details: 'Key: G, Worship Leader: Sarah',
    duration: 5,
    assignedTo: 'Worship Team',
  },
  {
    id: 'item-2',
    type: 'prayer',
    title: 'Opening Prayer',
    duration: 3,
    assignedTo: 'Pastor John',
  },
  {
    id: 'item-3',
    type: 'announcement',
    title: 'Weekly Announcements',
    details: 'Upcoming events and ministry updates',
    duration: 5,
    assignedTo: 'Ministry Coordinator',
    notes: 'Remember to mention the youth retreat next weekend',
  },
  {
    id: 'item-4',
    type: 'song',
    title: 'How Great Is Our God',
    details: 'Key: C, Worship Leader: Sarah',
    duration: 4,
    assignedTo: 'Worship Team',
  },
  {
    id: 'item-5',
    type: 'scripture',
    title: 'Scripture Reading',
    details: 'Romans 8:28-39',
    duration: 3,
    assignedTo: 'Elder Mike',
  },
  {
    id: 'item-6',
    type: 'sermon',
    title: 'Finding Peace in Troubled Times',
    details: 'Part 2 of the "Peace" series',
    duration: 30,
    assignedTo: 'Pastor John',
    notes: 'Main points: 1) God\'s presence brings peace, 2) Peace through prayer, 3) Sharing peace with others',
  },
  {
    id: 'item-7',
    type: 'song',
    title: 'It Is Well',
    details: 'Key: D, Worship Leader: Sarah',
    duration: 5,
    assignedTo: 'Worship Team',
  },
  {
    id: 'item-8',
    type: 'offering',
    title: 'Tithes and Offerings',
    duration: 5,
    assignedTo: 'Deacon Team',
  },
  {
    id: 'item-9',
    type: 'prayer',
    title: 'Closing Prayer',
    duration: 2,
    assignedTo: 'Pastor John',
  },
];

const ServicePage: React.FC = () => {
  const [serviceItems, setServiceItems] = useState<ServiceItemData[]>(sampleServiceItems);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveService = (items: ServiceItemData[]) => {
    setServiceItems(items);
    setIsSaved(true);
    
    // In a real app, you would save this to your backend
    console.log('Service saved:', items);
    
    // Reset the saved state after a delay
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary-800">Sunday Morning Service</h1>
        <p className="text-neutral-600">September 24, 2023 • 10:00 AM</p>
      </header>
      
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