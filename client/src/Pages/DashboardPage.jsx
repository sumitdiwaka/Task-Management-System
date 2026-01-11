import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { StatsCard, TaskList, SearchAndFilter, TaskCalendar } from '../components/dashboard';

const DashboardPage = () => {
  const [activeView, setActiveView] = useState('list');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    sort: '-createdAt',
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage your tasks and projects</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeView === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeView === 'calendar'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <StatsCard />

        {/* Search and Filters */}
        <SearchAndFilter 
          filters={filters} 
          onFilterChange={setFilters} 
        />

        {/* Task View */}
        {activeView === 'list' ? (
          <TaskList filters={filters} />
        ) : (
          <TaskCalendar />
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;