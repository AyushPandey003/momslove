import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ModerationPanel from '@/app/components/admin/ModerationPanel'; // We will create this next

// Define a type for the session user, assuming an isAdmin flag might exist
// Adjust this based on your actual user session structure
interface AdminSessionUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  admin?: boolean; // Placeholder for admin check
}

export default async function ModerateStoriesPage() {
  const session = await auth();
  const user = session?.user as AdminSessionUser | undefined;

  // --- Admin Access Check ---
  // Replace this logic with your actual admin identification method
  // Example: Check for a specific role, email, or ID
  const isAdmin = user?.admin === true; // Placeholder check

  if (!session || !isAdmin) {
    console.log('Access denied to moderation panel for user:', user?.email);
    redirect('/');
  }
  // --- End Admin Access Check ---

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Moderate Submitted Stories</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Review user-submitted stories below. Approve or reject them as needed.
      </p>
      {/* We'll fetch and pass pending stories to this component */}
      <ModerationPanel />
    </div>
  );
}
