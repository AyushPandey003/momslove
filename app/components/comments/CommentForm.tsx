'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Textarea } from '@/app/components/ui/Textarea';
import { useToast } from '@/app/components/ui/Toast';
import { useSession } from 'next-auth/react';

interface CommentFormProps {
  articleId: string;
  onCommentPosted: () => void;
}

export default function CommentForm({ articleId, onCommentPosted }: CommentFormProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to post a comment',
        type: 'error',
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: articleId,
          content: newComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }

      // Clear the comment input
      setNewComment('');
      
      // Notify parent component to refresh comments
      onCommentPosted();

      toast({
        title: 'Success',
        description: 'Comment posted successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to post comment',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold mb-4 text-black">Leave a comment</h4>
      {session?.user ? (
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-lg focus:ring-black focus:border-black text-black"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black hover:bg-gray-800 text-white transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <div className="border border-gray-200 rounded-lg p-6 bg-white text-center">
          <p className="mb-4 text-gray-700">Please login to join the discussion</p>
          <Button 
            href="/api/auth/signin"
            className="bg-black hover:bg-gray-800 text-white transition-colors"
          >
            Sign in
          </Button>
        </div>
      )}
    </div>
  );
} 