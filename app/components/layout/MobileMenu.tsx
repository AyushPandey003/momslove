'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';
import LoginButton from '@/app/components/auth/LoginButton';
import LogoutButton from '@/app/components/auth/LogoutButton';
import type { Session } from 'next-auth'; // Import Session type

interface MobileMenuProps {
  navigation: { name: string; href: string }[];
  session: Session | null; // Pass session from server component
}

export default function MobileMenu({ navigation, session }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = session?.user;

  return (
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
        {/* Menu Icon (Hamburger/Close) */}
        {isMenuOpen ? (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu dropdown */}
      <div
        className={`${isMenuOpen ? 'block' : 'hidden'} absolute top-16 inset-x-0 z-20 origin-top transform transition md:hidden`}
        id="mobile-menu"
      >
        <div className="rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-pink-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-pink-400"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              {user ? (
                 <div className="px-3">
                    <LogoutButton userName={user.name} userImage={user.image} />
                 </div>
              ) : (
                <div className="px-3">
                    <LoginButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
