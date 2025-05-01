import Image from 'next/image';
import { ContentBlock } from '@/app/types';

interface ArticleBodyProps {
  mainContent: ContentBlock[];
}

export default function ArticleBody({ mainContent }: ArticleBodyProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {mainContent.map((block, index) => (
        <div key={index} className="mb-4">
          {block.type === 'text' ? (
            <p className="text-gray-800">{block.content}</p>
          ) : (
            <Image src={block.url} alt="Article Image" width={800} height={400} className="rounded" />
          )}
        </div>
      ))}
    </div>
  );
}