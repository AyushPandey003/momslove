import Link from 'next/link';
import Image from 'next/image';
import { getRecentArticles } from '@/app/lib/articles';
import { formatDate } from '@/app/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | MomsLove',
  description: 'Explore our collection of articles on motherhood, parenting tips, and inspiring stories.',
};

export default async function BlogPage({ 
  searchParams 
}: { 
  searchParams: { page?: string } 
}) {
  // Get page number from query params, default to page 1
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const pageSize = 6; // Number of articles per page
  
  // Get articles
  const allArticles = await getRecentArticles(50); // Fetch more than needed so we can paginate
  
  // Filter to only published articles
  const publishedArticles = allArticles.filter(
    article => article.status === 'published'
  );
  
  // Calculate pagination
  const totalArticles = publishedArticles.length;
  const totalPages = Math.ceil(totalArticles / pageSize);
  
  // Get articles for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentArticles = publishedArticles.slice(startIndex, endIndex);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gray-900 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="/images/hero-mother.avif"
            alt="Mother and child background"
            fill 
            className="w-full h-full object-cover object-center opacity-30"
            priority
          />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            MomsLove Blog
          </h1>
          <p className="mt-6 text-xl text-white">
            Explore our collection of articles on motherhood, parenting tips, and inspiring stories.
          </p>
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {currentArticles.map((article) => (
            <article key={article.id} className="flex flex-col">
              {/* Article image */}
              <div className="relative w-full h-60 mb-4 overflow-hidden rounded-lg">
                <Link href={`/blog/${article.slug}`}>
                  <Image
                    src={article.cover_image || '/images/hero-mother.avif'}
                    alt={article.title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>
              </div>
              
              {/* Category */}
              {article.category && (
                <div className="text-sm font-medium text-indigo-600 mb-2">
                  {article.category.name}
                </div>
              )}
              
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
                <time dateTime={article.published_at?.toString() || article.created_at.toString()}>
                  {formatDate(article.published_at || article.created_at)}
                </time>
                {article.reading_time && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{article.reading_time} min read</span>
                  </>
                )}
              </div>
              
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag.id} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              {currentPage > 1 && (
                <Link
                  href={`/blog?page=${currentPage - 1}`}
                  className="px-4 py-2 text-sm border rounded text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/blog?page=${page}`}
                  className={`px-4 py-2 text-sm rounded ${
                    page === currentPage
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </Link>
              ))}
              
              {currentPage < totalPages && (
                <Link
                  href={`/blog?page=${currentPage + 1}`}
                  className="px-4 py-2 text-sm border rounded text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 