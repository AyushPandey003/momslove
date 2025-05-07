import { getArticleBySlug } from '@/app/lib/articles';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Use dynamic import for client components
const CommentSection = dynamic(() => import('@/app/components/comments/CommentSection'), {
});

interface BlogPostParams {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }
  
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: article.cover_image,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
      type: 'article',
      publishedTime: article.published_at?.toISOString(),
      modifiedTime: article.updated_at.toISOString(),
      authors: [article.author_name],
      tags: article.tags.map(tag => tag.name),
    },
  };
}

export default async function BlogPost({ params }: BlogPostParams) {
  const slug = params.slug;

  const article = await getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className="bg-white text-black">
      {/* Hero image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh]">
        <Image
          src={article.cover_image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl mx-auto leading-tight">
              {article.title}
            </h1>
          </div>
        </div>
      </div>
      
      {/* Article content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Article metadata */}
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              By <span className="font-semibold">{article.author_name}</span> • {formattedDate}
              {article.reading_time && <> • {article.reading_time} min read</>}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {article.tags.map((tag) => (
                <Link 
                  key={tag.id} 
                  href={`/tags/${tag.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Article body */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
          
          {/* Author info */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-bold mb-2">About the Author</h3>
            <p>{article.author_name}</p>
          </div>
          
          {/* Comments section */}
          <div className="mt-12">
            <CommentSection articleId={article.id} />
          </div>
          
          {/* Related articles placeholder - can be implemented later */}
        </div>
      </div>
    </div>
  );
}
