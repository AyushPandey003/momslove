'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function UnsubscribeHandler() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const id = searchParams.get('id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your request...');

  useEffect(() => {
    async function unsubscribe() {
      if (!email || !id) {
        setStatus('error');
        setMessage('Invalid unsubscribe link. Please check the URL and try again.');
        return;
      }

      try {
        const response = await fetch('/api/newsletter', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, id }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('You have been successfully unsubscribed from our newsletter.');
        } else {
          setStatus('error');
          setMessage(data.error || 'An error occurred while unsubscribing. Please try again later.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while unsubscribing. Please try again later.');
        console.error('Unsubscribe error:', error);
      }
    }

    unsubscribe();
  }, [email, id]);

  return (
    <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Newsletter Unsubscribe</h1>

      {status === 'loading' && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600 text-center">{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-gray-700 mb-6">{message}</p>
          <p className="text-gray-500 mb-6">
            We&apos;re sorry to see you go. If you change your mind, you can always subscribe again from our website.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-gray-700 mb-6">{message}</p>
          <Link
            href="/"
            className="inline-block px-5 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<p>Loading unsubscribe info...</p>}>
        <UnsubscribeHandler />
      </Suspense>
    </div>
  );
}
