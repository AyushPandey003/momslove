import Image from 'next/image';
import { Calendar, Clock, Share2 } from 'lucide-react';
import { ContentBlock } from '@/app/types';

interface ArticleHeaderProps {
  title: string;
  author: string;
  date: string;
  readingTime: string;
  quote: string;
  initialContent: ContentBlock[];
}

export default function ArticleHeader({ title, author, date, readingTime, quote, initialContent }: ArticleHeaderProps) {
  return (
    <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8  shadow-lg">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-black">{title}</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span>By {author}</span>
          <span>
            <Calendar className="w-4 h-4 inline mr-1" /> {date}
          </span>
          <span>
            <Clock className="w-4 h-4 inline mr-1" /> {readingTime}
          </span>
        </div>
        <button className="flex items-center gap-1 text-black hover:text-gray-800">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
      <blockquote className="text-lg sm:text-xl italic text-gray-600 mb-8 border-l-4 border-gray-300 pl-4">
        {quote}
      </blockquote>
      {initialContent.map((block, index) => (
        <div key={index} className="mb-4">
          {block.type === 'text' ? (
            <p className="text-gray-800">{block.content}</p>
          ) : (
            <Image src={block.url} alt="Article Image" width={800} height={400} className="rounded w-full" />
          )}
        </div>
      ))}
    </div>
  );
}