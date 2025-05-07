import { recentArticles } from '@/app/data/data';
import { createArticle } from './articles';
import { createCategory } from './categories';
import { createTag } from './tags';
import { addTagsToArticle } from './tags';
import { query } from './db';

// Function to migrate categories
export async function migrateCategories(): Promise<Record<string, string>> {
  const categoryMap: Record<string, string> = {}; // Maps category name to ID
  
  // Get categories from hardcoded data
  const categories = new Set<string>();
  recentArticles.forEach(article => {
    if (article.category) {
      categories.add(article.category);
    }
  });
  
  // Create categories in the database
  for (const categoryName of Array.from(categories)) {
    // Create a slug from the category name
    const slug = categoryName.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
    
    // Create the category
    const categoryId = await createCategory({
      name: categoryName,
      slug,
      description: `Articles about ${categoryName}`,
      image_url: null
    });
    
    categoryMap[categoryName] = categoryId;
  }
  
  return categoryMap;
}

// Function to migrate tags
export async function migrateTags(): Promise<Record<string, string>> {
  const tagMap: Record<string, string> = {}; // Maps tag name to ID
  
  // Get tags from hardcoded data
  const tags = new Set<string>();
  recentArticles.forEach(article => {
    if (article.tags && article.tags.length > 0) {
      article.tags.forEach(tag => tags.add(tag));
    }
  });
  
  // Create tags in the database
  for (const tagName of Array.from(tags)) {
    // Create a slug from the tag name
    const slug = tagName.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
    
    // Create the tag
    const tagId = await createTag({
      name: tagName,
      slug
    });
    
    tagMap[tagName] = tagId;
  }
  
  return tagMap;
}

// Function to migrate articles
export async function migrateArticles(
  categoryMap: Record<string, string>,
  tagMap: Record<string, string>,
  userId: string // Admin user ID
): Promise<void> {
  for (const article of recentArticles) {
    // Convert date string to Date object if needed
    const publishedAt = typeof article.date === 'string' 
      ? new Date(article.date) 
      : new Date();
    
    // Get category ID if available
    const categoryId = article.category ? categoryMap[article.category] : null;
    
    // Calculate reading time (approximately 200 words per minute)
    const wordCount = article.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Create the article
    const articleId = await createArticle({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      cover_image: article.coverImage,
      user_id: userId,
      author_name: article.author.name,
      published_at: publishedAt,
      status: 'published',
      reading_time: readingTime,
      category_id: categoryId
    });
    
    // Add tags to the article
    if (article.tags && article.tags.length > 0) {
      const tagIds = article.tags.map(tagName => tagMap[tagName]).filter(Boolean);
      if (tagIds.length > 0) {
        await addTagsToArticle(articleId, tagIds);
      }
    }
  }
}

// Main migration function
export async function migrateAllData(adminUserId: string): Promise<void> {
  // Check if migration has already happened
  const articles = await query<{ count: number }>('SELECT COUNT(*) as count FROM articles');
  
  if (articles[0].count > 0) {
    console.log('Migration already completed. Skipping...');
    return;
  }
  
  console.log('Starting data migration...');
  
  // Migrate in order: categories, tags, then articles
  const categoryMap = await migrateCategories();
  console.log('Categories migrated successfully');
  
  const tagMap = await migrateTags();
  console.log('Tags migrated successfully');
  
  await migrateArticles(categoryMap, tagMap, adminUserId);
  console.log('Articles migrated successfully');
  
  console.log('Data migration completed successfully');
} 