'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/components/layout/navbar2';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryWithArticles {
  title: string;
  id: string;
  slug: string;
  description: string;
  article_count: number;
  items: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    readingTime: string;
    href: string;
  }>;
}

// Client component for UI
export default function CategoriesPage() {
  const [categoriesData, setCategoriesData] = useState<CategoryWithArticles[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/categories-with-articles');
        const data = await res.json();
        setCategoriesData(data.categories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
    
    // Initialize refs array
    carouselRefs.current = carouselRefs.current.slice(0, categoriesData.length);
  }, [categoriesData.length]);
  
  const scrollLeft = (index: number) => {
    if (carouselRefs.current[index]) {
      carouselRefs.current[index]!.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = (index: number) => {
    if (carouselRefs.current[index]) {
      carouselRefs.current[index]!.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium">Loading categories...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* ✅ Navbar at the top */}
      <Navbar />

      {/* Spacer to push content below navbar */}
      <div className="h-16" />

      {/* Page Title */}
      <div className="container mx-auto px-4 pt-6">
        <h2 className="text-3xl font-bold mb-6">Categories</h2>
      </div>

      {/* Category Carousels */}
      {categoriesData.length === 0 ? (
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">No categories found.</p>
        </div>
      ) : (
        categoriesData.map((category, index) => (
          <section key={index} className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-semibold">{category.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.article_count} {category.article_count === 1 ? 'article' : 'articles'}
                  {category.description && <span className="ml-2">• {category.description}</span>}
                </p>
              </div>
              
              {category.items.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollLeft(index)}
                    className="p-2 border hover:bg-gray-100"
                    aria-label="Scroll Left"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scrollRight(index)}
                    className="p-2 border hover:bg-gray-100"
                    aria-label="Scroll Right"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Card Carousel or Empty State */}
            {category.items.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">No articles in this category yet.</p>
                <Link
                  href={`/category2/${category.slug}`}
                  className="inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition"
                >
                  Browse this category
                </Link>
              </div>
            ) : (
              <div
                ref={(el) => {
                  carouselRefs.current[index] = el;
                }}
                className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
              >
                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="min-w-[300px] bg-white shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={300}
                      height={180}
                      className="w-full h-[180px] object-cover"
                    />

                    <div className="flex-1 flex flex-col p-4">
                      {/* Tag + reading time */}
                      <div className="text-xs text-gray-500 mb-2">
                        <span className="font-semibold">#{category.title}</span>
                        <span> · {item.readingTime}</span>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold mb-2 leading-tight">
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 flex-1">
                        {item.description}
                      </p>

                      {/* Read more button */}
                      <Link
                        href={item.href}
                        className="mt-auto inline-block bg-black text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}
