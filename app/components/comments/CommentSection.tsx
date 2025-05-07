'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/app/components/ui/Toast';
import CommentForm from '@/app/components/comments/CommentForm';

interface Comment {
  id: string;
  content: string;
  user_name: string;
  created_at: string;
}

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments?articleId=${articleId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [articleId, toast]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-10 border-t pt-10 border-gray-200">
      <h3 className="text-2xl font-bold mb-8 text-black">Discussion</h3>

      {isLoading ? (
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-100 h-24 rounded-md"></div>
          <div className="animate-pulse bg-gray-100 h-24 rounded-md"></div>
        </div>
      ) : (
        <>
          {comments.length === 0 ? (
            <p className="text-gray-700 mb-8 italic">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            <div className="space-y-6 mb-10">
              {comments.map((comment) => (
                <div key={comment.id} className="border border-gray-100 rounded-lg p-6 shadow-sm bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-black">{comment.user_name}</h4>
                    <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          <CommentForm articleId={articleId} onCommentPosted={fetchComments} />
        </>
      )}
    </div>
  );
} 