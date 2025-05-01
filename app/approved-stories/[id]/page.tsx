import { getStoryById } from '@/app/lib/stories';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

interface StoryPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params: { id } }: StoryPageProps): Promise<Metadata> {
  const story = await getStoryById(id);
  
  if (!story || story.status !== 'approved') {
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

export default async function StoryPage({ params }: StoryPageProps) {
  const story = await getStoryById(params.id);
  
  if (!story || story.status !== 'approved') {
    notFound();
  }

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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/approved-stories" 
          className="inline-block mb-8 text-blue-600 hover:underline"
        >
          ← Back to all stories
        </Link>
        
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
        
        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">Have your own experience to share?</p>
          <Link 
            href="/submit-story" 
            className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Submit Your Story
          </Link>
        </div>
      </div>
    </div>
  );
} 