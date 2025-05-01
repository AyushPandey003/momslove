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

import Image from 'next/image';
import Link from 'next/link';
import ArticlePage from '@/app/components/articles/newarticlesContent'; // Assuming ArticlePage is default export
import InterestingArticles from '../../components/articles/intrestingArticles';
import { sampleArticle, blogPageFooterLinks } from '@/app/data/data'; // Import data
import Navbar from '@/app/components/layout/navbar2';


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
        <Navbar/>
      </section>

      {/* Article Content Overlapping Hero */}
  <div className="max-w-4xl mx-auto px-4 py-12 -mt-40 relative z-20">
    <ArticlePage
      title={sampleArticle.title}
      date={sampleArticle.date}
      readingTime={sampleArticle.readingTime}
      quote={sampleArticle.quote}
      toc={sampleArticle.toc}
      initialContent={sampleArticle.initialContent}
    />
  </div>

      {/* Related Articles */}
      <InterestingArticles articles={sampleArticle.relatedArticles} />

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4">MomsLove</h3>
          <p className="text-sm mb-4">Your source for insightful articles and guides.</p>
          <div className="flex justify-center gap-4">
            {blogPageFooterLinks.map((link, index) => (
              <Link key={index} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
