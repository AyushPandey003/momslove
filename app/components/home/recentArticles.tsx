"use client";

import { useState, useEffect } from "react";
import GuideCards from "./guideCards";
import { recentArticles } from "@/app/data/data"; // Keep as fallback
import Link from 'next/link';
import { ArticleWithTags } from "@/app/lib/articles";

const articlesPerPage = 6;

export default function RecentArticles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<ArticleWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch articles from the API
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles?limit=20'); // Fetch enough articles for pagination
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        setArticles(data.articles);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Using fallback data.');
        // Use the hardcoded data as fallback
        setArticles(recentArticles.map(article => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          cover_image: article.coverImage,
          user_id: '1',
          author_name: article.author.name,
          created_at: new Date(),
          updated_at: new Date(),
          published_at: new Date(article.date),
          status: 'published',
          reading_time: 5,
          category_id: null,
          tags: article.tags?.map(tag => ({ id: tag, name: tag })) || [],
        })) as ArticleWithTags[]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  const totalPages = Math.ceil((articles?.length || 0) / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + articlesPerPage);

  if (loading) {
    return (
      <div className="w-[90%] mx-auto py-8">
        <h2 className="text-3xl font-bold text-black mb-8">Recent Articles</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto py-8">
      <h2 className="text-3xl font-bold text-black mb-8">Recent Articles</h2>
      
      {error && (
        <div className="bg-yellow-100 text-yellow-800 p-4 mb-6 rounded">
          {error}
        </div>
      )}

      <div className="space-y-10">
        {currentArticles.map((article, idx) => (
          <div key={article.id}>
            <div className="flex flex-col md:flex-row bg-white shadow-sm border border-gray-200 overflow-hidden transition-transform hover:scale-[1.01]">
              <div className="w-full md:w-2/5 aspect-square">
                <img src={article.cover_image} alt={article.title} className="object-cover w-full h-full" />
              </div>
              <div className="w-full md:w-2/3 p-6 flex flex-col justify-between text-black">
                <div className="flex gap-2 flex-wrap text-xs font-semibold mb-2">
                  {article.tags?.map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1">#{tag.name}</span>
                  ))}
                </div>
                <h3 className="text-4xl font-bold mb-1 font-serif">{article.title}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  By {article.author_name} • {new Date(article.published_at || article.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-4">{article.excerpt}</p>
                <div>
                  <Link href={`/blog/${article.slug}`} className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold  hover:bg-gray-800 transition">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>

            {idx === 2 && currentPage===1 && (
              <div className="my-16">
                <GuideCards />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Numbered Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded border ${
              page === currentPage
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            } transition`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
