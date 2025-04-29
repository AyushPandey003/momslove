import { getAllCategories } from '@/app/data/categories';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories - MomsLove',
  description: 'Explore our content by categories to find resources tailored to your motherhood journey.',
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <main className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Categories
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Explore our content by categories to find resources tailored to your motherhood journey
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex flex-col rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-800/30"
            >
              <div className="mb-4 rounded-full bg-pink-100 p-3 text-pink-600 dark:bg-pink-900 dark:text-pink-300 w-fit">
                {category.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-400">{category.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">{category.description}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-pink-600 group-hover:text-pink-700 dark:text-pink-400 dark:group-hover:text-pink-300">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 