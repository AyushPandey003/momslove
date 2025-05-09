import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  readTime: string;
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
      tips?: string[];
    }[];
    conclusion: string;
  };
}

const guides: Record<string, Guide> = {
  '1': {
    id: '1',
    title: 'Essential Baby Care Tips',
    description: 'Learn the fundamental practices for keeping your baby healthy and happy.',
    category: 'Baby Care',
    imageUrl: '/images/baby_care.avif',
    readTime: '5 min read',
    content: {
      introduction: 'Taking care of a newborn can be both exciting and overwhelming. This comprehensive guide will help you navigate through the essential aspects of baby care with confidence.',
      sections: [
        {
          title: 'Feeding Your Baby',
          content: 'Proper nutrition is crucial for your baby\'s growth and development. Whether you choose breastfeeding or formula feeding, ensure your baby is getting enough nutrients.',
          tips: [
            'Feed your baby every 2-3 hours',
            'Look for hunger cues like rooting or sucking on hands',
            'Ensure proper burping after feeding',
            'Keep track of feeding times and amounts'
          ]
        },
        {
          title: 'Sleep Safety',
          content: 'Creating a safe sleep environment is essential for your baby\'s well-being. Follow these guidelines to ensure your baby sleeps safely.',
          tips: [
            'Always place baby on their back to sleep',
            'Use a firm, flat sleep surface',
            'Keep the crib free of soft objects and loose bedding',
            'Share your room, not your bed'
          ]
        },
        {
          title: 'Bathing and Hygiene',
          content: 'Maintaining proper hygiene is important for your baby\'s health. Learn the correct way to bathe and care for your baby\'s delicate skin.',
          tips: [
            'Bathe your baby 2-3 times per week',
            'Use mild, baby-safe products',
            'Keep the umbilical cord clean and dry',
            'Trim nails regularly to prevent scratching'
          ]
        }
      ],
      conclusion: 'Remember that every baby is unique, and what works for one may not work for another. Trust your instincts and don\'t hesitate to consult your pediatrician if you have concerns.'
    }
  },
  '2': {
    id: '2',
    title: 'Healthy Pregnancy Diet',
    description: 'Nutrition guide for expecting mothers to ensure a healthy pregnancy.',
    category: 'Pregnancy',
    imageUrl: '/images/womens_diet.avif',
    readTime: '7 min read',
    content: {
      introduction: 'A well-balanced diet during pregnancy is crucial for both mother and baby\'s health. This guide will help you make informed choices about your nutrition during this special time.',
      sections: [
        {
          title: 'Essential Nutrients',
          content: 'During pregnancy, your body needs additional nutrients to support your baby\'s growth and development.',
          tips: [
            'Folic acid: 400-800 mcg daily',
            'Iron: 27 mg daily',
            'Calcium: 1,000 mg daily',
            'Protein: 75-100 grams daily'
          ]
        },
        {
          title: 'Foods to Include',
          content: 'Focus on nutrient-dense foods that provide essential vitamins and minerals.',
          tips: [
            'Leafy green vegetables',
            'Lean proteins',
            'Whole grains',
            'Low-fat dairy products',
            'Fresh fruits'
          ]
        },
        {
          title: 'Foods to Avoid',
          content: 'Some foods can be harmful during pregnancy and should be avoided.',
          tips: [
            'Raw or undercooked meat',
            'Unpasteurized dairy products',
            'Certain types of fish high in mercury',
            'Raw eggs',
            'Unwashed fruits and vegetables'
          ]
        }
      ],
      conclusion: 'Remember to stay hydrated and listen to your body\'s needs. Consult with your healthcare provider about any specific dietary requirements or concerns.'
    }
  },
  '3': {
    id: '3',
    title: 'Postpartum Recovery',
    description: 'Essential tips and advice for a smooth postpartum recovery journey.',
    category: 'Postpartum',
    imageUrl: '/images/postpartum.avif',
    readTime: '6 min read',
    content: {
      introduction: 'The postpartum period is a time of significant physical and emotional changes. This guide will help you navigate through your recovery with confidence and care.',
      sections: [
        {
          title: 'Physical Recovery',
          content: 'Your body needs time to heal after childbirth. Be patient and gentle with yourself during this process.',
          tips: [
            'Get plenty of rest',
            'Stay hydrated',
            'Take pain medication as prescribed',
            'Practice gentle exercises when cleared by your doctor'
          ]
        },
        {
          title: 'Emotional Well-being',
          content: 'It\'s normal to experience a range of emotions after giving birth. Take care of your mental health.',
          tips: [
            'Accept help from family and friends',
            'Join a new mothers\' support group',
            'Practice self-care',
            'Be aware of signs of postpartum depression'
          ]
        },
        {
          title: 'Breastfeeding Support',
          content: 'If you choose to breastfeed, proper support and information can make the experience more comfortable.',
          tips: [
            'Learn proper latching techniques',
            'Stay hydrated and well-nourished',
            'Use nursing pillows for comfort',
            'Seek help from lactation consultants if needed'
          ]
        }
      ],
      conclusion: 'Remember that recovery takes time, and every woman\'s journey is different. Don\'t hesitate to reach out for help when needed.'
    }
  },
  '4': {
    id: '4',
    title: 'Breastfeeding Guide',
    description: 'Comprehensive guide to successful breastfeeding for new mothers.',
    category: 'Breastfeeding',
    imageUrl: '/images/breastfeeding.avif',
    readTime: '8 min read',
    content: {
      introduction: 'Breastfeeding is a natural process, but it can take time and practice to master. This guide will help you establish a successful breastfeeding relationship with your baby.',
      sections: [
        {
          title: 'Getting Started',
          content: 'The first few days and weeks are crucial for establishing breastfeeding.',
          tips: [
            'Start breastfeeding within the first hour after birth',
            'Learn proper positioning and latch',
            'Feed on demand',
            'Watch for hunger cues'
          ]
        },
        {
          title: 'Common Challenges',
          content: 'Many mothers face challenges while breastfeeding. Here\'s how to handle common issues.',
          tips: [
            'Sore nipples: Check latch and use lanolin cream',
            'Engorgement: Nurse frequently and use warm compresses',
            'Low supply: Stay hydrated and nurse often',
            'Mastitis: Rest and continue nursing'
          ]
        },
        {
          title: 'Maintaining Supply',
          content: 'Keeping up your milk supply requires proper nutrition and care.',
          tips: [
            'Stay well-hydrated',
            'Eat a balanced diet',
            'Get enough rest',
            'Pump when away from baby'
          ]
        }
      ],
      conclusion: 'Remember that breastfeeding is a learning process for both you and your baby. Don\'t hesitate to seek support from lactation consultants or breastfeeding support groups.'
    }
  }
};
interface GuidesParams {
  id: string;
}

