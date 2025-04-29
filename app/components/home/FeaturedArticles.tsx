import ArticleCard from '../articles/ArticleCard';
import { getAllArticles, getRecentArticles } from '@/app/data/articles';
import { Article } from '@/app/types';
import { auth } from '@/auth'; // Import server-side auth
import { Pool } from '@neondatabase/serverless';


const MAX_ARTICLES_TO_SHOW = 3;

// Helper function to get preferences (avoids duplicating pool setup)
async function getUserPreferences(userId: string): Promise<string[]> {
  // Ensure the DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL environment variable in FeaturedArticles");
    return []; // Return empty if DB URL is missing
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add SSL config if needed
  });

  try {
    const result = await pool.query(
      'SELECT "categorySlug" FROM "user_preferences" WHERE "user_id" = $1',
      [userId]
    );
    // Ensure pool is closed after query if not using a shared pool instance
    // await pool.end(); // Consider connection pooling strategy for production
    return result.rows.map(row => row.categorySlug);
  } catch (error) {
    console.error('Error fetching preferences in FeaturedArticles:', error);
    // await pool.end(); // Ensure pool is closed on error too
    return []; // Return empty on error
  }
  // Note: In a real app, manage the DB connection pool more robustly.
  // Creating a new pool for each request is inefficient.
}

// Make the component async to fetch data server-side
export default async function FeaturedArticles() {
  const session = await auth(); // Get session on the server
  const userId = session?.user?.id;
  let preferredSlugs: string[] = [];

  if (userId) {
    preferredSlugs = await getUserPreferences(userId);
  }

  const allArticles = getAllArticles(); // Assuming this reads static data quickly
  let displayedArticles: Article[] = [];

  if (preferredSlugs.length > 0) {
    const preferredArticles = allArticles
      .filter(article => preferredSlugs.includes(article.category))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const otherArticles = allArticles
      .filter(article => !preferredSlugs.includes(article.category))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const combined = [...preferredArticles, ...otherArticles];
    const uniqueArticleIds = new Set<string>();
    displayedArticles = combined.filter(article => {
      if (!uniqueArticleIds.has(article.id)) {
        uniqueArticleIds.add(article.id);
        return true;
      }
      return false;
    }).slice(0, MAX_ARTICLES_TO_SHOW);

  } else {
    // Fallback to most recent if no preferences or not logged in
    displayedArticles = getRecentArticles(MAX_ARTICLES_TO_SHOW);
  }

  const hasPreferences = preferredSlugs.length > 0;
  const title = hasPreferences ? "Articles For You" : "Featured Articles";
  const subtitle = hasPreferences
    ? "Based on your interests"
    : "Discover our most touching tributes and insightful reflections on motherhood";

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>

        {displayedArticles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {displayedArticles.map((article) => (
              <div key={article.id}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No articles found matching your preferences. Check out our latest content!
          </p>
        )}
      </div>
    </section>
  );
}
