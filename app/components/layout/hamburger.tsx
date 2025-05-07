'use client';

import { FC } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { navLinks } from "@/app/data/data"; // Import navLinks data
import { useSession } from "next-auth/react";
import NewsletterForm from "@/app/components/layout/NewsletterForm";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  
  if (!isOpen) return null;

  // Group navigation links
  const mainLinks = navLinks.slice(0, 5); // Main site navigation
  const secondaryLinks = navLinks.slice(5); // Secondary links

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 text-white transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <span className="text-lg font-medium">MomsLove</span>
        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-10 h-[calc(100%-72px)] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
          {/* Main Links Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl text-gray-400 mb-4">Navigation</h3>
              <nav className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {mainLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={onClose}
                    className="text-2xl py-2 hover:text-gray-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div>
              <h3 className="text-xl text-gray-400 mb-4">About</h3>
              <nav className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {secondaryLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={onClose}
                    className="text-2xl py-2 hover:text-gray-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* User-specific links */}
            {session ? (
              <div>
                <h3 className="text-xl text-gray-400 mb-4">Your Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="text-2xl py-2 hover:text-gray-300 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/preferences"
                    onClick={onClose}
                    className="text-2xl py-2 hover:text-gray-300 transition-colors"
                  >
                    Preferences
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    onClick={onClose}
                    className="text-2xl py-2 hover:text-gray-300 transition-colors"
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <Link
                  href="/api/auth/signin"
                  onClick={onClose}
                  className="inline-block px-6 py-3 bg-white text-black text-lg font-medium rounded hover:bg-gray-200 transition"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col justify-center">
            <div className="bg-gray-900 border border-gray-700 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Join Our Newsletter</h3>
              <p className="text-gray-300 mb-6">
                Subscribe to receive exclusive content, stories, and updates from our community.
              </p>
              <NewsletterForm 
                source="hamburger-menu"
                buttonText="Subscribe"
                placeholderText="Your email address"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from MomsLove.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
