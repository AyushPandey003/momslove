import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const result = await pool.query(
      'SELECT "category_slug" FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    const preferences = result.rows.map(row => row.categorySlug);
    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

// POST /api/preferences - Updates preferences for the logged-in user
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  let preferences: string[] = [];

  try {
    const body = await request.json();
    if (Array.isArray(body.preferences)) {
      preferences = body.preferences.filter((slug: unknown): slug is string => typeof slug === 'string');
    } else {
      return NextResponse.json(
        { error: 'Invalid preferences format. Expected { preferences: string[] }' },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete any existing preferences
    await client.query('DELETE FROM user_preferences WHERE user_id = $1', [userId]);

    // Insert new preferences
    if (preferences.length > 0) {
      const values = preferences.map((_, i) => `($1, $${i + 2})`).join(',');
      const queryParams = [userId, ...preferences];
      const insertQuery = `INSERT INTO user_preferences (user_id, category_slug) VALUES ${values}`;
      await client.query(insertQuery, queryParams);
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  } finally {
    client.release();
  }
}
