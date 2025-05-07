'use server';

import { getStories } from '@/app/lib/stories';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import heavy components with loading fallbacks
const AdminStoryList = dynamic(() => import("@/app/components/dashboard/StoryList"), {
  loading: () => <StoryListSkeleton />,
});

const AdminStats = dynamic(() => import("@/app/components/dashboard/AdminStats"), {
  loading: () => <StatsSkeleton />,
});

// Skeleton loaders for dynamically imported components
function StoryListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm h-32">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}

// Stories section wrapped in Suspense
async function StoriesSection() {
  const pendingStories = await getStories('pending');
  const approvedStories = await getStories('approved');
  const rejectedStories = await getStories('rejected');

  const stats = {
    pending: pendingStories.length,
    approved: approvedStories.length,
    rejected: rejectedStories.length,
    total: pendingStories.length + approvedStories.length + rejectedStories.length,
  };

  return (
    <>
      <Suspense fallback={<StatsSkeleton />}>
        <AdminStats stats={stats} />
      </Suspense>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">All Stories</h2>
        
        {/* Tabs for filtering */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px space-x-8">
            {[
              { label: 'All', count: stats.total, href: '/admin/stories' },
              { label: 'Pending', count: stats.pending, href: '/admin/stories?status=pending' },
              { label: 'Approved', count: stats.approved, href: '/admin/stories?status=approved' },
              { label: 'Rejected', count: stats.rejected, href: '/admin/stories?status=rejected' },
            ].map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                {tab.label}
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-700">
                  {tab.count}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        
        <Suspense fallback={<StoryListSkeleton />}>
          <AdminStoryList stories={pendingStories} loading={false} error={null} />
        </Suspense>
      </div>
    </>
  );
}

export default async function AdminStoriesPage() {
  const session = await auth();
  
  // Check if user is authenticated and is an admin
  if (!session?.user?.admin) {
    redirect('/');
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Story Management</h1>
      </div>
      
      <Suspense fallback={<div>Loading stories...</div>}>
        <StoriesSection />
      </Suspense>
    </div>
  );
} 