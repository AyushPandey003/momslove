'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Heart, Share2 } from 'lucide-react';

interface CardProps {
  imageUrl: string;
  tags: string[];
  description: string;
  href: string;
  altText?: string;
}

export default function Card({
  imageUrl,
  tags,
  description,
  href,
  altText = 'Article Image',
}: CardProps) {
  return (
    <div
      className="min-w-[300px] bg-white  shadow-md border transition-all hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-400"
      tabIndex={0}
      aria-label={`Article card: ${description}`}
    >
      <Image
        src={imageUrl}
        alt={altText}
        width={300}
        height={200}
        className="w-full h-[200px] object-cover rounded-t-xl"
        loading="lazy"
      />

      <div className="p-4 flex flex-col justify-between h-full">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs font-semibold text-blue-700">
          {tags.map((tag, idx) => (
            <span key={idx} className="bg-blue-100 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-800 text-sm mb-3">{description}</p>

        {/* Actions */}
        <div className="flex justify-between items-center mt-auto">
          <Link
            href={href}
            className="text-blue-600 hover:underline text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            aria-label="Read more about this article"
          >
            Read More →
          </Link>
          <div className="flex gap-2">
            <button
              className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Bookmark this article"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Like this article"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Share this article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
