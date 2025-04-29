import React from 'react';
import SubmissionForm from '@/app/components/stories/SubmissionForm';
import { auth } from '@/auth'; // Use auth from NextAuth v5
import { redirect } from 'next/navigation';

export default async function SubmitStoryPage() {
  const session = await auth(); // Use auth() to get the session

  if (!session) {
    // Redirect unauthenticated users to login page or show a message
    // For now, redirecting to home, but ideally to a login page
    redirect('/api/auth/signin?callbackUrl=/submit-story');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Share Your Story</h1>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
        We love hearing from our community! Share your experiences, tips, or reflections on motherhood.
      </p>
      <SubmissionForm />
    </div>
  );
}
