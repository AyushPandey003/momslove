'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitStory } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type FormValues = {
  title: string;
  content: string;
};

export default function SubmitStoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      title: '',
      content: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (status !== 'authenticated') {
      setSubmitStatus({
        success: false,
        message: 'You must be logged in to submit a story.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      
      const result = await submitStory(formData);
      setSubmitStatus(result);
      
      if (result.success) {
        reset();
        setTimeout(() => {
          router.push('/approved-stories');
        }, 2000);
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Submit Your Story</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Submit Your Story</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">You need to be logged in to submit a story.</p>
          <button
            onClick={() => router.push('/api/auth/signin')}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Submit Your Story</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-6 text-gray-700">
          Share your experience with our community. Your story will be reviewed by our team before being published.
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Give your story a meaningful title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Your Story
            </label>
            <textarea
              id="content"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={10}
              placeholder="Share your story with our community..."
              {...register('content', { 
                required: 'Content is required',
                minLength: { value: 50, message: 'Your story should be at least 50 characters' }
              })}
            ></textarea>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded font-medium ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Story'}
          </button>
          
          {submitStatus && (
            <div className={`mt-4 p-4 rounded ${
              submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-semibold">{submitStatus.success ? 'Success!' : 'Error!'}</p>
              <p>{submitStatus.message}</p>
            </div>
          )}
        </form>
      </div>
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Submission Guidelines:</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Be honest and respectful in your story.</li>
          <li>Do not include personal identifying information about others without permission.</li>
          <li>Your story will be reviewed by our team before being published.</li>
          <li>We may edit your story for clarity, length, or to remove sensitive information.</li>
          <li>By submitting your story, you grant us permission to publish it on our platform.</li>
        </ul>
      </div>
    </div>
  );
}
