'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/app/components/ui/Button'; // Assuming Button component exists
import Image from 'next/image'; // To display user image

interface LogoutButtonProps {
  userName?: string | null;
  userImage?: string | null;
}

export default function LogoutButton({ userName, userImage }: LogoutButtonProps) {
  return (
    <div className="flex items-center gap-2">
      {userImage && (
        <Image
          src={userImage}
          alt={userName || 'User avatar'}
          width={24}
          height={24}
          className="rounded-full"
        />
      )}
      {userName && <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">Hi, {userName}!</span>}
      <Button onClick={() => signOut()} variant="outline" size="sm">
        Sign Out
      </Button>
    </div>
  );
}
