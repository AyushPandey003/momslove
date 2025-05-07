
import Image from 'next/image';
import {RelatedArticle } from '../types';
import InterestingArticles from '../components/articles/intrestingArticles';
import About from '../components/about/aboutmepage';
import Navbar from '../components/layout/navbar2';

// Sample data (replace with API call in production

const relatedArticles: RelatedArticle[] = [
  { id: '1', title: 'AI Basics', description: 'Learn the fundamentals of AI.', imageUrl: '/images/hero-mother.avif' },
  { id: '2', title: 'Machine Learning', description: 'Dive into ML concepts.', imageUrl: '/images/hero-mother.avif' },
  { id: '3', title: 'Deep Learning', description: 'Explore neural networks.', imageUrl: '/images/hero-mother.avif' },
];

export default function SingleArticlePage() {
    return (
       <div className="min-h-screen bg-white text-black">
            {/* Hero Section */}
            <section className="relative h-screen">
              <Image
                src="/images/hero-mother.avif"
                alt="Article Hero"
                fill
                className="object-cover brightness-75"
              />
             <Navbar/>
            </section>
      
            {/* Article Content Overlapping Hero */}
        <div className="max-w-5xl mx-auto px-4 -mt-60 relative z-20">
          <About/>
        </div>
      
            {/* Related Articles */}
            <InterestingArticles articles={relatedArticles} />

          </div>
      );
    }