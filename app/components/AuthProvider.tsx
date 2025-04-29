'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // The SessionProvider component needs to be used in a client component.
  // We pass the session fetched on the server to avoid flickering.
  // Note: In Next.js App Router, session is often handled differently,
  // but SessionProvider is still useful for client components using useSession.
  return <SessionProvider>{children}</SessionProvider>;
}
