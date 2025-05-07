import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { approveStory, rejectStory, getStoryById } from '@/app/lib/stories';

interface StoryRouteParams {
  params: {
    storyId: string;
  };
}

export async function PATCH(
  request: Request,
  { params }: StoryRouteParams
) {
  const session = await auth();
  const { storyId } = params;

  // 1. Check if user is authenticated and is an admin
  if (!session?.user || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Parse the request body
    const body = await request.json();
    const { status, rejectionReason } = body;

    if (!status || (status !== 'approved' && status !== 'rejected')) {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    // 3. Verify the story exists before attempting to update
    const story = await getStoryById(storyId);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // 4. Update the story based on the status
    if (status === 'approved') {
      await approveStory(storyId);
    } else if (status === 'rejected') {
      // For rejection, a reason is required
      if (!rejectionReason || typeof rejectionReason !== 'string' || rejectionReason.trim() === '') {
        return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
      }
      await rejectStory(storyId, rejectionReason.trim());
    }

    // 5. Set cache headers for faster subsequent loads
    const headers = new Headers();
    headers.set('Cache-Control', 'private, s-maxage=30, stale-while-revalidate=60');

    // 6. Return success response
    return NextResponse.json(
      { message: `Story ${status} successfully` },
      { 
        status: 200,
        headers
      }
    );

  } catch (error) {
    console.error(`Failed to update story:`, error);
    // Handle potential database errors or other issues
    return NextResponse.json(
      { error: 'Failed to update story. Please try again.' },
      { status: 500 }
    );
  }
} 