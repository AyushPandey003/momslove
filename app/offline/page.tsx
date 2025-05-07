import React from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-black">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400 mb-6"
      >
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
      
      <h1 className="text-3xl font-bold mb-2 text-center">You&apos;re offline</h1>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        It looks like you&apos;re not connected to the internet right now. Some features may be unavailable until you&apos;re back online.
      </p>
      
      <div className="space-y-4 w-full max-w-md">
        <Link 
          href="/"
          className="block w-full py-3 px-4 bg-black text-white text-center font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          Try again
        </Link>
        
        <div className="bg-gray-50 p-4 rounded-md text-sm">
          <h3 className="font-medium mb-2">While you&apos;re offline you can:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>View previously cached pages</li>
            <li>Read articles you&apos;ve opened before</li>
            <li>Check out the latest content when you reconnect</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 