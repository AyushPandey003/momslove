import { getAllArticles } from '@/app/data/articles';
import ArticleCard from '@/app/components/articles/ArticleCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles - MomsLove',
  description: 'Explore our collection of articles about motherhood, parenting, and self-care.',
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <main className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Articles
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Explore our collection of articles about motherhood, parenting, and self-care
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div key={article.id}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 