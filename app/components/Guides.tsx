import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

const guides: Guide[] = [
  {
    id: '1',
    title: 'Essential Baby Care Tips',
    description: 'Learn the fundamental practices for keeping your baby healthy and happy.',
    category: 'Baby Care',
    imageUrl: '/images/baby_care.avif',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Healthy Pregnancy Diet',
    description: 'Nutrition guide for expecting mothers to ensure a healthy pregnancy.',
    category: 'Pregnancy',
    imageUrl: '/images/womens_diet.avf',
    readTime: '7 min read'
  },
  {
    id: '3',
    title: 'Postpartum Recovery',
    description: 'Essential tips and advice for a smooth postpartum recovery journey.',
    category: 'Postpartum',
    imageUrl: '/images/postpartum.avif',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'Breastfeeding Guide',
    description: 'Comprehensive guide to successful breastfeeding for new mothers.',
    category: 'Breastfeeding',
    imageUrl: '/images/breastfeeding.avif',
    readTime: '8 min read'
  }
];

const categories = ['All', 'Baby Care', 'Pregnancy', 'Postpartum', 'Breastfeeding'];

export default function Guides() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredGuides = selectedCategory === 'All' 
    ? guides 
    : guides.filter(guide => guide.category === selectedCategory);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Expert Guides for Moms
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover helpful guides and tips to support your motherhood journey
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-pink-100'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <Link 
              href={`/guides/${guide.id}`} 
              key={guide.id}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="relative h-48 w-full">
                  <Image
                    src={guide.imageUrl}
                    alt={guide.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-pink-500 text-white text-xs font-medium rounded-full">
                      {guide.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{guide.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-500 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="mt-4 flex items-center text-pink-500 font-medium">
                    Read Guide
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/guides"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 transition-colors"
          >
            View All Guides
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 