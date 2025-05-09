"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  article_count: number;
}

interface DestinationsCardProps {
  title: string;
}

const DestinationsCard: React.FC<DestinationsCardProps> = ({ title }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?withCounts=true');
        const data = await response.json();
        // Get top 5 categories by article count
        const topCategories = data.categories
          .sort((a: Category, b: Category) => b.article_count - a.article_count)
          .slice(0, 5);
        setCategories(topCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-sm mx-auto mb-8">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-4">
          <div className="bg-gray-100 h-24 flex items-center justify-center">
            <p>Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category2/${category.slug}`}
            className="block bg-black text-white h-24 relative flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            {/* Line ABOVE text */}
            <div className="absolute top-[40%] left-0 w-full h-px bg-white opacity-50 z-0"></div>

            {/* Category name and count */}
            <div className="relative z-10 px-4 bg-black text-white text-center">
              <p className="font-medium">{category.name}</p>
              {category.article_count > 0 && (
                <p className="text-sm text-gray-300">
                  {category.article_count} {category.article_count === 1 ? 'article' : 'articles'}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/category2"
        className="block w-full bg-black text-white py-3 mt-2 text-center hover:bg-gray-800 transition-colors"
      >
        View All Categories
      </Link>
    </div>
  );
};

export default DestinationsCard;
