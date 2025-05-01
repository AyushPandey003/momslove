// // app/blog/sample-article/page.tsx

// import ArticlePage from "@/app/components/articles/newarticlesContent";

// interface TextBlock {
//   id: string;
//   type: 'text';
//   content: string;
// }

// interface ImageBlock {
//   id: string;
//   type: 'image';
//   url: string;
//   alt: string;
// }

// export default function SampleArticlePage() {
//   type ContentBlock = TextBlock | ImageBlock;
//   const toc = [
//     { id: "overview", label: "Overview" },
//     { id: "basics",   label: "The Basics" },
//     { id: "spring",   label: "Spring in Japan" },
//     { id: "summer",   label: "Summer in Japan" },
//     { id: "fall",     label: "Fall in Japan" },
//     { id: "winter",   label: "Winter in Japan" },
//   ];

//   const initialContent = [
//     {
//       id: "overview",
//       type: "text",
//       content:
//         "Japan is truly a year-round destination, and Japanese culture is remarkable in its profound appreciation of the changing seasons. As you’ll see when you visit…",
//     } as const, // Add 'as const'
//     {
//       id: "basics",
//       type: "text",
//       content:
//         "On the other hand, if your dates are flexible it’s worth thinking about which time of year you might enjoy most. After all, some travelers hate the cold — or the heat and humidity of summer…",
//     } as const, // Add 'as const'
//     {
//       id: "spring",
//       type: "image",
//       url: "/images/spring-cherry-blossoms.jpg",
//       alt: "Cherry blossoms in full bloom",
//     } as const, // Add 'as const'
//     {
//       id: "summer",
//       type: "image",
//       url: "/images/summer-festival.jpg",
//       alt: "Summer festival lanterns",
//     } as const, // Add 'as const'
//     // …and so on for fall, winter, etc.
//   ];

//   return (
//     <ArticlePage
//       title="When Is The Best Time of Year To Visit Japan?"
//       date="25.01.2021"
//       readingTime="8 minutes reading"
//       quote="The good news for travelers is that there is no single best time of year to travel to Japan — yet this makes it difficult to decide when to visit, as each of Japan’s seasons has its own special highlights."
//       toc={toc}
//       initialContent={initialContent}
//     />
//   );
// }


'use client';

import { Menu, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ArticlePage from '@/app/components/articles/newarticlesContent'; // Assuming ArticlePage is default export
import InterestingArticles from '../../components/articles/intrestingArticles';

// Sample data
const toc = [
  { id: "overview", label: "Overview" },
  { id: "basics", label: "The Basics" },
  { id: "spring", label: "Spring in Japan" },
  { id: "summer", label: "Summer in Japan" },
  { id: "fall", label: "Fall in Japan" },
  { id: "winter", label: "Winter in Japan" },
];

// Define the types for content blocks
interface TextBlock {
  id: string;
  type: 'text';
  content: string;
}

interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  alt: string;
}

type ContentBlock = TextBlock | ImageBlock;
const initialContent: ContentBlock[] = [ // Add explicit type annotation
  {
    id: "overview",
    type: "text",
    content:
      "Japan is truly a year-round destination, and Japanese culture is remarkable in its profound appreciation of the changing seasons. As you’ll see when you visit…",
  },
  {
    id: "basics",
    type: "text",
    content:
      "On the other hand, if your dates are flexible it’s worth thinking about which time of year you might enjoy most. After all, some travelers hate the cold — or the heat and humidity of summer…",
  },
  {
    id: "spring",
    type: "image",
    url: "/images/spring-cherry-blossoms.jpg",
    alt: "Cherry blossoms in full bloom",
  },
  {
    id: "summer",
    type: "image",
    url: "/images/summer-festival.jpg",
    alt: "Summer festival lanterns",
  },
];

const relatedArticles = [
  {
    id: '1',
    title: 'AI Basics',
    description: 'Learn the fundamentals of AI.',
    imageUrl: '/images/hero-mother.avif',
  },
  {
    id: '2',
    title: 'Machine Learning',
    description: 'Dive into ML concepts.',
    imageUrl: '/images/hero-mother.avif',
  },
  {
    id: '3',
    title: 'Deep Learning',
    description: 'Explore neural networks.',
    imageUrl: '/images/hero-mother.avif',
  },
];

export default function SingleArticlePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src="/images/hero-mother.avif"
          alt="Article Hero"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute top-0 left-0 right-0 z-50 bg-transparent">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Menu className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">BlogSphere</h1>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Search className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Article Content Overlapping Hero */}
  <div className="max-w-4xl mx-auto px-4 py-12 -mt-40 relative z-20">
    <ArticlePage
      title="When Is The Best Time of Year To Visit Japan?"
      date="25.01.2021"
      readingTime="8 minutes reading"
      quote="The good news for travelers is that there is no single best time of year to travel to Japan — yet this makes it difficult to decide when to visit, as each of Japan’s seasons has its own special highlights."
      toc={toc}
      initialContent={initialContent}
    />
  </div>

      {/* Related Articles */}
      <InterestingArticles articles={relatedArticles} />

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4">BlogSphere</h3>
          <p className="text-sm mb-4">Your source for insightful articles and guides.</p>
          <div className="flex justify-center gap-4">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}