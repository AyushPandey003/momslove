import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { 
  getAllTags, 
  getTagBySlug, 
  createTag,
  updateTag,
  deleteTag,
  getTagsWithArticleCount
} from '@/app/lib/tags';

// GET handler to fetch tags
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const withCounts = searchParams.get('withCounts') === 'true';

    if (slug) {
      // Get a specific tag by slug
      const tag = await getTagBySlug(slug);
      
      if (!tag) {
        return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
      }
      
      return NextResponse.json({ tag });
    } else if (withCounts) {
      // Get all tags with article counts
      const tags = await getTagsWithArticleCount();
      return NextResponse.json({ tags });
    } else {
      // Get all tags
      const tags = await getAllTags();
      return NextResponse.json({ tags });
    }
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// POST handler to create a new tag (admin only)
export async function POST(request: Request) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user?.id || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, slug } = await request.json();

    // Basic validation
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Create the tag
    const tagId = await createTag({
      name,
      slug
    });

    return NextResponse.json({ 
      message: 'Tag created successfully', 
      tagId 
    }, { status: 201 });
  } catch (error) {
    console.error('Tag creation failed:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}

// PATCH handler to update a tag (admin only)
export async function PATCH(request: Request) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user?.id || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, name, slug } = await request.json();

    // Basic validation
    if (!id) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
    }

    // Prepare update data
    interface TagUpdateData {
      name?: string;
      slug?: string;
    }
    
    const updateData: TagUpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;

    // Update the tag
    await updateTag(id, updateData);

    return NextResponse.json({ 
      message: 'Tag updated successfully'
    });
  } catch (error) {
    console.error('Tag update failed:', error);
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

// DELETE handler to delete a tag (admin only)
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
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
    }

    // Delete the tag
    await deleteTag(id);

    return NextResponse.json({ 
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Tag deletion failed:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
} 