import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] py-12 bg-white dark:bg-gray-900">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-pink-600 dark:text-pink-400">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mt-6">Page Not Found</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/">
            Return Home
          </Button>
          <Button href="/articles" variant="outline">
            Browse Articles
          </Button>
        </div>
      </div>
    </main>
  );
} 