'use client';

import ArticleCard from '../articles/ArticleCard';
import { getRecentArticles } from '@/app/data/articles';
import * as React from 'react';

// Import specific components from framer-motion
const motion = {
  div: React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>{children}</div>
  ))
};

motion.div.displayName = 'motion.div';

export default function FeaturedArticles() {
  const featuredArticles = getRecentArticles(3);
  
  
  
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Featured Articles
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Discover our most touching tributes and insightful reflections on motherhood
          </p>
        </div>
        
        <div 
          className="grid gap-8 md:grid-cols-3"
        >
          {featuredArticles.map((article) => (
            <div key={article.id}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}