import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { 
  getCommentsByArticleId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  hideComment,
  publishComment
} from '@/app/lib/comments';

// GET handler to fetch comments for an article
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    
    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }
    
    const comments = await getCommentsByArticleId(articleId);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST handler to create a new comment
export async function POST(request: Request) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // Support both articleId and article_id
    const articleId = body.articleId || body.article_id;
    const { content } = body;

    // Basic validation
    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }
    
    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    // Create the comment
    const commentId = await createComment(
      articleId,
      session.user.id,
      session.user.name || 'Anonymous',
      content
    );

    return NextResponse.json({ 
      message: 'Comment posted successfully', 
      commentId 
    }, { status: 201 });
  } catch (error) {
    console.error('Comment posting failed:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}

// PATCH handler to update a comment
export async function PATCH(request: Request) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, content, action } = await request.json();

    // Basic validation
    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    // Get the comment to check ownership
    const comment = await getCommentById(id);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Only comment owner or admin can edit
    const isOwner = comment.user_id === session.user.id;
    const isAdmin = session.user.admin === true;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Not authorized to modify this comment' }, { status: 403 });
    }

    // Handle different update actions
    if (action === 'hide' && isAdmin) {
      await hideComment(id);
      return NextResponse.json({ message: 'Comment hidden successfully' });
    } else if (action === 'publish' && isAdmin) {
      await publishComment(id);
      return NextResponse.json({ message: 'Comment published successfully' });
    } else if (content) {
      // Regular content update (owner or admin)
      if (!content.trim()) {
        return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
      }
      await updateComment(id, content);
      return NextResponse.json({ message: 'Comment updated successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid update action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Comment update failed:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

// DELETE handler to delete a comment
export async function DELETE(request: Request) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    // Get the comment to check ownership
    const comment = await getCommentById(id);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Only comment owner or admin can delete
    const isOwner = comment.user_id === session.user.id;
    const isAdmin = session.user.admin === true;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Not authorized to delete this comment' }, { status: 403 });
    }

    // Delete the comment
    await deleteComment(id);

    return NextResponse.json({ 
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Comment deletion failed:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
} 