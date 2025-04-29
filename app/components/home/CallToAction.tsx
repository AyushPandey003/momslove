'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

export default function CallToAction() {
  const router = useRouter();

  return (
    <section className="py-16 bg-pink-50 dark:bg-pink-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Share Your Mother&#39;s Day Story
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Honor your mother or a maternal figure who has made a difference in your life. Submit a brief tribute and we&#39;ll feature selected stories in our Mother&#39;s Day special collection.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <Button onClick={() => router.push('/submit-story')}>
                Submit Your Tribute
              </Button>
              <Link
                href="/approved-stories"
                className="text-pink-600 dark:text-pink-300 hover:underline text-sm sm:text-base"
              >
                View Approved Stories →
              </Link>
            </div>
          </div>

          <Image
            src="/images/hero.avif"
            alt="Mother's Day illustration"
            width={800}
            height={600}
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
