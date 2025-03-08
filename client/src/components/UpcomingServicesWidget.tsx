import React from 'react';

interface Service {
  id: string;
  name: string;
  date: Date;
  status: 'draft' | 'published' | 'completed';
  teamCount?: number;
}

interface UpcomingServicesWidgetProps {
  services: Service[];
}

const UpcomingServicesWidget: React.FC<UpcomingServicesWidgetProps> = ({ services }) => {
  const getStatusClass = (status: Service['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-3">
      {services.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <p>No upcoming services</p>
        </div>
      ) : (
        services.map((service) => (
          <div
            key={service.id}
            className="bg-neutral-50 p-3 rounded-md border border-neutral-200 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium text-neutral-900">{service.name}</p>
                <p className="text-sm text-neutral-500">{formatDate(service.date)}</p>
                {service.teamCount !== undefined && (
                  <p className="text-xs text-neutral-500">
                    {service.teamCount} team members scheduled
                  </p>
                )}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full h-fit ${getStatusClass(
                  service.status
                )}`}
              >
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </span>
            </div>
          </div>
        ))
      )}
      
      <button className="w-full py-2 text-sm text-primary-600 hover:text-primary-800 font-medium">
        View All Services
      </button>
    </div>
  );
};

export default UpcomingServicesWidget; 