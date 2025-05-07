'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';
import { formatDate } from '@/app/lib/utils';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  excerpt: string;
}

interface ArticleListProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

export default function ArticleList({ articles, loading, error }: ArticleListProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Error loading articles: {error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
        <p className="text-gray-700 mb-4">You haven&apos;t created any articles yet.</p>
        <Link href="/dashboard/create-article">
          <Button>Create Your First Article</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div 
          key={article.id} 
          className="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">
                <Link href={`/blog/${article.slug}`} className="hover:text-blue-600 transition">
                  {article.title}
                </Link>
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {article.status === 'draft' ? 'Draft' : 'Published'} • {formatDate(article.updated_at)}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                {article.excerpt}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <Link href={`/dashboard/edit-article/${article.id}`}>
                <Button size="sm" variant="outline">Edit</Button>
              </Link>
              <Link href={`/blog/${article.slug}`} target="_blank">
                <Button size="sm" variant="outline">Preview</Button>
              </Link>
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <span className={`px-2 py-1 text-xs rounded-full ${
              article.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {article.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 