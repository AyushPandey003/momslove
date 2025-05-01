import { getStories } from '@/app/lib/stories';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Approved Stories | MomsLove',
  description: 'Read the stories shared by our community members.',
};

export default async function ApprovedStoriesPage() {
  // Get approved stories
  const stories = await getStories('approved');

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Community Stories</h1>

      {stories.length === 0 ? (
        <div className="text-center py-12 max-w-2xl mx-auto">
          <p className="mb-6 text-gray-600">There are no approved stories yet. Be the first to share your story!</p>
          <Link 
            href="/submit-story" 
            className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Submit Your Story
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-12">
          {stories.map((story) => (
            <div key={story.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">{story.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Shared by {story.user_name} on {new Date(story.approved_at || story.submitted_at).toLocaleDateString()}
              </p>
              
              <div className="prose max-w-none mb-6">
                {/* Display the first 300 characters of the content */}
                <p>{story.content.length > 300 
                  ? `${story.content.substring(0, 300)}...` 
                  : story.content}
                </p>
              </div>
              
              <Link 
                href={`/approved-stories/${story.id}`} 
                className="inline-block px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
              >
                Read Full Story
              </Link>
            </div>
          ))}
        </div>
      )}
      
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
  );
}