export default function GuidePage({ params }: { params: Promise<GuidesParams> }) {
  const { id } = use(params);
  const guide = guides[id]; 

  if (!guide) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Link
          href="/guides"
          className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-4"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Guides
        </Link>
        <h1 className="text-4xl font-bold text-pink-900 mb-4">{guide.title}</h1>
        <div className="flex items-center justify-center gap-4 text-gray-600">
          <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">
            {guide.category}
          </span>
          <span>{guide.readTime}</span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-[400px] w-full mb-12 rounded-xl overflow-hidden">
        <Image
          src={guide.imageUrl}
          alt={guide.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">{guide.content.introduction}</p>

        {guide.content.sections.map((section, index) => (
          <div key={index} className="mb-12 ">
            <h2 className="text-2xl font-bold text-pink-300 mb-4">{section.title}</h2>
            <p className="text-gray-600 mb-4">{section.content}</p>
            {section.tips && (
              <div className="bg-pink-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-pink-300 mb-3">Key Tips:</h3>
                <ul className="list-disc list-inside space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-gray-600">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-pink-300 mb-4">Conclusion</h2>
          <p className="text-gray-600">{guide.content.conclusion}</p>
        </div>
      </div>

      {/* Share Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-pink-300 mb-4">Share this guide</h3>
        <div className="flex gap-4">
          <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
            </svg>
          </button>
          <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
            </svg>
          </button>
          <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5-.5z"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
} 