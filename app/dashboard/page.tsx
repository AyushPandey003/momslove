import Link from 'next/link';
import { getUserStories } from '@/app/lib/stories';
import { getUserArticles } from '@/app/lib/articles';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import StoryList from '@/app/components/dashboard/StoryList';
import ArticleList from '@/app/components/dashboard/ArticleList';

// Loading fallback for stories
function StoriesLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );
}

// Loading fallback for articles
function ArticlesLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );
}

async function StoriesSection({ userId }: { userId: string }) {
  // Fetch stories with a reasonable timeout for Suspense boundary
  const stories = await getUserStories(userId);
  
  return (
    <StoryList
      stories={stories}
      loading={false}
      error={null}
    />
  );
}

async function ArticlesSection({ userId }: { userId: string }) {
  // Fetch user's articles
  const articles = await getUserArticles(userId);
  
  // Convert dates to strings
  const formattedArticles = articles.map(article => ({
    ...article,
    created_at: article.created_at.toISOString(),
    updated_at: article.updated_at.toISOString()
  }));
  
  return (
    <ArticleList
      articles={formattedArticles}
      loading={false}
      error={null}
    />
  );
}

export default async function UserDashboardPage() {
  const session = await auth();
  
  // Redirect unauthenticated users
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }
  
  const isAdmin = session.user.admin === true;
  
  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
          <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Quick Links</h2>
          <ul className="space-y-2">
            {isAdmin && (
              <li>
                <Link 
                  href="/dashboard/create-article" 
                  className="text-blue-600 dark:text-blue-300 hover:underline"
                  prefetch={true}
                >
                  Create New Blog Post
                </Link>
              </li>
            )}
            <li>
              <Link 
                href="/submit-story" 
                className="text-blue-600 dark:text-blue-300 hover:underline"
                prefetch={true}
              >
                Submit a Story
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/profile" 
                className="text-blue-600 dark:text-blue-300 hover:underline"
                prefetch={true}
              >
                Manage Profile
              </Link>
            </li>
            <li>
              <Link 
                href="/preferences" 
                className="text-blue-600 dark:text-blue-300 hover:underline"
                prefetch={true}
              >
                Manage Preferences
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link 
                  href="/admin" 
                  className="text-blue-600 dark:text-blue-300 hover:underline"
                  prefetch={true}
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg border border-green-100 dark:border-green-800 md:col-span-2">
          <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Welcome, {session.user.name || 'User'}!</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-3">
            This is your personal dashboard where you can manage your content, track submissions, 
            and create new posts. Use the quick links to navigate or view your content below.
          </p>
          <Link 
            href="/dashboard/profile" 
            className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            prefetch={true}
          >
            Complete Your Profile
          </Link>
        </div>
      </div>
      
      {isAdmin && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Articles</h2>
            <Link 
              href="/dashboard/create-article" 
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
              prefetch={true}
            >
              Create New Article
            </Link>
          </div>
          
          <Suspense fallback={<ArticlesLoading />}>
            <ArticlesSection userId={session.user.id} />
          </Suspense>
        </div>
      )}
      
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Stories</h2>
          <Link 
            href="/submit-story" 
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            prefetch={true}
          >
            Submit New Story
          </Link>
        </div>
        
        <Suspense fallback={<StoriesLoading />}>
          <StoriesSection userId={session.user.id} />
        </Suspense>
      </div>
      
      <div className="mt-10 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">What happens next?</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-lg text-black dark:text-white">Submission</h3>
              <p className="text-gray-600 dark:text-gray-300">Your story is submitted and awaiting review by our team.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-lg text-black dark:text-white">Review</h3>
              <p className="text-gray-600 dark:text-gray-300">Our team reviews your story for content and clarity.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-lg text-black dark:text-white">Publication</h3>
              <p className="text-gray-600 dark:text-gray-300">
                If approved, your story will be published and visible in the approved stories section.
                Some stories may be selected for conversion to featured blog posts!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 