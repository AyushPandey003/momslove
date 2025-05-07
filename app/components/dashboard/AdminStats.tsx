'use client';

import { memo } from 'react';

interface StatsProps {
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

function AdminStatsComponent({ stats }: StatsProps) {
  const statItems = [
    {
      label: 'Total Stories',
      value: stats.total,
      bgColor: 'bg-blue-100 dark:bg-blue-800',
      textColor: 'text-blue-800 dark:text-blue-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      bgColor: 'bg-yellow-100 dark:bg-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Approved',
      value: stats.approved,
      bgColor: 'bg-green-100 dark:bg-green-800',
      textColor: 'text-green-800 dark:text-green-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      bgColor: 'bg-red-100 dark:bg-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`${item.bgColor} p-6 rounded-lg shadow-sm`}
        >
          <div className="flex items-center mb-2">
            <div className={`mr-3 ${item.textColor}`}>{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.label}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
const AdminStats = memo(AdminStatsComponent);
export default AdminStats; 