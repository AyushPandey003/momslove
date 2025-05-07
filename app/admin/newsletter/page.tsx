'use client';

import React, { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function NewsletterAdminPage() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.admin === true;
  
  // Redirect if not admin
  if (status === 'unauthenticated' || (status === 'authenticated' && !isAdmin)) {
    redirect('/');
  }
  
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<null | {
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  }>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  const sendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !content || !testEmail) {
      setResult({
        success: false,
        message: 'Please fill in all fields'
      });
      return;
    }
    
    setSending(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content,
          testMode: true,
          testEmail
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: 'Test email sent successfully',
          details: data
        });
      } else {
        const message = data.error || 'Failed to send test email';
        setResult({
          success: false,
          message: message,
          details: data
        });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setResult({
        success: false,
        message: 'An error occurred while sending the test email'
      });
    } finally {
      setSending(false);
    }
  };
  
  const sendNewsletterToAll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !content) {
      setResult({
        success: false,
        message: 'Please fill in subject and content'
      });
      return;
    }
    
    // Confirm with the user before sending to all subscribers
    const confirmed = confirm('Are you sure you want to send this newsletter to ALL subscribers?');
    if (!confirmed) return;
    
    setSending(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: `Newsletter sent successfully to ${data.successCount} subscribers`,
          details: data
        });
        
        // Reset form if successful
        if (data.success !== false) {
          formRef.current?.reset();
          setSubject('');
          setContent('');
          setTestEmail('');
        }
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send newsletter',
          details: data
        });
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      setResult({
        success: false,
        message: 'An error occurred while sending the newsletter'
      });
    } finally {
      setSending(false);
    }
  };

  // Show loading while session is loading
  if (status === 'loading') {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Newsletter Admin</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Newsletter Admin</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form ref={formRef}>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter newsletter subject"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Email Content (HTML supported)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black min-h-[200px]"
              placeholder="Enter newsletter content. HTML tags are supported."
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Test Email Address
            </label>
            <input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email to test"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use this to test the newsletter before sending to all subscribers
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={sendTestEmail}
              disabled={sending || !testEmail}
              className={`px-5 py-2 rounded-md font-medium ${
                !testEmail || sending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {sending ? 'Sending...' : 'Send Test Email'}
            </button>
            
            <button
              type="button"
              onClick={sendNewsletterToAll}
              disabled={sending}
              className={`px-5 py-2 rounded-md font-medium ${
                sending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {sending ? 'Sending...' : 'Send to All Subscribers'}
            </button>
          </div>
        </form>
        
        {result && (
          <div className={`mt-6 p-4 rounded-md ${
            result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <p className="font-medium">{result.message}</p>
            {result.details && (
              <pre className="mt-2 text-xs overflow-auto max-h-40 p-2 bg-gray-100 rounded">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Help & Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use HTML tags in your content for formatting. For example: <code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;b&gt;</code>, etc.</li>
          <li>Always send a test email to verify the content and formatting before sending to all subscribers.</li>
          <li>Include links to your website articles to drive traffic back to the site.</li>
          <li>The email template already includes an unsubscribe link at the bottom, so you don&apos;t need to add one.</li>
        </ul>
      </div>
    </div>
  );
} 