import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Pool } from '@neondatabase/serverless';

// Define a type for the session user, assuming an isAdmin flag might exist
// Adjust this based on your actual user session structure
interface AdminSessionUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  admin?: boolean; // Placeholder for admin check
}

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface PatchParams {
  params: {
    storyId: string;
  };
}

// PATCH handler to update story status (approve/reject)
export async function PATCH(request: Request, { params }: PatchParams) {
  const session = await auth();
  const user = session?.user as AdminSessionUser | undefined;

  // --- Admin Access Check ---
  // Replace this logic with your actual admin identification method
  const isAdmin = user?.admin === true; // Placeholder check
  if (!session || !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // --- End Admin Access Check ---

  const { storyId } = params;
  if (!storyId) {
    return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
  }

  try {
    const { status, rejectionReason } = await request.json();

    // Validate status
    if (!status || (status !== 'approved' && status !== 'rejected')) {
      return NextResponse.json({ error: 'Invalid status provided. Must be "approved" or "rejected".' }, { status: 400 });
    }

    // Validate rejectionReason if status is 'rejected'
    if (status === 'rejected' && (typeof rejectionReason !== 'string' || !rejectionReason.trim())) {
      // Allowing empty rejection reason for now, but could enforce it:
      // return NextResponse.json({ error: 'Rejection reason is required when rejecting a story.' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      let query: string;
      let values: (string | null)[]; // Use string | null for values passed to DB query

      if (status === 'approved') {
        query = `
          UPDATE stories
          SET status = $1, "approved_at" = CURRENT_TIMESTAMP, "rejected_at" = NULL, "rejection_reason" = NULL
          WHERE id = $2 AND status = 'pending' -- Ensure we only update pending stories
          RETURNING id;
        `;
        values = [status, storyId];
      } else { // status === 'rejected'
        query = `
          UPDATE stories
          SET status = $1, "rejected_at" = CURRENT_TIMESTAMP, "approved_at" = NULL, "rejection_reason" = $2
          WHERE id = $3 AND status = 'pending' -- Ensure we only update pending stories
          RETURNING id;
        `;
        values = [status, rejectionReason || null, storyId]; // Use null if reason is empty/not provided
      }

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        // Could be because the story wasn't found, or wasn't in 'pending' state
        // Check if the story exists first for a more specific error message if needed
        const checkExist = await client.query('SELECT status FROM stories WHERE id = $1', [storyId]);
        if (checkExist.rowCount === 0) {
             return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        } else {
             return NextResponse.json({ error: `Story is not in pending state (current state: ${checkExist.rows[0].status})` }, { status: 409 }); // Conflict
        }
      }

      console.log(`Story ${storyId} status updated to ${status}`);
      return NextResponse.json({ message: `Story successfully ${status}.`, storyId }, { status: 200 });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error(`Failed to update story ${storyId}:`, error);
     if (error instanceof SyntaxError) { // JSON parsing error
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update story status' }, { status: 500 });
  }
}
