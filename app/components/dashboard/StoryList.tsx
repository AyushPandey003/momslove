'use client';

import Link from 'next/link';
import { Story } from '@/app/lib/stories';
import { memo } from 'react';

// Memoize individual story cards for preventing unnecessary re-renders
const StoryCard = memo(({ story }: { story: Story }) => {
  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${
        story.status === 'pending' ? 'border-yellow-500' :
        story.status === 'approved' ? 'border-green-500' :
        'border-red-500'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold">{story.title}</h3>
          <p className="text-sm text-gray-500">
            Submitted on {new Date(story.submitted_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            story.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            story.status === 'approved' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">
        {story.content.length > 150 
          ? `${story.content.substring(0, 150)}...` 
          : story.content}
      </p>
      
      {story.rejection_reason && (
        <div className="bg-red-50 p-3 mb-4 rounded">
          <p className="text-sm font-medium text-red-800">
            <span className="font-bold">Reason for rejection:</span> {story.rejection_reason}
          </p>
        </div>
      )}
      
      <div className="flex space-x-3">
        <Link 
          href={`/view-story/${story.id}`}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          prefetch={true}
        >
          View Full Story
        </Link>
        
        {story.status === 'pending' && (
          <Link 
            href={`/edit-story/${story.id}`}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            prefetch={true}
          >
            Edit Story
          </Link>
        )}
      </div>
    </div>
  );
});
StoryCard.displayName = 'StoryCard';

export default function StoryList({ 
  stories, 
  loading, 
  error 
}: { 
  stories: Story[]; 
  loading: boolean; 
  error: string | null 
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading your stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
        <p>{error}</p>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600 mb-4">You haven&apos;t submitted any stories yet.</p>
        <Link
          href="/submit-story"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          prefetch={true}
        >
          Submit Your First Story
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
} 