'use client';

import { FC } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { navLinks } from "@/app/data/data"; // Import navLinks data

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 text-white transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <span className="text-sm">Moms Love Blog</span>
        <button onClick={onClose}>
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Centered Content */}
      <div className="flex flex-col lg:flex-row justify-center items-center h-full px-10 gap-20">
        {/* Nav Links */}
        <nav className="space-y-10 text-5xl font-light w-full lg:w-1/3 h-1/2">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`block pl-4 hover:underline ${
                index === 0 ? "border-l-4 border-white font-medium" : "" // Apply special style for the first link (Home)
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Newsletter Card */}
        <aside className="w-full lg:w-1/3 bg-black bg-opacity-70 border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
          <p className="text-sm text-gray-300 mb-4">
            Subscribe to receive exclusive content updates, travel & photo tips!
          </p>
          <input
            type="email"
            placeholder="example@domain.com"
            className="w-full px-3 py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none placeholder-gray-400 text-sm"
          />
          <button className="w-full bg-white text-black text-sm py-2 hover:bg-gray-200 transition">
            Subscribe
          </button>
        </aside>
      </div>
    </div>
  );
};

export default HamburgerMenu;
