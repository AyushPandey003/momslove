import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/app/types';
import { format } from 'date-fns';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { title, excerpt, author, slug, category, date, coverImage } = article;
  
  const isFeatured = variant === 'featured';
  
  return (
    <div className={`group overflow-hidden rounded-lg shadow-md dark:shadow-gray-800/30 transition hover:shadow-lg dark:bg-gray-900 ${isFeatured ? 'md:grid md:grid-cols-2' : ''}`}>
      <div className={`aspect-h-9 aspect-w-16 relative overflow-hidden ${isFeatured ? 'h-full max-h-full' : 'h-48 sm:h-56'}`}>
        <Link href={`/articles/${slug}`}>
          <div className="absolute inset-0">
            <Image
              src={coverImage || '/images/placeholder.jpg'}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={isFeatured}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          </div>
          <div className="absolute bottom-0 left-0 p-4">
            <span className="inline-block rounded-full bg-pink-600 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
              {category.replace('-', ' ')}
            </span>
          </div>
        </Link>
      </div>
      
      <div className={`p-5 ${isFeatured ? 'flex flex-col justify-center' : ''}`}>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2 mb-3">
          {author && author.image && (
            <Image
              src={author.image}
              alt={author.name}
              width={24}
              height={24}
              className="rounded-full h-6 w-6"
            />
          )}
          <span>{author?.name || 'Anonymous'}</span>
          <span>•</span>
          {date && (
            <time dateTime={new Date(date).toISOString()}>{format(new Date(date), 'MMMM d, yyyy')}</time>
          )}
        </div>
        
        <h3 className={`font-bold text-gray-900 dark:text-white ${isFeatured ? 'text-2xl mb-3' : 'text-xl mb-2'}`}>
          <Link href={`/articles/${slug}`} className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
            {title}
          </Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
          {excerpt}
        </p>
        
        <Link 
          href={`/articles/${slug}`}
          className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
        >
          Read more
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
} 