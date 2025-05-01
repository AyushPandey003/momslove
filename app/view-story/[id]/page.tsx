'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStoryById, Story } from '@/app/lib/stories';

export default function ViewStoryPage() {
  // Extract and type the dynamic route param
  const { id } = useParams() as { id: string };
  const { data: session, status } = useSession();
  const router = useRouter();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated users to sign-in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/api/auth/signin');
    }
  }, [status, router]);

  // Fetch the story and enforce authorization
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchStory = async () => {
      setLoading(true);
      try {
        const storyData = await getStoryById(id);
        if (!storyData) {
          setError('Story not found');
          return;
        }
        setStory(storyData);

        // Redirect if current user is neither author nor admin
        if (
          storyData.userId !== session?.user?.id &&
          !session?.user?.admin
        ) {
          router.replace('/dashboard');
        }
      } catch (err) {
        console.error('Error fetching story:', err);
        setError('Failed to load the story. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id, status, session?.user?.id, session?.user?.admin, router]);

  // Show a loading state
  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">View Story</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error messages
  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">View Story</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          <p>{error}</p>
        </div>
        <div className="mt-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Render the story once loaded and authorized
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">
            {story!.title}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-700 dark:text-gray-300">
              By {story!.user_name}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Submitted on {new Date(story!.submitted_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mb-6">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              story!.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : story!.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            Status: {story!.status.charAt(0).toUpperCase() + story!.status.slice(1)}
          </div>
        </div>
        {story!.rejection_reason && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold text-red-800 mb-1">Reason for rejection:</h3>
            <p className="text-red-700">{story!.rejection_reason}</p>
          </div>
        )}
        <div className="max-w-none mb-8">
          {story!.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="text-black dark:text-gray-100 mb-4">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="border-t pt-6">
          {story!.status === 'pending' && (
            <Link
              href={`/edit-story/${story!.id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit Story
            </Link>
          )}
          {story!.status === 'rejected' && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 mb-4">
                Your story was not approved. You can review the feedback and submit a new story.
              </p>
              <Link
                href="/submit-story"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Submit New Story
              </Link>
            </div>
          )}
          {story!.status === 'approved' && (
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-800 font-medium mb-1">Congratulations!</p>
              <p className="text-gray-700">
                Your story has been approved and is now visible in the approved stories section.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
