import { PreferenceSelector } from '@/app/components/user/PreferenceSelector';

export default function PreferencesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Preferences</h1>
      <PreferenceSelector />
    </div>
  );
}
