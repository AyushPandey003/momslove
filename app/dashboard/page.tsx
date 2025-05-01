'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserStories } from '@/app/lib/stories';
import { Story } from '@/app/lib/stories';

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserContent = async () => {
      if (status !== 'authenticated' || !session?.user?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch user's stories
        const userStories = await getUserStories(session.user.id);
        setStories(userStories);
      } catch (err) {
        console.error('Error fetching user content:', err);
        setError('Failed to load your content. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserContent();
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/api/auth/signin');
    return (
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
          <p>You need to be logged in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/create-blog" className="text-blue-600 hover:underline">
                Create New Blog Post
              </Link>
            </li>
            <li>
              <Link href="/submit-story" className="text-blue-600 hover:underline">
                Submit a Story
              </Link>
            </li>
            <li>
              <Link href="/preferences" className="text-blue-600 hover:underline">
                Manage Preferences
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-100 md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Welcome, {session?.user?.name || 'User'}!</h2>
          <p className="text-gray-700">
            This is your personal dashboard where you can manage your content, track submissions, 
            and create new posts. Use the quick links to navigate or view your content below.
          </p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Stories</h2>
          <Link 
            href="/submit-story" 
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Submit New Story
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading your stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600 mb-4">You haven't submitted any stories yet.</p>
            <Link
              href="/submit-story"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Submit Your First Story
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <div 
                key={story.id} 
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
                  >
                    View Full Story
                  </Link>
                  
                  {story.status === 'pending' && (
                    <Link 
                      href={`/edit-story/${story.id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit Story
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-10 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-yellow-100 text-yellow-800 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-lg">Submission</h3>
              <p className="text-gray-600">Your story is submitted and awaiting review by our team.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-800 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-lg">Review</h3>
              <p className="text-gray-600">Our team reviews your story for content and clarity.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 text-green-800 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-lg">Publication</h3>
              <p className="text-gray-600">
                If approved, your story will be published and visible in the approved stories section.
                Some stories may be selected for conversion to featured blog posts!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 