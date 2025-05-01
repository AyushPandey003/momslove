'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import Navbar from '../components/layout/navbar2'; // ✅ Navbar component

const categoriesData = [
  {
    title: 'Technology',
    items: [
      {
        title: 'AI and Cloud Future',
        imageUrl: '/images/tech1.avif',
        tags: ['AI', 'Cloud'],
        description: 'Explore the future of AI and cloud computing.',
        href: '/articles/tech-ai',
        readingTime: '5 min read',
      },
      {
        title: 'Blockchain Revolution',
        imageUrl: '/images/tech2.avif',
        tags: ['Blockchain'],
        description: 'Blockchain transforming industries.',
        href: '/articles/blockchain',
        readingTime: '7 min read',
      },
    ],
  },
  {
    title: 'Design',
    items: [
      {
        title: 'Modern UI/UX Design',
        imageUrl: '/images/hero.avif',
        tags: ['UI', 'UX'],
        description: 'Modern user interfaces and experience.',
        href: '/articles/ui-ux',
        readingTime: '6 min read',
      },
      {
        title: 'Visual Storytelling Graphics',
        imageUrl: '/images/hero.avif',
        tags: ['Graphic'],
        description: 'Explore visual storytelling.',
        href: '/articles/graphic-design',
        readingTime: '4 min read',
      },
    ],
  },
];

export default function CategoriesPage() {
  const carouselRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollLeft = (index: number) => {
    carouselRefs.current[index]?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = (index: number) => {
    carouselRefs.current[index]?.scrollBy({ left: 320, behavior: 'smooth' });
  };

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
      {categoriesData.map((category, index) => (
        <section key={index} className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">{category.title}</h3>
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
          </div>

          {/* Card Carousel */}
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
        </section>
      ))}
    </div>
  );
}
