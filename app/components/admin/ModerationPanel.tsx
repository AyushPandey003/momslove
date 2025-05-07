'use client'; // Convert to Client Component

import React, { useState, useEffect, useCallback } from 'react';
import {  Story } from '@/app/types';
import { Button } from '@/app/components/ui/Button';
import { Textarea } from '@/app/components/ui/Textarea'; // Assuming a Textarea component exists
import { Input } from '@/app/components/ui/Input'; // Assuming an Input component exists for rejection reason


// Helper function to fetch stories (could be moved to a lib file)
async function fetchPendingStories(): Promise<Story[]> {
  try {
    const response = await fetch('/api/stories?status=pending');
    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }
    const data = await response.json();

    if (!data.stories || !Array.isArray(data.stories)) {
      throw new Error('Invalid data format from API');
    }

    // Ensure dates are converted
    return (data.stories as Story[]).map((story: Story) => ({
      ...story,
      submittedAt: new Date(story.submitted_at),
      approvedAt: story.approvedAt ? new Date(story.approvedAt) : undefined,
      rejectedAt: story.rejectedAt ? new Date(story.rejectedAt) : undefined,
    })) as Story[];
  } catch (error: unknown) {
    console.error("Failed to fetch pending stories:", error);
    return [];
  }
}



export default function ModerationPanel() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStoryId, setUpdatingStoryId] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: string]: string }>({});

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For now, we'll need a GET endpoint at /api/stories to fetch pending ones
      // Let's assume it exists for this component implementation
      const fetchedStories = await fetchPendingStories();
      setStories(fetchedStories);
    } catch (err) {
      setError('Failed to load stories. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const handleUpdateStatus = async (storyId: string, status: 'approved' | 'rejected') => {
    setUpdatingStoryId(storyId);
    setError(null);
    const reason = rejectionReasons[storyId] || '';

    try {
      let response;
      
      if (status === 'approved') {
        response = await fetch(`/api/stories/${storyId}/approve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } else {
        response = await fetch(`/api/stories/${storyId}/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${status} story`);
      }

      // Remove the story from the list optimistically or refetch
      setStories(prevStories => prevStories.filter(story => story.id !== storyId));
      setRejectionReasons(prev => {
          const newState = {...prev};
          delete newState[storyId];
          return newState;
      });

  } catch (err: unknown) {
      console.error(`Failed to ${status} story:`, err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`An unknown error occurred while updating the story.`);
      }
    } finally {
      setUpdatingStoryId(null);
    }
  };

  const handleReasonChange = (storyId: string, value: string) => {
      setRejectionReasons(prev => ({...prev, [storyId]: value}));
  }

  if (isLoading) {
    return <p className="text-center">Loading pending stories...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 dark:text-red-400">{error}</p>;
  }
  console.log("Fetched stories:", stories); // Debugging line to check fetched stories

  return (
    <div className="space-y-6">
      {stories.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No pending stories to moderate.</p>
      ) : (
        stories.map((story) => (
          <div key={story.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Submitted by: {story.user_name} ({story.user_email || 'No email provided'}) on {new Date(story.submitted_at).toLocaleDateString()}
            </p>
            {/* Use Textarea for potentially long content */}
            <Textarea
                readOnly
                value={story.content}
                className="w-full mb-4 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                rows={6}
            />

            {/* Rejection Reason Input */}
            <div className="mb-4">
                 <label htmlFor={`reason-${story.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rejection Reason (Optional)
                 </label>
                 <Input
                    type="text"
                    id={`reason-${story.id}`}
                    value={rejectionReasons[story.id] || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleReasonChange(story.id, e.target.value)}
                    placeholder="Reason for rejection..."
                    className="w-full"
                    disabled={updatingStoryId === story.id}
                 />
            </div>


            <div className="flex space-x-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus(story.id, 'approved')}
                disabled={updatingStoryId === story.id}
              >
                {updatingStoryId === story.id ? 'Approving...' : 'Approve'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUpdateStatus(story.id, 'rejected')}
                disabled={updatingStoryId === story.id}
              >
                {updatingStoryId === story.id ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
