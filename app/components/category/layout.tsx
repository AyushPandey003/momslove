'use client';

import { ReactNode } from 'react';
import Navbar from '../layout/navbar2';

interface CategoryLayoutProps {
  children: ReactNode;
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      
      {/* Main content */}
      <main className="pt-20">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4">MomsLove</h3>
          <p className="text-sm mb-4">Your source for insightful articles and motherhood-related content.</p>
          <div className="flex justify-center gap-4">
            <a href="/about2" className="hover:underline">About</a>
            <a href="/contacts" className="hover:underline">Contact</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 