import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Church Planner</h1>
          <div className="flex items-center space-x-4">
            <button className="px-3 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors">
              New Service
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
              JD
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Calendar Widget */}
          <div className="bg-white p-6 rounded-lg shadow col-span-1 lg:col-span-2">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Calendar</h2>
            <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 h-64 flex items-center justify-center">
              <p className="text-neutral-500">Calendar widget will be displayed here</p>
            </div>
          </div>
          
          {/* Stats Widget */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-500">Upcoming Services</h3>
                <p className="text-2xl font-bold text-neutral-900">3</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-500">Active Volunteers</h3>
                <p className="text-2xl font-bold text-neutral-900">24</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-500">Songs in Library</h3>
                <p className="text-2xl font-bold text-neutral-900">156</p>
              </div>
            </div>
          </div>
          
          {/* Upcoming Services Widget */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Upcoming Services</h2>
            <div className="space-y-3">
              {[
                { name: 'Sunday Morning Service', date: 'March 12, 2023', status: 'Published' },
                { name: 'Wednesday Night Bible Study', date: 'March 15, 2023', status: 'Draft' },
                { name: 'Sunday Morning Service', date: 'March 19, 2023', status: 'Draft' }
              ].map((service, index) => (
                <div key={index} className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{service.name}</p>
                      <p className="text-sm text-neutral-500">{service.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      service.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions Widget */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Create Service', icon: '📅' },
                { name: 'Add Song', icon: '🎵' },
                { name: 'Schedule Team', icon: '👥' },
                { name: 'Send Message', icon: '✉️' }
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-md border border-neutral-200 hover:bg-neutral-100 transition-colors"
                >
                  <span className="text-2xl mb-2">{action.icon}</span>
                  <span className="text-sm font-medium text-neutral-900">{action.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App; 