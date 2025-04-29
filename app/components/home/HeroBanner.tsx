'use client';

import Image from 'next/image';
import { Button } from '@/app/components/ui/Button';

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image 
          src="/images/backg.jpg" 
          alt="Background pattern" 
          fill 
          className="object-cover"
          priority
        />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-0">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight text-pink-700 dark:text-pink-400 sm:text-5xl xl:text-6xl">
                Celebrating All Mothers
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-700 dark:text-gray-300">
                Join us in honoring the women who shape our world through love, sacrifice, and wisdom. Explore stories, advice, and tributes dedicated to mothers everywhere.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Button href="/articles" size="lg">
                  Read Stories
                </Button>
                <Button href="/categories" variant="outline" size="lg">
                  Explore Categories
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[6/5] w-full max-w-lg rounded-2xl overflow-hidden shadow-xl lg:max-w-none">
              <Image
                src="/images/hero-mother.avif"
                alt="Mother and child"
                width={600}
                height={500}
                className="h-full w-full object-cover object-center"
                priority
              />
            </div>
            
            <div className="absolute -top-4 -right-4 -z-10 w-[calc(100%+2rem)] h-[calc(100%+2rem)] rounded-2xl bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800"/>
            
            <div className="absolute -bottom-4 -left-4 w-64 h-24 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4">
              <p className="text-pink-700 dark:text-pink-400 font-semibold">
                "A mother's love is the fuel that enables a normal human being to do the impossible."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 