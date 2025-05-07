'use client';

import { FC, useState } from 'react';
import { Menu, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import HamburgerMenu from './hamburger';
import SearchModal from '../search/SearchModal';

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left section - Menu button & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">MomsLove</span>
            </Link>
          </div>

          {/* Center section - Quick links (desktop only) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/blog" className="text-gray-700 hover:text-black transition-colors">
              Blog
            </Link>
            <Link href="/submit-story" className="text-gray-700 hover:text-black transition-colors">
              Submit Story
            </Link>
            <Link href="/approved-stories" className="text-gray-700 hover:text-black transition-colors">
              Stories
            </Link>
            <Link href="/category2" className="text-gray-700 hover:text-black transition-colors">
              Categories
            </Link>
          </div>

          {/* Right section - Search & Account */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            
            {session ? (
              <Link 
                href="/dashboard" 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Dashboard"
              >
                <User className="w-5 h-5 text-gray-700" />
              </Link>
            ) : (
              <Link 
                href="/api/auth/signin" 
                className="text-sm font-medium text-gray-700 hover:text-black px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Fullscreen hamburger overlay */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
