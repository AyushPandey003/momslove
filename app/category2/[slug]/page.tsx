import { getCategoryBySlug } from '@/app/lib/categories';
import { getArticlesByCategory } from '@/app/lib/articles';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CategoryLayout from '@/app/components/category/layout';
import { Metadata } from 'next';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }
  
  return {
    title: `${category.name} | MomsLove`,
    description: category.description || `Articles about ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    notFound();
  }
  
  // Get articles for this category
  const articles = await getArticlesByCategory(params.slug);

  return (
    <CategoryLayout>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-center mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-center text-gray-600 max-w-3xl mx-auto">{category.description}</p>
          )}
        </header>
        
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found in this category yet.</p>
            <Link href="/category2" className="mt-4 inline-block text-blue-600 hover:underline">
              Browse other categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link 
                key={article.id}
                href={`/blog/${article.slug}`}
                className="block group"
              >
                <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.cover_image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex gap-2 flex-wrap mb-2">
                      {article.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-full">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3 flex-grow">
                      {article.excerpt.length > 120
                        ? `${article.excerpt.substring(0, 120)}...`
                        : article.excerpt}
                    </p>
                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        By {article.author_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(article.published_at || article.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </CategoryLayout>
  );
} 