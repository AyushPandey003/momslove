'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../layout/navbar2';

const posts = [
  {
    id: 1,
    title: "Perfect Mother's Day Brunch Recipes",
    image: '/images/hero-mother.avif',
    category: "Mother's Day",
    excerpt:
      "Treat Mom to a delightful brunch with these tried-and-true recipes that everyone will love.",
  },
  {
    id: 2,
    title: "Mother's Day Gift Guide",
    image: '/images/hero.avif',
    category: "Mother's Day",
    excerpt:
      "Find the perfect gift to show your appreciation this Mother's Day—gifts for every budget and style.",
  },
];

export default function HeroSection() {
  const [currentPost, setCurrentPost] = useState(0);
  const handlePrev = () =>
    setCurrentPost((p) => (p === 0 ? posts.length - 1 : p - 1));
  const handleNext = () =>
    setCurrentPost((p) => (p === posts.length - 1 ? 0 : p + 1));

  return (
    <section className="relative h-[70vh]">
      {/* background */}
      <Image
        src={posts[currentPost].image}
        alt="Hero"
        fill
        className="object-cover brightness-75"
      />

      {/* navbar */}
      <Navbar />

      {/* ↳ CARD + ARROWS WRAPPER */}
      <div
        className="
          absolute bottom-0
          left-2 sm:left-6 md:left-1/4 lg:left-[10%]
          flex
        "
      >
        {/* — YOUR CARD */}
        <div
          className="
            relative
            w-[90vw] sm:w-[75vw] md:w-[50vw] lg:w-[30vw] lg:h-[40vh]
            bg-white px-6 py-8 shadow-lg z-10
          "
        >
          {/* ← Prev inside */}
          <button
            onClick={handlePrev}
            className="absolute top-4 right-0 bg-black text-white p-2 hover:bg-gray-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* content */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {posts[currentPost].category}
          </p>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold leading-snug mb-2 text-black">
            {posts[currentPost].title}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            {posts[currentPost].excerpt}
          </p>
          <Link href={`/post/${posts[currentPost].id}`}>
            <button className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition">
              Read more
            </button>
          </Link>
        </div>

        {/* → Next outside, aligned at the same “top-4” line */}
        <button
          onClick={handleNext}
          className="ml-0 mt-4 h-8 bg-white text-black p-2 hover:bg-gray-800 transition z-20"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
