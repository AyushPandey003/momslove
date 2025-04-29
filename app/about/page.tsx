import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - MomsLove',
  description: 'Learn about our mission to support and celebrate mothers through stories, resources, and community.',
};

export default function AboutPage() {
  return (
    <main className="py-12 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            About MomsLove
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our mission is to support and celebrate mothers through stories, resources, and community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
            <Image
              src="/images/about-mission.jpg"
              alt="Mothers sharing stories"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <div className="prose dark:prose-invert max-w-none">
                <p>
                MomsLove was founded with a simple but powerful belief: that motherhood deserves to be celebrated, supported, and shared.
                We understand that being a mom is both incredibly rewarding and challenging, and that the journey looks different for everyone.
                </p>
                <p>
                Our platform serves as a gathering place for mothers to connect through stories, gain insights from experts, find practical resources, 
                and feel part of a larger community. We believe that when mothers thrive, families and communities thrive too.
                </p>
                <p>
                Whether you&apos;re a new mom, seasoned parent, or supporting someone on their motherhood journey, MomsLove is a place where you can find 
                inspiration, practical advice, and a reminder that you&apos;re not alone.
                </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 lg:grid-flow-dense">
          <div className="lg:col-start-2">
            <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/about-values.jpg"
                alt="Mother and child sharing a moment"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Values</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                <strong>Authenticity:</strong> We embrace the real, unfiltered experiences of motherhood in all its forms.
              </p>
              <p>
                <strong>Inclusivity:</strong> We recognize and celebrate diverse paths to and through motherhood.
              </p>
              <p>
                <strong>Empowerment:</strong> We provide resources and support that help mothers make informed choices for themselves and their families.
              </p>
              <p>
                <strong>Community:</strong> We foster connection and understanding among mothers from all walks of life.
              </p>
              <p>
                <strong>Growth:</strong> We believe in the continuous journey of learning and developing as parents and individuals.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Join Our Community</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            MomsLove is more than just a website—it&apos;s a community of mothers supporting each other.
            We invite you to be part of this journey by sharing your stories, connecting with other moms,
            and contributing to a space where motherhood is truly celebrated.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="#"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 md:py-4 md:text-lg md:px-10"
            >
              Subscribe to Newsletter
            </a>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 md:py-4 md:text-lg md:px-10"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 