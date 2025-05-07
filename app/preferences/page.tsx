'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { updatePreferences } from '@/app/lib/actions';

type FormValues = {
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  digestFrequency: 'daily' | 'weekly' | 'monthly' | 'none';
};

export default function PreferencesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      emailNotifications: true,
      theme: 'light',
      digestFrequency: 'weekly'
    }
  });

  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/preferences');
        
        if (!response.ok) {
          throw new Error('Failed to fetch preferences');
        }
        
        const data = await response.json();
        
        // Update form with user preferences
        reset({
          emailNotifications: data.preferences.email_notifications,
          theme: data.preferences.theme,
          digestFrequency: data.preferences.digest_frequency
        });
      } catch (err) {
        console.error('Error fetching preferences:', err);
        setError('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPreferences();
  }, [status, reset]);

  const onSubmit = async (data: FormValues) => {
    if (status !== 'authenticated') {
      setError('You must be logged in to update preferences');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('emailNotifications', data.emailNotifications ? 'on' : 'off');
      formData.append('theme', data.theme);
      formData.append('digestFrequency', data.digestFrequency);
      
      const result = await updatePreferences(formData);
      
      if (result.success) {
        setSaveMessage('Preferences saved successfully!');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('An error occurred while saving preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">User Preferences</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500">Loading preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">User Preferences</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">You need to be logged in to view and update your preferences.</p>
          <button
            onClick={() => router.push('/api/auth/signin')}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">User Preferences</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Notifications */}
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  {...register('emailNotifications')}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                  Email Notifications
                </label>
                <p className="text-gray-500">Receive email notifications about new content and updates.</p>
              </div>
            </div>
          </div>
          
          {/* Theme Selection */}
          <div className="mb-6">
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select
              id="theme"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('theme')}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">Choose your preferred theme for the website.</p>
          </div>
          
          {/* Digest Frequency */}
          <div className="mb-6">
            <label htmlFor="digestFrequency" className="block text-sm font-medium text-gray-700 mb-1">
              Digest Frequency
            </label>
            <select
              id="digestFrequency"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('digestFrequency')}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="none">None</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">How often would you like to receive email digests of new content?</p>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 rounded font-medium ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
          
          {/* Success/Error Messages */}
          {saveMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
              {saveMessage}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
              {error}
            </div>
          )}
        </form>
      </div>
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">About Your Preferences</h2>
        <p className="text-gray-700 mb-4">
          Your preferences help us personalize your experience on MomsLove. You can change these settings at any time.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Email Notifications:</strong> Receive alerts about new articles, comments on your stories, and other important updates.</li>
          <li><strong>Theme:</strong> Choose how MomsLove appears to you across all your devices.</li>
          <li><strong>Digest Frequency:</strong> Control how often you receive email summaries of new content based on your interests.</li>
        </ul>
      </div>
    </div>
  );
}
