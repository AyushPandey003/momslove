import { getStories } from '@/app/lib/stories';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Approved Stories | MomsLove',
  description: 'Read the stories shared by our community members.',
};

export default async function ApprovedStoriesPage() {
  const stories = await getStories('approved');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12 leading-tight">
        🌸 Community Stories
      </h1>

      {stories.length === 0 ? (
        <div className="text-center py-16 max-w-2xl mx-auto">
          <p className="text-lg text-gray-600 mb-6">
            There are no approved stories yet. Be the first to share your inspiring journey!
          </p>
          <Link
            href="/submit-story"
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-base font-medium rounded-full shadow hover:opacity-90 transition"
          >
            ✍️ Submit Your Story
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Shared by {story.user_name} on{' '}
                {new Date(story.approved_at || story.submitted_at).toLocaleDateString()}
              </p>

              <div className="prose prose-sm max-w-none text-gray-800 line-clamp-4 mb-4">
                {story.content.length > 300
                  ? `${story.content.substring(0, 300)}...`
                  : story.content}
              </div>

              <Link
                href={`/approved-stories/${story.id}`}
                className="inline-block mt-2 text-sm font-semibold text-pink-600 hover:underline"
              >
                Read Full Story →
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <p className="text-md text-gray-600 mb-4">Have your own story to inspire others?</p>
        <Link
          href="/submit-story"
          className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-base font-medium rounded-full shadow hover:opacity-90 transition"
        >
          ✍️ Share Your Story
        </Link>
      </div>
    </div>
  );
}
