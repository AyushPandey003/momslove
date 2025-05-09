'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NewsletterCard from '../components/about/newslettercard';

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
    imageUrl: '/images/womens_diet.avif',
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

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      const matchesSearch = searchQuery === '' || 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || 
        guide.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      {/* Hero Section */}
      <div className="bg-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              Expert Guides for Moms
            </h1>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              Discover comprehensive guides and expert advice to support you through every stage of motherhood
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute right-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${category === selectedCategory
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-pink-100'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide) => (
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">
                No guides found matching your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 text-pink-500 hover:text-pink-600 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-pink-300 rounded-xl shadow-lg p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with New Guides
            </h2>
            <p className="text-slate-900 mb-6">
              Subscribe to our newsletter to receive new guides and expert advice directly in your inbox.
            </p>
          <div className="flex justify-center">
            <NewsletterCard
            title="Subscribe to our Newsletter" 
            placeholder="Enter your email address" 
          />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
} 