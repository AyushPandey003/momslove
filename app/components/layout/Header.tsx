'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Articles', href: '/articles' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center font-bold text-xl text-pink-700 dark:text-pink-400"
            >
              <span className="sr-only">MomsLove</span>
              {/* Logo SVG */}
              <svg 
                className="h-8 w-8 mr-2" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" 
                  fill="currentColor" 
                />
                <path 
                  d="M16 9C16.5523 9 17 8.55228 17 8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8C15 8.55228 15.4477 9 16 9Z" 
                  fill="currentColor" 
                />
                <path 
                  d="M12 18C15 18 16.5 15.5 17 14" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
              MomsLove
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pink-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-pink-400 dark:hover:bg-gray-800"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          
          <div className="flex md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-pink-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-pink-400"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? 'true' : 'false'}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-pink-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-pink-400"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
} 