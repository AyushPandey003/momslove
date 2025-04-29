import { getCategoryBySlug } from '@/app/data/categories';
import { getArticlesByCategory } from '@/app/data/articles';
import { notFound } from 'next/navigation';
import ArticleCard from '@/app/components/articles/ArticleCard';
import { Metadata } from 'next';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const slug = await params.slug;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found - MomsLove',
    };
  }
  
  return {
    title: `${category.name} - MomsLove`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const slug = await params.slug;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }
  
  const articles = getArticlesByCategory(slug);

  return (
    <main className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-pink-100 p-4 text-pink-600 dark:bg-pink-900 dark:text-pink-300">
              {category.icon}
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {category.description}
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div key={article.id}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">
              No articles found in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  );
} 