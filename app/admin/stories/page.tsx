'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Story = {
  id: string;
  title: string;
  content: string;
  userId: string;
  user_name: string;
  user_email: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
};

export default function AdminStoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Fetch stories based on filter
  useEffect(() => {
    const fetchStories = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setLoading(true);
        
        const queryParams = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
        const response = await fetch(`/api/stories${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        
        const data = await response.json();
        setStories(data.stories);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStories();
  }, [status, statusFilter]);

  // Handle story approval
  const handleApprove = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}/approve`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve story');
      }
      
      // Update the story status in the UI
      setStories(stories.map(story => 
        story.id === storyId 
          ? { ...story, status: 'approved', approved_at: new Date().toISOString(), rejected_at: null, rejection_reason: null } 
          : story
      ));
    } catch (err) {
      console.error('Error approving story:', err);
      setError('Failed to approve story');
    }
  };

  // Handle story rejection
  const handleReject = async (storyId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return; // User cancelled
    
    try {
      const response = await fetch(`/api/stories/${storyId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject story');
      }
      
      // Update the story status in the UI
      setStories(stories.map(story => 
        story.id === storyId 
          ? { ...story, status: 'rejected', rejected_at: new Date().toISOString(), approved_at: null, rejection_reason: reason } 
          : story
      ));
    } catch (err) {
      console.error('Error rejecting story:', err);
      setError('Failed to reject story');
    }
  };

  // Check if user is admin
  if (status === 'loading') {
    return (
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin: Manage Stories</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user.admin) {
    router.push('/');
    return (
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin: Manage Stories</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin: Manage Stories</h1>
      
      {/* Status filter */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'approved' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'rejected' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Stories list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading stories...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No {statusFilter !== 'all' ? statusFilter : ''} stories found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <div 
              key={story.id} 
              className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
                story.status === 'pending' ? 'border-yellow-500' :
                story.status === 'approved' ? 'border-green-500' :
                'border-red-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{story.title}</h2>
                  <p className="text-sm text-gray-500">
                    By {story.user_name} ({story.user_email || 'No email'}) • 
                    {new Date(story.submitted_at).toLocaleDateString()}
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
              
              <div className="prose max-w-none mb-4">
                {/* Display the first 150 characters of the content */}
                <p>
                  {story.content.length > 150 
                    ? `${story.content.substring(0, 150)}...` 
                    : story.content}
                </p>
              </div>
              
              {/* Rejection reason if present */}
              {story.rejection_reason && (
                <div className="bg-red-50 p-3 mb-4 rounded">
                  <p className="text-sm font-medium text-red-800">Rejection reason: {story.rejection_reason}</p>
                </div>
              )}
              
              <div className="flex space-x-3">
                {/* Full story link */}
                <button
                  onClick={() => window.open(`/admin/stories/${story.id}`, '_blank')}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  View Full Story
                </button>
                
                {/* Approve/reject buttons when pending */}
                {story.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(story.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(story.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
                
                {/* Convert to article button when approved */}
                {story.status === 'approved' && (
                  <Link
                    href={`/admin/stories/${story.id}/convert`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Convert to Article
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 