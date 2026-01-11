import React, { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Card, Spinner } from '../common';
import * as taskService from '../../Services/taskService';

const StatsCard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const result = await taskService.getTaskStats();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to fetch statistics');
      }
    } catch (error) {
      setError('Failed to load statistics');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'In Progress',
      value: stats?.['in-progress'] || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          Retry
        </button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const percentage = stats?.total 
          ? Math.round((stat.value / stats.total) * 100) 
          : 0;

        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {percentage}% of total
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.color.replace('500', '400')} rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCard;