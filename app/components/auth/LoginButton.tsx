'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/app/components/ui/Button'; // Assuming Button component exists

export default function LoginButton() {
  return (
    <Button onClick={() => signIn('google')} variant="outline" size="sm">
      Sign In with Google
    </Button>
  );
}
