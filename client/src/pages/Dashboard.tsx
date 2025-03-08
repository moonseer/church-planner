import { CalendarIcon, UserGroupIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'

const stats = [
  { name: 'Upcoming Services', stat: '3', icon: CalendarIcon, color: 'bg-primary-500' },
  { name: 'Active Volunteers', stat: '24', icon: UserGroupIcon, color: 'bg-secondary-500' },
  { name: 'Songs in Library', stat: '156', icon: MusicalNoteIcon, color: 'bg-accent-500' },
]

const upcomingServices = [
  { id: 1, name: 'Sunday Morning Service', date: 'March 12, 2023', time: '10:00 AM', status: 'Published' },
  { id: 2, name: 'Wednesday Night Bible Study', date: 'March 15, 2023', time: '7:00 PM', status: 'Draft' },
  { id: 3, name: 'Sunday Morning Service', date: 'March 19, 2023', time: '10:00 AM', status: 'Draft' },
]

const pendingResponses = [
  { id: 1, name: 'John Smith', role: 'Worship Leader', service: 'Sunday Morning Service', date: 'March 12, 2023' },
  { id: 2, name: 'Sarah Johnson', role: 'Vocalist', service: 'Sunday Morning Service', date: 'March 12, 2023' },
  { id: 3, name: 'Michael Brown', role: 'Sound Tech', service: 'Wednesday Night Bible Study', date: 'March 15, 2023' },
]

const Dashboard = () => {
  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-6 text-neutral-900">Dashboard</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            className="btn btn-primary"
          >
            Create New Service
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="card overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${item.color}`}>
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-neutral-900">{item.stat}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Services */}
      <h2 className="mt-8 text-lg font-medium leading-6 text-neutral-900">Upcoming Services</h2>
      <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-neutral-300">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6">
                Service
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                Time
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {upcomingServices.map((service) => (
              <tr key={service.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                  {service.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{service.date}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{service.time}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    service.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {service.status}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <a href="#" className="text-primary-600 hover:text-primary-900">
                    Edit<span className="sr-only">, {service.name}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending Volunteer Responses */}
      <h2 className="mt-8 text-lg font-medium leading-6 text-neutral-900">Pending Volunteer Responses</h2>
      <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-neutral-300">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6">
                Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                Role
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                Service
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                Date
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {pendingResponses.map((response) => (
              <tr key={response.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                  {response.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{response.role}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{response.service}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{response.date}</td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button className="text-primary-600 hover:text-primary-900 mr-4">
                    Remind
                  </button>
                  <button className="text-neutral-600 hover:text-neutral-900">
                    Reassign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard 