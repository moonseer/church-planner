import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

interface StatsWidgetProps {
  stats: StatItem[];
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-neutral-50 p-4 rounded-md border border-neutral-200"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-500">{stat.label}</h3>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              
              {stat.change !== undefined && (
                <p className={`text-xs flex items-center ${
                  stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change >= 0 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586V7a1 1 0 112 0v5a1 1 0 01-1 1h-5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {Math.abs(stat.change)}% from last month
                </p>
              )}
            </div>
            
            {stat.icon && (
              <div className="text-primary-600">{stat.icon}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsWidget; 