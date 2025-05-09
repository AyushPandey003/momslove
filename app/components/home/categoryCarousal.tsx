"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  article_count: number;
}

const VISIBLE_COUNT = 6; // number of cards visible at once

export default function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?withCounts=true');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? categories.length - VISIBLE_COUNT : prev - 1
    );
  };

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + VISIBLE_COUNT >= categories.length ? 0 : prev + 1
    );
  };

  const visibleCategories = categories.slice(
    startIndex,
    startIndex + VISIBLE_COUNT
  );

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Explore by Category</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Explore by Category</h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Previous Category"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Next Category"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative flex items-center gap-6 overflow-hidden h-64">
        {visibleCategories.map((category) => (
          <Link
            key={category.id}
            href={`/category2/${category.slug}`}
            className="flex-shrink-0 w-48 h-48 bg-gray-100 flex flex-col items-center justify-center text-center transition-transform duration-300 transform origin-center hover:scale-110 cursor-pointer shadow-md rounded-xl p-4"
          >
            <p className="text-lg font-semibold">{category.name}</p>
            {category.article_count > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {category.article_count} {category.article_count === 1 ? 'article' : 'articles'}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
