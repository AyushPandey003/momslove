"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../layout/navbar2";

const posts = [
  {
    id: 1,
    title: "The Future of AI",
    author: "John Doe",
    image: "/images/hero-mother.avif",
    category: "Technology",
    excerpt: "Discover how AI is shaping the future of technology.",
  },
  {
    id: 2,
    title: "Web3 Revolution",
    author: "Jane Smith",
    image: "/images/hero.avif",
    category: "Blockchain",
    excerpt: "Explore the transformative potential of Web3 and blockchain.",
  },
];

export default function HeroSection() {
  const [currentPost, setCurrentPost] = useState(0);

  const handlePrev = () => {
    setCurrentPost((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPost((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative h-[70vh]">
      {/* Hero Image as Background */}
      <Image
        src={posts[currentPost].image}
        alt="Hero"
        layout="fill"
        objectFit="cover"
        className="brightness-75"
      />

      {/* Top Navigation Bar */}
      <Navbar/>

      {/* Overlay Card with Post Content */}
      <div className="absolute bottom-8 left-8 w-[30%] bg-white px-8 py-10 shadow-lg space-y-4">
        {/* Prev & Next Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handlePrev}
            className="bg-black text-white p-2 hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="bg-black text-white p-2 hover:bg-gray-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-500 uppercase tracking-wider">
          {posts[currentPost].category || "Travels"}
        </p>
        <h2 className="text-3xl font-semibold leading-snug text-black">
          {posts[currentPost].title}
        </h2>
        <p className="text-sm text-gray-500">{posts[currentPost].excerpt}</p>
        <Link href={`/post/${posts[currentPost].id}`}>
          <button className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800">
            Read more
          </button>
        </Link>
      </div>
    </section>
  );
}
