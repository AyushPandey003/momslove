import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { query } from '@/app/lib/db';
import { formatDate } from '@/app/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  author_name: string;
  published_at: string;
  created_at: string;
  reading_time: number;
}

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The category you are looking for could not be found.'
    };
  }
  
  return {
    title: `${category.name} | MomsLove`,
    description: category.description || `Browse articles in the ${category.name} category.`
  };
}

// Function to get category by slug
async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await query<Category>(`
    SELECT id, name, slug, description, image_url
    FROM categories
    WHERE slug = $1
  `, [slug]);
  
  return categories.length > 0 ? categories[0] : null;
}

// Function to get articles by category
async function getArticlesByCategory(categoryId: string): Promise<Article[]> {
  const articles = await query<Article>(`
    SELECT id, title, slug, excerpt, cover_image, author_name, published_at, created_at, reading_time
    FROM articles
    WHERE category_id = $1 AND status = 'published'
    ORDER BY published_at DESC, created_at DESC
  `, [categoryId]);
  
  return articles;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const slug =  params.slug;
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }
  
  const articles = await getArticlesByCategory(category.id);
  const defaultImage = '/images/hero-mother.avif';
  
  return (
    <div className="bg-white">
      {/* Category header */}
      <div className="relative bg-gray-900 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src={category.image_url || defaultImage}
            alt={category.name}
            fill 
            className="w-full h-full object-cover object-center opacity-30"
            priority
          />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-6 text-xl text-white">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Articles section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">
              No articles in this category yet.
            </h2>
            <p className="mt-4 text-gray-600">Check back soon for new content!</p>
            <Link 
              href="/blog" 
              className="mt-6 inline-block px-5 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
            >
              Browse All Articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {articles.map((article) => (
              <article key={article.id} className="flex flex-col">
                {/* Article image */}
                <div className="relative w-full h-60 mb-4 overflow-hidden rounded-lg">
                  <Link href={`/blog/${article.slug}`}>
                    <Image
                      src={article.cover_image || defaultImage}
                      alt={article.title}
                      fill
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </Link>
                </div>
                
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group">
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="hover:text-indigo-600 transition"
                  >
                    {article.title}
                  </Link>
                </h2>
                
                {/* Excerpt */}
                <p className="text-gray-600 mb-4 flex-1">
                  {article.excerpt}
                </p>
                
                {/* Metadata */}
                <div className="flex items-center text-sm text-gray-500 mt-auto">
                  <span>By {article.author_name}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={article.published_at || article.created_at}>
                    {formatDate(article.published_at || article.created_at)}
                  </time>
                  {article.reading_time && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{article.reading_time} min read</span>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Back to categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
        <Link 
          href="/category2" 
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          ← Back to all categories
        </Link>
      </div>
    </div>
  );
} 