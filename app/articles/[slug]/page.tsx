import { getArticleBySlug, getRecentArticles } from '@/app/data/articles';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import ArticleCard from '@/app/components/articles/ArticleCard';
import { Metadata } from 'next';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const slug = await params.slug;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found - MomsLove',
    };
  }
  
  return {
    title: `${article.title} - MomsLove`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const slug = await params.slug;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }
  
  const relatedArticles = getRecentArticles(3).filter(a => a.id !== article.id).slice(0, 2);

  return (
    <main className="py-12 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article>
          {/* Article header */}
          <div className="mb-10 text-center">
            <Link 
              href={`/categories/${article.category}`} 
              className="inline-block mb-4 text-sm font-medium text-pink-600 dark:text-pink-400 uppercase tracking-wider"
            >
              {article.category.replace('-', ' ')}
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              {article.title}
            </h1>
            <div className="mt-4 flex items-center justify-center space-x-3 text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                {article.author.image && (
                  <Image 
                    src={article.author.image} 
                    alt={article.author.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-2"
                  />
                )}
                <span className="font-medium">{article.author.name}</span>
              </div>
              <span>•</span>
              <time dateTime={article.date}>{format(new Date(article.date), 'MMMM d, yyyy')}</time>
            </div>
          </div>

          {/* Article cover image */}
          <div className="relative h-64 sm:h-96 mb-10 rounded-xl overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article content */}
          <div className="max-w-prose mx-auto prose dark:prose-invert prose-pink prose-lg">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Author bio */}
          {article.author.bio && (
            <div className="mt-12 max-w-prose mx-auto border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex items-center">
                {article.author.image && (
                  <Image 
                    src={article.author.image} 
                    alt={article.author.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{article.author.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{article.author.bio}</p>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
              Related Articles
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 