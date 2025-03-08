import { useState } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  MusicalNoteIcon, 
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Types for analytics data
interface AnalyticsData {
  serviceAttendance: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  volunteerParticipation: {
    labels: string[];
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  };
  songUsage: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      tension: number;
    }[];
  };
  stats: {
    totalServices: number;
    totalServicesChange: number;
    activeVolunteers: number;
    activeVolunteersChange: number;
    songsUsed: number;
    songsUsedChange: number;
    averageAttendance: number;
    averageAttendanceChange: number;
  };
}

// Props for the AnalyticsWidgets component
interface AnalyticsWidgetsProps {
  data: AnalyticsData;
  onTimeRangeChange: (range: string) => void;
}

const AnalyticsWidgets = ({ data, onTimeRangeChange }: AnalyticsWidgetsProps) => {
  const [timeRange, setTimeRange] = useState<string>('month');

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    onTimeRangeChange(range);
  };

  // Options for the charts
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Services" 
          value={data.stats.totalServices} 
          change={data.stats.totalServicesChange} 
          icon={<CalendarIcon className="h-6 w-6 text-primary-500" />} 
        />
        <StatCard 
          title="Active Volunteers" 
          value={data.stats.activeVolunteers} 
          change={data.stats.activeVolunteersChange} 
          icon={<UsersIcon className="h-6 w-6 text-secondary-500" />} 
        />
        <StatCard 
          title="Songs Used" 
          value={data.stats.songsUsed} 
          change={data.stats.songsUsedChange} 
          icon={<MusicalNoteIcon className="h-6 w-6 text-accent-500" />} 
        />
        <StatCard 
          title="Avg. Attendance" 
          value={data.stats.averageAttendance} 
          change={data.stats.averageAttendanceChange} 
          icon={<ChartBarIcon className="h-6 w-6 text-green-500" />} 
        />
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => handleTimeRangeChange('week')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'week'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            } border border-neutral-300 rounded-l-md`}
          >
            Week
          </button>
          <button
            onClick={() => handleTimeRangeChange('month')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'month'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            } border-t border-b border-neutral-300`}
          >
            Month
          </button>
          <button
            onClick={() => handleTimeRangeChange('quarter')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'quarter'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            } border-t border-b border-neutral-300`}
          >
            Quarter
          </button>
          <button
            onClick={() => handleTimeRangeChange('year')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'year'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            } border border-neutral-300 rounded-r-md`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Attendance Chart */}
        <ChartCard title="Service Attendance">
          <Bar data={data.serviceAttendance} options={barOptions} />
        </ChartCard>

        {/* Volunteer Participation Chart */}
        <ChartCard title="Volunteer Participation by Ministry">
          <Doughnut 
            data={{
              labels: data.volunteerParticipation.labels,
              datasets: [{
                data: data.volunteerParticipation.data,
                backgroundColor: data.volunteerParticipation.backgroundColor,
                borderColor: data.volunteerParticipation.borderColor,
                borderWidth: data.volunteerParticipation.borderWidth,
              }]
            }} 
            options={doughnutOptions} 
          />
        </ChartCard>

        {/* Song Usage Chart */}
        <ChartCard title="Song Usage Trends">
          <Line data={data.songUsage} options={lineOptions} />
        </ChartCard>

        {/* Placeholder for future chart */}
        <ChartCard title="Volunteer Availability">
          <div className="flex items-center justify-center h-64 bg-neutral-50 rounded-lg border border-dashed border-neutral-300">
            <div className="text-center">
              <ChartBarIcon className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-sm font-medium text-neutral-900">No data available</h3>
              <p className="mt-1 text-sm text-neutral-500">Start tracking volunteer availability to see data here.</p>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-neutral-500 truncate">{title}</dt>
            <dd>
              <div className="flex items-baseline">
                <div className="text-2xl font-semibold text-neutral-900">{value}</div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
                  )}
                  <span className="ml-1">{Math.abs(change)}%</span>
                </div>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

// Chart Card Component
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default AnalyticsWidgets; 