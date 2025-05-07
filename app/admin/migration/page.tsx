'use client'

import { useState } from 'react';
import { runDataMigration } from '@/app/lib/actions';

export default function MigrateDataPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleMigrate = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const migrationResult = await runDataMigration();
      setResult(migrationResult);
    } catch (error) {
      setResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Data Migration Tool</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-6 text-gray-700">
          This tool will migrate your hardcoded data to the database. This includes articles, 
          categories, and tags. This should only be run once after setting up your database.
        </p>
        
        <div className="mb-6">
          <button 
            onClick={handleMigrate} 
            disabled={isLoading}
            className={`px-4 py-2 rounded font-medium ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isLoading ? 'Migrating...' : 'Run Migration'}
          </button>
        </div>
        
        {result && (
          <div className={`p-4 rounded ${
            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-semibold">{result.success ? 'Success!' : 'Error!'}</p>
            <p>{result.message}</p>
          </div>
        )}
        
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Important Notes:</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>This migration should only be run <strong>once</strong>.</li>
            <li>Make sure your database is properly set up before running this migration.</li>
            <li>This will transfer all hardcoded data from your app to the database.</li>
            <li>Only administrators can run this migration.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 