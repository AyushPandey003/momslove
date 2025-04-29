'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession
import { categories } from '@/app/data/categories';
import { Button } from '@/app/components/ui/Button';
import Link from 'next/link'; // Import Link for login prompt

export function PreferenceSelector() {
  const { status } = useSession(); // Get session status, removed unused 'session'
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For initial fetch
  const [isSaving, setIsSaving] = useState(false); // For saving state
  const [error, setError] = useState<string | null>(null);

  // Fetch preferences when session is loaded
  const fetchPreferences = useCallback(async () => {
    if (status === 'authenticated') {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/preferences');
        if (!response.ok) {
          throw new Error(`Failed to fetch preferences: ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data.preferences)) {
          setSelectedCategories(data.preferences);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching preferences:", err.message);
        } else {
          console.error("Error fetching preferences:", err);
        }
        setError('Could not load your preferences. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    } else if (status === 'unauthenticated') {
      setSelectedCategories([]); // Clear if logged out
      setIsLoading(false);
    }
    // If status is 'loading', we wait for it to change
  }, [status]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]); // Re-run fetch when status changes

  // Save preferences function
  const savePreferences = useCallback(async (newPreferences: string[]) => {
    if (status !== 'authenticated') return; // Only save if logged in

    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: newPreferences }),
      });
      if (!response.ok) {
        throw new Error(`Failed to save preferences: ${response.statusText}`);
      }
      // Optionally show a success message or update UI
      console.log("Preferences saved successfully");
    } catch (err: unknown) {
      let errorMessage = 'Could not save your preferences. Please try again.';
      if (err instanceof Error) {
        console.error("Error saving preferences:", err.message);
        errorMessage = `Could not save your preferences: ${err.message}. Please try again.`;
      } else {
        console.error("Error saving preferences:", err);
      }
      setError(errorMessage);
      // Optionally revert UI state if save fails
      fetchPreferences(); // Re-fetch to revert state on error
    } finally {
      setIsSaving(false);
    }
  }, [status, fetchPreferences]);

  const handleCategoryToggle = (slug: string) => {
    const newPreferences = selectedCategories.includes(slug)
      ? selectedCategories.filter(catSlug => catSlug !== slug)
      : [...selectedCategories, slug];

    setSelectedCategories(newPreferences); // Update UI immediately
    savePreferences(newPreferences); // Debounce or throttle this in a real app if needed
  };

  // Handle different session states
  if (status === 'loading' || isLoading) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground mb-6 text-center">
        <p>Loading preferences...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground mb-6 text-center">
        <p className="text-muted-foreground">
          Please <Link href="/api/auth/signin" className="text-pink-600 hover:underline">sign in</Link> to personalize your feed.
        </p>
      </div>
    );
  }

  // Render selector if authenticated
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground mb-6">
      <h3 className="text-lg font-semibold mb-3">Personalize Your Feed</h3>
      <p className="text-sm text-muted-foreground mb-4">Select the topics you&#39;re most interested in:</p>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category.slug}
            variant={selectedCategories.includes(category.slug) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryToggle(category.slug)}
            disabled={isSaving} // Disable buttons while saving
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>
      {isSaving && (
         <p className="text-xs text-muted-foreground mt-3">
            Saving...
         </p>
      )}
       {!isSaving && selectedCategories.length > 0 && (
         <p className="text-xs text-muted-foreground mt-3">
            Your preferences are saved.
         </p>
      )}
    </div>
  );
}
