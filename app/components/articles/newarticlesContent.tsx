"use client";

import Image from "next/image";
import { Instagram, Linkedin, Twitter, Facebook } from "lucide-react";

type TextBlock = {
  id: string;
  type: "text";
  content: string;
};

type ImageBlock = {
  id: string;
  type: "image";
  url: string;
  alt?: string;
};

type ContentBlock = TextBlock | ImageBlock;

interface TocItem {
  id: string;
  label: string;
}

interface ArticlePageProps {
  title: string;
  date: string;
  readingTime: string;
  quote: string;
  toc: TocItem[];
  initialContent: ContentBlock[];
}

export default function ArticlePage({
  title,
  date,
  readingTime,
  quote,
  toc,
  initialContent,
}: ArticlePageProps) {
  return (
    <div className="bg-gray-100">
      <div className="py-12 bg-gray-100">
        <div className="relative max-w-5xl mx-auto bg-white px-6 py-10 sm:px-8 sm:py-12 shadow-lg">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-center text-black">
            {title}
          </h1>

          {/* Meta line */}
          <div className="mt-4 flex justify-center items-center space-x-2 text-sm text-gray-600">
            <span className="uppercase tracking-wider text-gray-500">Travels</span>
            <span>·</span>
            <span>{readingTime}</span>
            <span>·</span>
            <span>{date}</span>
          </div>

          {/* Social icons */}
          <div className="mt-4 flex justify-center space-x-4 text-gray-700">
            <Instagram className="w-5 h-5 hover:text-black cursor-pointer" />
            <Linkedin className="w-5 h-5 hover:text-black cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-black cursor-pointer" />
            <Facebook className="w-5 h-5 hover:text-black cursor-pointer" />
          </div>

          {/* Main content area */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar TOC */}
            <aside className="hidden md:block">
              <nav className="sticky top-28 space-y-2 text-sm text-gray-700">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block hover:text-black transition"
                  >
                    • {item.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Article body */}
            <article className="md:col-span-3 prose prose-lg prose-slate">
              <blockquote className="text-xl italic text-gray-600 border-l-4 border-gray-300 pl-4">
                {quote}
              </blockquote>

              {initialContent.map((block) => (
                <div key={block.id} id={block.id} className="mt-6">
                  {block.type === "text" ? (
                    <p>{block.content}</p>
                  ) : (
                    <div className="relative w-full h-64 sm:h-80">
                      <Image
                        src={block.url}
                        alt={block.alt ?? ""}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
