'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';

export default function CallToAction() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would normally send the data to an API
    console.log({ name, email, message });
    
    // For now, just show success
    setSubmitted(true);
    
    // Reset form
    setName('');
    setEmail('');
    setMessage('');
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };
  
  return (
    <section className="py-16 bg-pink-50 dark:bg-pink-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Share Your Mother&#39;s Day Story
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Honor your mother or a maternal figure who has made a difference in your life. Submit a brief tribute and we&#39;ll feature selected stories in our Mother&#39;s Day special collection.
            </p>
            
            {submitted && (
              <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-md">
                <p className="text-green-800 dark:text-green-200">
                  Thank you for sharing your story! We&#39;ll review it soon.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-10 lg:mt-0">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Tribute (150 words max)
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <Button type="submit" className="w-full">
                    Submit Your Tribute
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 