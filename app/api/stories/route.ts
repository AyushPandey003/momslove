import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Pool } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET handler to fetch stories, optionally filtered by status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = `
      SELECT id, title, content, "userId", "user_name", "user_email", status, "submitted_at", "approved_at", "rejected_at", "rejection_reason"
      FROM stories
    `;
    const values: string[] = [];

    if (status) {
      query += ` WHERE status = $1`;
      values.push(status);
    }

    query += ` ORDER BY "submitted_at" DESC`; // Or any other relevant ordering

    const client = await pool.connect();
    try {
      const result = await client.query(query, values);
      return NextResponse.json({ stories: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

// POST handler to submit a story (existing code - keep it)
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || !session.user.name) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content } = await request.json();

    // Basic validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const storyId = uuidv4();
    const userId = session.user.id;
    const userName = session.user.name; // Assuming name is available in session
    const userEmail = session.user.email; // Assuming email is available
    const status = 'pending';
    const submittedAt = new Date();

    // TODO: Add proper SQL injection prevention if not using an ORM/query builder
    // For simplicity, using template literals here, but prefer parameterized queries
    const query = `
      INSERT INTO stories (id, title, content, "userId", "user_name", "user_email", status, "submitted_at")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;
    const values = [storyId, title, content, userId, userName, userEmail, status, submittedAt];

    const client = await pool.connect();
    try {
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('Failed to insert story');
      }
      console.log('Story submitted:', result.rows[0].id);
      return NextResponse.json({ message: 'Story submitted successfully', storyId: result.rows[0].id }, { status: 201 });
    } finally {
      client.release(); // Release the client back to the pool
    }

  } catch (error) {
    console.error('Story submission failed:', error);
    // Differentiate between validation errors and server errors if needed
    if (error instanceof SyntaxError) { // JSON parsing error
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit story' }, { status: 500 });
  }
}
