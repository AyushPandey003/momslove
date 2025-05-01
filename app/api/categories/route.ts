import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { 
  getAllCategories, 
  getCategoryBySlug, 
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithArticleCount
} from '@/app/lib/categories';

// GET handler to fetch categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const withCounts = searchParams.get('withCounts') === 'true';

    if (slug) {
      // Get a specific category by slug
      const category = await getCategoryBySlug(slug);
      
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      
      return NextResponse.json({ category });
    } else if (withCounts) {
      // Get all categories with article counts
      const categories = await getCategoryWithArticleCount();
      return NextResponse.json({ categories });
    } else {
      // Get all categories
      const categories = await getAllCategories();
      return NextResponse.json({ categories });
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST handler to create a new category (admin only)
export async function POST(request: Request) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user?.id || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, slug, description, image_url } = await request.json();

    // Basic validation
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Create the category
    const categoryId = await createCategory({
      name,
      slug,
      description,
      image_url
    });

    return NextResponse.json({ 
      message: 'Category created successfully', 
      categoryId 
    }, { status: 201 });
  } catch (error) {
    console.error('Category creation failed:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// PATCH handler to update a category (admin only)
export async function PATCH(request: Request) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user?.id || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, name, slug, description, image_url } = await request.json();

    // Basic validation
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;

    // Update the category
    await updateCategory(id, updateData);

    return NextResponse.json({ 
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Category update failed:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE handler to delete a category (admin only)
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
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Delete the category
    await deleteCategory(id);

    return NextResponse.json({ 
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Category deletion failed:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
} 