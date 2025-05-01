import Image from 'next/image';
import Link from 'next/link';
import { RelatedArticle } from '@/app/types';

interface InterestingArticlesProps {
  articles: RelatedArticle[];
}

export default function InterestingArticles({ articles }: InterestingArticlesProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Interesting Articles to Read</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white shadow-md rounded overflow-hidden flex flex-col">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2 text-black">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{article.description}</p>
              <Link href={`/articles/${article.id}`}>
                <button className="bg-black text-white px-4 py-2 hover:bg-gray-800 mt-auto">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}