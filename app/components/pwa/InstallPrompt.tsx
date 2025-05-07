'use client';

import { useState, useEffect } from 'react';
import { checkInstallable } from '@/app/utils/serviceWorkerRegistration';
import { X } from 'lucide-react';

export default function InstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<{ promptInstall: () => void } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const hasDismissed = localStorage.getItem('pwa-install-dismissed');
    if (hasDismissed === 'true') {
      setDismissed(true);
      return;
    }

    const prompt = checkInstallable(
      () => setIsVisible(true),
      () => setIsVisible(false)
    );
    
    setInstallPrompt(prompt);
  }, []);

  const handleInstall = () => {
    if (installPrompt) {
      installPrompt.promptInstall();
      setIsVisible(false);
    }
  };

  const dismissPrompt = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!isVisible || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <button 
        onClick={dismissPrompt}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X size={18} />
      </button>
      
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-black"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-black">Install MomsLove App</h3>
          <p className="mt-1 text-xs text-gray-600">
            Add to your home screen for a better experience and offline access.
          </p>
          
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
            >
              Install
            </button>
            <button
              onClick={dismissPrompt}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 