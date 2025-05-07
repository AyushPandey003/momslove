import { getStoryById } from '@/app/lib/stories';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { cache } from 'react';

interface StoryPageProps {
  params: {
    id: string;
  };
}

// Cache the story fetching logic to prevent duplicate requests
const getStory = cache(async (id: string) => {
  const story = await getStoryById(id);
  if (!story || story.status !== 'approved') return null;
  return story;
});

// Generate metadata for the page
export async function generateMetadata({ params: { id } }: StoryPageProps): Promise<Metadata> {
  const story = await getStory(id);
  
  if (!story) {
    return {
      title: 'Story Not Found',
      description: 'The requested story could not be found.',
    };
  }
  
  return {
    title: `${story.title} | MomsLove Community Stories`,
    description: story.content.substring(0, 160),
  };
}

// Separate component for story content to enable suspense boundaries
function StoryContent({ story }: { story: NonNullable<Awaited<ReturnType<typeof getStory>>> }) {
  const submittedDate = new Date(story.submitted_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format the content with proper paragraphs
  const formattedContent = story.content
    .split('\n')
    .filter(paragraph => paragraph.trim() !== '')
    .map((paragraph, index) => (
      <p key={index} className="mb-4 text-black dark:text-gray-100">
        {paragraph}
      </p>
    ));

  return (
    <article className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-3 text-black dark:text-white">{story.title}</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Shared by {story.user_name} on {submittedDate}
        </p>
      </header>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {formattedContent}
      </div>
    </article>
  );
}

// Loading fallback for the story content
function StoryLoading() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
      </div>
    </div>
  );
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = params;
  const story = await getStory(id);
  
  if (!story) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/approved-stories" 
          className="inline-block mb-8 text-blue-600 hover:underline"
          prefetch={true}
        >
          ← Back to all stories
        </Link>
        
        <Suspense fallback={<StoryLoading />}>
          <StoryContent story={story} />
        </Suspense>
        
        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">Have your own experience to share?</p>
          <Link 
            href="/submit-story" 
            className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
            prefetch={true}
          >
            Submit Your Story
          </Link>
        </div>
      </div>
    </div>
  );
} 