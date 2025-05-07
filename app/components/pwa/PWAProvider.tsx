'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/app/utils/serviceWorkerRegistration';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
  }, []);

  return <>{children}</>;
} 