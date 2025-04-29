'use client';

import Link from 'next/link';
import * as React from 'react';

type CategoryType = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  slug: string;
};

// Sample categories data
const categories: CategoryType[] = [
  {
    id: '1',
    title: 'Parenting Tips',
    description: 'Practical advice and strategies for mothers at every stage of parenting',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    slug: 'parenting-tips',
  },
  {
    id: '2',
    title: 'Baby Care',
    description: 'Essential information about newborn and infant care, health, and development',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    slug: 'baby-care',
  },
  {
    id: '3',
    title: 'Personal Stories',
    description: 'Real-life experiences and heartfelt narratives from mothers around the world',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    slug: 'personal-stories',
  },
  {
    id: '4',
    title: 'Work-Life Balance',
    description: 'Strategies for managing professional responsibilities alongside motherhood',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    slug: 'work-life-balance',
  },
  {
    id: '5',
    title: 'Health & Wellness',
    description: 'Resources for maternal physical and mental health, self-care, and well-being',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    slug: 'health-wellness',
  },
  {
    id: '6',
    title: 'Community Support',
    description: 'Connect with other mothers, find local resources, and build your village',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    slug: 'community-support',
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Explore By Category
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Discover resources, stories, and support tailored to your motherhood journey
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex flex-col rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-800/30"
            >
              <div className="mb-4 rounded-full bg-pink-100 p-3 text-pink-600 dark:bg-pink-900 dark:text-pink-300 w-fit">
                {category.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-400">{category.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">{category.description}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-pink-600 group-hover:text-pink-700 dark:text-pink-400 dark:group-hover:text-pink-300">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 