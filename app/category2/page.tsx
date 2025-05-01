import { getCategoryWithArticleCount } from '@/app/lib/categories';
import Link from 'next/link';
import CategoryLayout from '../components/category/layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories | MomsLove',
  description: 'Explore our diverse range of motherhood-related topics and categories.',
};

export default async function CategoriesPage() {
  // Fetch categories with article counts
  const categories = await getCategoryWithArticleCount();
  
  // Fallback to the hardcoded data if no categories found (or before migration)
  const fallbackCategories = [
    { 
      id: '1', 
      name: 'Parenting Tips', 
      slug: 'parenting-tips', 
      description: 'Practical advice for everyday parenting challenges',
      image_url: '/images/hero-mother.avif',
      created_at: new Date(),
      article_count: 5
    },
    { 
      id: '2', 
      name: 'Recipes', 
      slug: 'recipes', 
      description: 'Kid-friendly meals and time-saving cooking ideas',
      image_url: '/images/hero-mother.avif',
      created_at: new Date(),
      article_count: 3
    },
    { 
      id: '3', 
      name: 'Self-Care', 
      slug: 'self-care', 
      description: 'Taking care of yourself while taking care of others',
      image_url: '/images/hero-mother.avif',
      created_at: new Date(),
      article_count: 4
    },
    { 
      id: '4', 
      name: 'Stories', 
      slug: 'stories', 
      description: 'Real-life experiences from our community',
      image_url: '/images/hero-mother.avif',
      created_at: new Date(),
      article_count: 6
    },
  ];
  
  // Use database categories if available, otherwise use fallback
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <CategoryLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Explore Categories</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCategories.map((category) => (
            <Link 
              key={category.id}
              href={`/category2/${category.slug}`}
              className="block group"
            >
              <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={category.image_url || '/images/default-category.jpg'} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="text-xl font-bold text-white">{category.name}</h2>
                    <p className="text-white/80 text-sm">{category.article_count} articles</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600">{category.description || `Explore our collection of articles about ${category.name}`}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </CategoryLayout>
  );
}
