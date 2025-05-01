import Image from 'next/image';
import { ContentBlock } from '@/app/types';

interface AboutHeaderProps {
  name: string;
  quote: string;
  initialContent: ContentBlock[];
  socialLinks: { label: string; href: string; icon?: React.ReactNode }[];
}
interface AboutHeaderProps {
    name: string;
    quote: string;
    initialContent: ContentBlock[];
    socialLinks: { label: string; href: string; icon?: React.ReactNode }[];
  }
  


export default function AboutHeader({
  name,
  quote,
  initialContent,
  socialLinks,
}: AboutHeaderProps) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
        My name is {name}
      </h1>

      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-black hover:text-gray-800 text-sm border px-3 py-1 rounded-md shadow-sm transition"
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>

      <blockquote className="text-lg sm:text-xl italic text-gray-600 mb-8 border-l-4 border-gray-300 pl-4 text-left sm:text-center sm:pl-0 sm:border-0">
        {quote}
      </blockquote>

      <div className="text-left">
        {initialContent.map((block, index) => (
          <div key={index} className="mb-4">
            {block.type === 'text' ? (
              <p className="text-gray-800">{block.content}</p>
            ) : (
              <Image
                src={block.url}
                alt="About Image"
                width={800}
                height={400}
                className="rounded w-full"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
