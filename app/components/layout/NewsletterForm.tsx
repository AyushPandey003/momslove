'use client';

import React, { useState } from 'react';

interface NewsletterFormProps {
  source?: string;
  className?: string;
  buttonText?: string;
  placeholderText?: string;
  showNameField?: boolean;
}

export default function NewsletterForm({
  source = 'site-component',
  className = '',
  buttonText = 'Subscribe',
  placeholderText = 'Your email address',
  showNameField = false,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    
    setStatus('loading');
    setMessage('Subscribing...');
    
    try {
      const response = await fetch('/api/newsletter/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing!');
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
      console.error('Newsletter subscription error:', error);
    }
  };

  return (
    <div className={className}>
      {status === 'success' ? (
        <div className="text-green-500 bg-green-50 p-4 rounded-md">
          <p>{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {showNameField && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          )}
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholderText}
            required
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full px-4 py-2 font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors ${
              status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </button>
          
          {status === 'error' && (
            <p className="text-red-500 text-sm">{message}</p>
          )}
        </form>
      )}
    </div>
  );
} 