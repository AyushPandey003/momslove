'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type Story = {
  id: string;
  title: string;
  content: string;
  user_name: string;
  status: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type FormValues = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categoryId: string;
  tags: string[];
  status: 'draft' | 'published';
};

export default function ConvertStoryPage({ params }: { params: { storyId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      categoryId: '',
      tags: [],
      status: 'draft'
    }
  });
  
  // Watch the title to generate a slug
  const title = watch('title');
  
  // Automatically generate slug from title
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      
      setValue('slug', slug);
    }
  }, [title, setValue]);
  
  // Fetch story and categories data
  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setIsLoading(true);
        
        // Fetch the story
        const storyResponse = await fetch(`/api/stories/${params.storyId}`);
        if (!storyResponse.ok) {
          throw new Error('Failed to fetch story');
        }
        const storyData = await storyResponse.json();
        setStory(storyData.story);
        
        // Pre-populate form with story data
        setValue('title', storyData.story.title);
        setValue('content', storyData.story.content);
        
        // Generate excerpt (first 150 characters)
        const excerpt = storyData.story.content.substring(0, 150) + 
          (storyData.story.content.length > 150 ? '...' : '');
        setValue('excerpt', excerpt);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);
        
        // Fetch tags
        const tagsResponse = await fetch('/api/tags');
        if (!tagsResponse.ok) {
          throw new Error('Failed to fetch tags');
        }
        const tagsData = await tagsResponse.json();
        setTags(tagsData.tags);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [status, params.storyId, setValue]);
  
  const onSubmit = async (data: FormValues) => {
    if (status !== 'authenticated') {
      setError('You must be logged in to convert a story');
      return;
    }
    
    if (!story) {
      setError('Story data is missing');
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    setError(null);
    
    try {
      // Create article from story
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          category_id: data.categoryId || null,
          tags: data.tags,
          status: data.status,
          cover_image: '/images/default-cover.jpg', // Default cover image
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create article');
      }
      
      const result = await response.json();
      
      setMessage('Story successfully converted to article!');
      
      // Redirect to the new article after a short delay
      setTimeout(() => {
        router.push(`/blog/${data.slug}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error converting story:', error);
      setError('Failed to convert story to article');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if user is admin
  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Convert Story to Article</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (status === 'unauthenticated' || !session?.user.admin) {
    router.push('/');
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Convert Story to Article</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  if (!story) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Convert Story to Article</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          <p>Story not found or failed to load.</p>
        </div>
      </div>
    );
  }
  
  if (story.status !== 'approved') {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Convert Story to Article</h1>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
          <p>Only approved stories can be converted to articles. This story is currently: {story.status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Convert Story to Article</h1>
      
      {error && (
        <div className="mb-6 bg-red-100 text-red-800 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      {message && (
        <div className="mb-6 bg-green-100 text-green-800 p-4 rounded-md">
          <p>{message}</p>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Original Story Information</h2>
          <p><strong>Author:</strong> {story.user_name}</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('slug', { required: 'Slug is required' })}
            />
            <p className="mt-1 text-sm text-gray-500">
              URL-friendly version of the title (auto-generated, but can be edited)
            </p>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>
          
          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('content', { required: 'Content is required' })}
            ></textarea>
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
          
          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('excerpt', { required: 'Excerpt is required' })}
            ></textarea>
            <p className="mt-1 text-sm text-gray-500">
              A short summary of the article, displayed in listings
            </p>
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
            )}
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="categoryId"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('categoryId')}
            >
              <option value="">-- Select a category --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="space-y-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    value={tag.id}
                    {...register('tags')}
                    className="mt-1 h-4 w-4 border-gray-300 rounded"
                  />
                  <label htmlFor={`tag-${tag.id}`} className="ml-2 block text-sm text-gray-700">
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Publication Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Status
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-draft"
                  value="draft"
                  {...register('status')}
                  className="h-4 w-4 border-gray-300"
                />
                <label htmlFor="status-draft" className="ml-2 block text-sm text-gray-700">
                  Draft (only visible to admins)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="status-published"
                  value="published"
                  {...register('status')}
                  className="h-4 w-4 border-gray-300"
                />
                <label htmlFor="status-published" className="ml-2 block text-sm text-gray-700">
                  Published (visible to all users)
                </label>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded font-medium ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? 'Converting...' : 'Convert to Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 