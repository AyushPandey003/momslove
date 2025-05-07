'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Textarea } from '@/app/components/ui/Textarea';
import { useToast } from '@/app/components/ui/Toast';

const RichTextEditor = dynamic(() => import('@/app/components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-md p-4 h-64 animate-pulse bg-gray-100"></div>
  ),
});

interface EditArticleParams {
  id: string;
}

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  category_id: string;
  status: 'draft' | 'published';
  tags: string[];
}

export default function EditArticle({ params }: { params: Promise<EditArticleParams> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [article, setArticle] = useState<Article>({
    id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    category_id: '',
    status: 'draft',
    tags: [],
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch article');

        const data = await response.json();
        const art = data.article;

        if (art) {
          setArticle({
            id: art.id,
            title: art.title,
            slug: art.slug,
            content: art.content,
            excerpt: art.excerpt,
            cover_image: art.cover_image,
            category_id: art.category_id,
            status: art.status,
            tags: art.tags?.map((tag: { id: string }) => tag.id) || [],
          });
          setTags(art.tags?.map((tag: { id: string }) => tag.id) || []);
        }
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to load article', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTags = async () => {
      try {
        const res = await fetch('/api/tags');
        const data = await res.json();
        setAvailableTags(data.tags || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticle();
    fetchCategories();
    fetchTags();
  }, [id, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setArticle((prev) => ({ ...prev, content }));
  };

  const handleSlugGeneration = () => {
    const slug = article.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    setArticle((prev) => ({ ...prev, slug }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !tags.includes(value)) {
      const newTags = [...tags, value];
      setTags(newTags);
      setArticle((prev) => ({ ...prev, tags: newTags }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setArticle((prev) => ({ ...prev, tags: updatedTags }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Update failed');

      toast({ title: 'Success', description: 'Article updated', type: 'success' });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to update article', type: 'error' });
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="font-medium">Title</label>
            <Input id="title" name="title" value={article.title} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="slug" className="font-medium">
              Slug
              <Button type="button" variant="outline" size="sm" className="ml-2" onClick={handleSlugGeneration}>
                Generate from Title
              </Button>
            </label>
            <Input id="slug" name="slug" value={article.slug} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="font-medium">Content</label>
          <RichTextEditor value={article.content} onChange={handleContentChange} />
        </div>

        <div className="space-y-2">
          <label htmlFor="excerpt" className="font-medium">Excerpt (Optional)</label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={article.excerpt}
            onChange={handleInputChange}
            placeholder="Brief summary of the article"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cover_image" className="font-medium">Cover Image URL</label>
          <Input
            id="cover_image"
            name="cover_image"
            value={article.cover_image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="category_id" className="font-medium">Category</label>
            <select
              id="category_id"
              name="category_id"
              className="w-full p-2 border rounded-md"
              value={article.category_id}
              onChange={handleInputChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="font-medium">Status</label>
            <select
              id="status"
              name="status"
              className="w-full p-2 border rounded-md"
              value={article.status}
              onChange={handleInputChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="tags" className="font-medium">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tagId) => (
              <div key={tagId} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full flex items-center">
                {availableTags.find((t) => t.id === tagId)?.name || tagId}
                <button
                  type="button"
                  onClick={() => removeTag(tagId)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <select
            id="tags"
            className="w-full p-2 border rounded-md"
            onChange={handleTagChange}
            value=""
          >
            <option value="">Select tags to add</option>
            {availableTags.map((tag) => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Article'}
          </Button>
        </div>
      </form>
    </div>
  );
}
