"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GuideCards from "./guideCards";
import Link from 'next/link';
import { ArticleWithTags } from "@/app/lib/articles";

const articlesPerPage = 6;

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function RecentArticles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<ArticleWithTags[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: articlesPerPage,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/articles?page=${currentPage}&limit=${articlesPerPage}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch articles: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data.articles);
        
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && articles.length === 0) {
    return (
      <div className="w-[90%] mx-auto py-8">
        <h2 className="text-3xl font-bold text-black mb-8">Recent Articles</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[90%] mx-auto py-8">
        <h2 className="text-3xl font-bold text-black mb-8">Recent Articles</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto py-8">
      <h2 className="text-3xl font-bold text-black mb-8">Recent Articles</h2>
      
      {articles.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No articles found.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {articles.map((article: ArticleWithTags, idx: number) => (
            <div key={article.id}>
              <div className="flex flex-col md:flex-row bg-white shadow-sm border border-gray-200 overflow-hidden transition-transform hover:scale-[1.01]">
                <div className="relative w-full md:w-2/5 aspect-square">
                  <Image src={article.cover_image} alt={article.title} fill style={{objectFit: 'cover'}} priority />
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
                    <Link href={`/blog/${article.slug}`} className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition">
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>

              {idx === 2 && currentPage === 1 && (
                <div className="my-16">
                  <GuideCards />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              } transition`}
              aria-label="Previous page"
            >
              &laquo;
            </button>
            
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              // Show current page, first/last page, and 1 page before/after current
              const shouldShow = 
                page === 1 || 
                page === pagination.totalPages || 
                Math.abs(page - currentPage) <= 1;
              
              // Show ellipsis for gaps
              if (!shouldShow) {
                // Only show ellipsis at appropriate breakpoints
                if (page === 2 || page === pagination.totalPages - 1) {
                  return <span key={page} className="px-2">…</span>;
                }
                return null;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[2rem] px-3 py-1 rounded border ${
                    page === currentPage
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  } transition`}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              className={`px-3 py-1 rounded border ${
                currentPage === pagination.totalPages
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              } transition`}
              aria-label="Next page"
            >
              &raquo;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
