import { Suspense } from 'react';
import ProfileForm from '@/app/components/profile/ProfileForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Loading fallback for profile
function ProfileLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );
}

export default async function ProfilePage() {
  const session = await auth();
  
  // Redirect unauthenticated users
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }
  
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Link 
          href="/dashboard" 
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition"
        >
          Back to Dashboard
        </Link>
      </div>
      
      <Suspense fallback={<ProfileLoading />}>
        <ProfileForm />
      </Suspense>
    </div>
  );
} 