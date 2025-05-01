'use client';

import { FC, useState } from 'react';
import { Menu, Search } from 'lucide-react';
import HamburgerMenu from './hamburger';

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Menu className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-xl font-bold text-black">Moms Love Blog</h1>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Search className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>

      {/* Fullscreen hamburger overlay */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
