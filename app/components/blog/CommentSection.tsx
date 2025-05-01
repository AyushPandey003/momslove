'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '@/auth';
import { useSession } from 'next-auth/react';
import { submitComment, editComment, removeComment } from '@/app/lib/actions';

type Comment = {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at: string;
};

interface CommentSectionProps {
  articleId: string;
  slug: string;
}

export default function CommentSection({ articleId, slug }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      content: '',
    },
  });

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?articleId=${articleId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const onSubmitComment = async (data: { content: string }) => {
    if (!session) {
      setError('You must be logged in to post a comment.');
      return;
    }

    setSubmitStatus(null);
    
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      formData.append('articleId', articleId);
      formData.append('slug', slug);
      
      if (editingCommentId) {
        // Edit existing comment
        formData.append('commentId', editingCommentId);
        const result = await editComment(formData);
        setSubmitStatus(result);
        
        if (result.success) {
          setEditingCommentId(null);
          reset();
          fetchComments();
        }
      } else {
        // Post new comment
        const result = await submitComment(formData);
        setSubmitStatus(result);
        
        if (result.success) {
          reset();
          fetchComments();
        }
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'An error occurred. Please try again.',
      });
    }
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setValue('content', comment.content);
    setSubmitStatus(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    reset();
  };

  const handleDeleteClick = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('commentId', commentId);
      formData.append('slug', slug);
      
      const result = await removeComment(formData);
      
      if (result.success) {
        fetchComments();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to delete comment. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      {/* Comment form */}
      {session ? (
        <form onSubmit={handleSubmit(onSubmitComment)} className="mb-8">
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              {editingCommentId ? 'Edit your comment' : 'Leave a comment'}
            </label>
            <textarea
              id="content"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="What are your thoughts?"
              {...register('content', { required: true })}
            ></textarea>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              {editingCommentId ? 'Update Comment' : 'Post Comment'}
            </button>
            
            {editingCommentId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            )}
          </div>
          
          {submitStatus && (
            <div className={`mt-3 p-3 rounded ${
              submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {submitStatus.message}
            </div>
          )}
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-100 rounded-md">
          <p>
            Please <a href="/api/auth/signin" className="text-blue-600 hover:underline">sign in</a> to leave a comment.
          </p>
        </div>
      )}
      
      {/* Comments list */}
      {loading ? (
        <p className="text-gray-500">Loading comments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{comment.user_name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {comment.updated_at !== comment.created_at && ' (edited)'}
                  </p>
                </div>
                
                {session?.user?.id === comment.user_id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(comment)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(comment.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 