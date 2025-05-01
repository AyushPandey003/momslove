"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const moreArticles = [
  { id: 1, title: 'Deep Learning Intro', author: 'David Lee', date: '2025-04-25' },
  { id: 2, title: 'React Hooks Guide', author: 'Emma White', date: '2025-04-24' },
  { id: 3, title: 'Node.js Performance', author: 'Frank Green', date: '2025-04-23' },
  { id: 4, title: 'CSS Grid Layout', author: 'Grace Blue', date: '2025-04-22' },
];

export default function MoreArticles() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">More Articles</h2>
      <div className="space-y-6">
        {moreArticles.map((article) => (
          <div key={article.id} className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold">{article.title}</h3>
            <p className="text-sm text-gray-600">
              By {article.author} | {article.date}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="p-2 hover:bg-gray-100 rounded"
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}