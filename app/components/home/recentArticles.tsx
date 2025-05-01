"use client";

import { useState } from "react";
import GuideCards from "./guideCards";

const articlesPerPage = 6;

const recentArticles = [
  { id: 1, title: "Next.js 15 Features", author: "Alice Brown", date: "2025-04-28", tags: ["Next.js","WebDev"], description: "Explore the exciting features released in Next.js 15 that improve performance, routing, and developer experience.", imageUrl: "/images/hero.avif" },
  { id: 2, title: "Tailwind CSS Tips", author: "Bob Wilson", date: "2025-04-27", tags: ["Tailwind","CSS"], description: "Discover expert Tailwind CSS tips to write cleaner, faster, and more maintainable utility-first styles.", imageUrl: "/images/hero.avif" },
  { id: 3, title: "TypeScript Best Practices", author: "Clara Adams", date: "2025-04-26", tags: ["TypeScript","JavaScript"], description: "Learn how to write robust TypeScript code with these best practices, patterns, and design strategies.", imageUrl: "/images/hero.avif" },
  { id: 4, title: "React Server Components", author: "David Smith", date: "2025-04-25", tags: ["React","Performance"], description: "Understand how React Server Components enhance performance by splitting server and client logic.", imageUrl: "/images/hero.avif" },
  { id: 5, title: "Advanced Git Techniques", author: "Eve Johnson", date: "2025-04-24", tags: ["Git","Version Control"], description: "Take your Git skills to the next level with rebase, cherry-pick, and submodules explained.", imageUrl: "/images/hero.avif" },
  { id: 6, title: "Docker for Beginners", author: "Frank Lee", date: "2025-04-23", tags: ["Docker","DevOps"], description: "Start containerizing your applications with this beginner-friendly Docker guide.", imageUrl: "/images/hero.avif" },
  { id: 7, title: "Next.js 15 Features", author: "Alice Brown", date: "2025-04-28", tags: ["Next.js","WebDev"], description: "Explore the exciting features released in Next.js 15 that improve performance, routing, and developer experience.", imageUrl: "/images/hero.avif" },
  { id: 8, title: "Tailwind CSS Tips", author: "Bob Wilson", date: "2025-04-27", tags: ["Tailwind","CSS"], description: "Discover expert Tailwind CSS tips to write cleaner, faster, and more maintainable utility-first styles.", imageUrl: "/images/hero.avif" },
  { id: 9, title: "TypeScript Best Practices", author: "Clara Adams", date: "2025-04-26", tags: ["TypeScript","JavaScript"], description: "Learn how to write robust TypeScript code with these best practices, patterns, and design strategies.", imageUrl: "/images/hero.avif" },
  { id: 10, title: "React Server Components", author: "David Smith", date: "2025-04-25", tags: ["React","Performance"], description: "Understand how React Server Components enhance performance by splitting server and client logic.", imageUrl: "/images/hero.avif" },
  { id: 11, title: "Advanced Git Techniques", author: "Eve Johnson", date: "2025-04-24", tags: ["Git","Version Control"], description: "Take your Git skills to the next level with rebase, cherry-pick, and submodules explained.", imageUrl: "/images/hero.avif" },
  { id: 12, title: "Docker for Beginners", author: "Frank Lee", date: "2025-04-23", tags: ["Docker","DevOps"], description: "Start containerizing your applications with this beginner-friendly Docker guide.", imageUrl: "/images/hero.avif" },
];

export default function RecentArticles() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(recentArticles.length / articlesPerPage);

  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = recentArticles.slice(startIndex, startIndex + articlesPerPage);

  return (
    <div className="w-[90%] mx-auto py-8">
      <h2 className="text-3xl font-bold text-black mb-8">Recent Articles</h2>

      <div className="space-y-10">
        {currentArticles.map((article, idx) => (
          <div key={article.id}>
            <div className="flex flex-col md:flex-row bg-white shadow-sm border border-gray-200 overflow-hidden transition-transform hover:scale-[1.01]">
              <div className="w-full md:w-2/5 aspect-square">
                <img src={article.imageUrl} alt={article.title} className="object-cover w-full h-full" />
              </div>
              <div className="w-full md:w-2/3 p-6 flex flex-col justify-between text-black">
                <div className="flex gap-2 flex-wrap text-xs font-semibold mb-2">
                  {article.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1">#{tag}</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-1">{article.title}</h3>
                <p className="text-sm text-gray-500 mb-3">By {article.author} • {article.date}</p>
                <p className="text-gray-700 mb-4">{article.description}</p>
                <div>
                  <button className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold rounded hover:bg-gray-800 transition">
                    Read More →
                  </button>
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
