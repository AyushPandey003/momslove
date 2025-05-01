import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { rejectStory, getStoryById } from '@/app/lib/stories';

interface RejectRouteParams {
  params: {
    storyId: string;
  };
}

export async function POST(
  request: Request,
  { params }: RejectRouteParams
) {
  const session = await auth();
  const { storyId } = params;

  // 1. Check if user is authenticated and is an admin
  if (!session?.user || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Parse the rejection reason from the request body
    const body = await request.json();
    const reason = body.reason;

    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    // 3. Verify the story exists before attempting to reject
    const story = await getStoryById(storyId);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // 4. Reject the story with the reason
    await rejectStory(storyId, reason.trim());

    // 5. Return success response
    return NextResponse.json({ message: 'Story rejected successfully' });

  } catch (error) {
    // Differentiate potential JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    console.error('Failed to reject story:', error);
    // Handle potential database errors or other issues
    return NextResponse.json(
      { error: 'Failed to reject story. Please try again.' },
      { status: 500 }
    );
  }
} 