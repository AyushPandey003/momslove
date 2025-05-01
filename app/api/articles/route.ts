import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { 
  getRecentArticles, 
  getArticleBySlug, 
  createArticle,
  updateArticle,
  deleteArticle
} from '@/app/lib/articles';
import { addTagsToArticle } from '@/app/lib/tags';
import { v4 as uuidv4 } from 'uuid';

// GET handler to fetch articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    if (slug) {
      // Get a specific article by slug
      const article = await getArticleBySlug(slug);
      
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      
      return NextResponse.json({ article });
    } else {
      // Get recent articles
      const articles = await getRecentArticles(limit);
      return NextResponse.json({ articles });
    }
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST handler to create a new article (admin only)
export async function POST(request: Request) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user?.id || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, slug, content, excerpt, cover_image, tags, category_id, status = 'draft' } = await request.json();

    // Basic validation
    if (!title || !content || !slug) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    // Create the article
    const articleId = await createArticle({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 150) + (content.length > 150 ? '...' : ''),
      cover_image: cover_image || '/images/default-cover.jpg',
      user_id: session.user.id,
      author_name: session.user.name || 'Admin',
      published_at: status === 'published' ? new Date() : null,
      status,
      reading_time: Math.ceil(content.split(/\s+/).length / 200), // Approximate reading time
      category_id
    });

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      await addTagsToArticle(articleId, tags);
    }

    return NextResponse.json({ 
      message: 'Article created successfully', 
      articleId 
    }, { status: 201 });
  } catch (error) {
    console.error('Article creation failed:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

// PATCH handler to update an article (admin only)
export async function PATCH(request: Request) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user?.id || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, title, slug, content, excerpt, cover_image, tags, category_id, status } = await request.json();

    // Basic validation
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (cover_image !== undefined) updateData.cover_image = cover_image;
    if (category_id !== undefined) updateData.category_id = category_id;
    
    // Update published_at if status is changing to published
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'published') {
        updateData.published_at = new Date();
      }
    }

    // Update the article
    await updateArticle(id, updateData);

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Replace all tags (remove existing, add new)
      await addTagsToArticle(id, tags);
    }

    return NextResponse.json({ 
      message: 'Article updated successfully'
    });
  } catch (error) {
    console.error('Article update failed:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

// DELETE handler to delete an article (admin only)
export async function DELETE(request: Request) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user?.id || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    // Delete the article
    await deleteArticle(id);

    return NextResponse.json({ 
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Article deletion failed:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
} 