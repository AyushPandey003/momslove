import React from 'react';
import { Story } from '@/app/types';
import { Pool } from '@neondatabase/serverless';

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getApprovedStories(): Promise<Story[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, title, content, "userId", "user_name", "user_email", status, "submitted_at"
      FROM stories
      WHERE status = 'approved'
      ORDER BY "submitted_at" DESC;
    `;
    const result = await client.query(query);
    return result.rows.map(row => ({
      ...row,
      submittedAt: new Date(row.submittedAt),
    })) as Story[];
  } catch (error) {
    console.error("Failed to fetch approved stories:", error);
    return [];
  } finally {
    client.release();
  }
}

export default async function ApprovedStoriesPage() {
  const approvedStories = await getApprovedStories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Approved Stories</h1>
      {approvedStories.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No approved stories yet.</p>
      ) : (
        <div className="space-y-6">
          {approvedStories.map((story) => (
            <div key={story.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Submitted by: {story.user_name} ({story.user_email || 'No email provided'}) on {story.submitted_at.toLocaleDateString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{story.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
