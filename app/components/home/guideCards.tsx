"use client";
import Image from "next/image";
import Link from "next/link";

const guides = [
  {
    id: '1',
    title: "Essential Baby Care Tips",
    description: "Learn the fundamental practices for keeping your baby healthy and happy",
    imageUrl: "/images/baby_care.avif",
    category: "Baby Care",
    readTime: "5 min read"
  },
  {
    id: '2',
    title: "Healthy Pregnancy Diet",
    description: "Nutrition guide for expecting mothers to ensure a healthy pregnancy",
    imageUrl: "/images/womens_diet.avif",
    category: "Pregnancy",
    readTime: "7 min read"
  },
  {
    id: '3',
    title: "Postpartum Recovery",
    description: "Essential tips and advice for a smooth postpartum recovery journey",
    imageUrl: "/images/postpartum.avif",
    category: "Postpartum",
    readTime: "6 min read"
  },
  {
    id: '4',
    title: "Breastfeeding Guide",
    description: "Comprehensive guide to successful breastfeeding for new mothers",
    imageUrl: "/images/breastfeeding.avif",
    category: "Breastfeeding",
    readTime: "8 min read"
  }
];

export default function GuideCards() {
  return (
    <section className="bg-black py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">
          Essential Guides for Mothers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            >
              <div className="relative">
                <Image
                  width={400}
                  height={300}
                  src={guide.imageUrl}
                  alt={guide.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-pink-500 text-white text-xs font-medium rounded-full">
                    {guide.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
                  <h3 className="text-lg font-semibold">{guide.title}</h3>
                  <p className="text-sm text-gray-200 mt-1">{guide.description}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">{guide.readTime}</span>
                <span className="text-black text-sm font-medium hover:text-pink-600 transition">
                  Read Guide →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
  