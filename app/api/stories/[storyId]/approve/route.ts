import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { approveStory, getStoryById } from '@/app/lib/stories';

interface ApproveRouteParams {
  params: {
    storyId: string;
  };
}

export async function POST(
  request: Request, // Request is unused but required by Next.js convention
  { params }: ApproveRouteParams
) {
  const session = await auth();
  const { storyId } = params;

  // 1. Check if user is authenticated and is an admin
  if (!session?.user || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Verify the story exists before attempting to approve
    const story = await getStoryById(storyId);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // 3. Approve the story
    await approveStory(storyId);

    // 4. Return success response
    return NextResponse.json({ message: 'Story approved successfully' });

  } catch (error) {
    console.error('Failed to approve story:', error);
    // Handle potential database errors or other issues
    return NextResponse.json(
      { error: 'Failed to approve story. Please try again.' },
      { status: 500 }
    );
  }
} 