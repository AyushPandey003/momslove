"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  "Technology",
  "Lifestyle",
  "Business",
  "Science",
  "Health",
  "Travel",
  "Education",
  "Finance",
  "Sports",
  "Entertainment",
  "Food",
  "Fashion",
];

const VISIBLE_COUNT = 6; // number of cards visible at once

export default function CategoryCarousel() {
  const [startIndex, setStartIndex] = useState(0);

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? categories.length - VISIBLE_COUNT : prev - 1
    );
  };

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + VISIBLE_COUNT >= categories.length ? 0 : prev + 1
    );
  };

  const visibleCategories = categories.slice(
    startIndex,
    startIndex + VISIBLE_COUNT
  );

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Explore by Category</h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Previous Category"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Next Category"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative flex items-center gap-6 overflow-hidden h-64">
        {visibleCategories.map((category, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-48 h-48 bg-gray-100 flex items-center justify-center text-center transition-transform duration-300 transform origin-center hover:scale-110 cursor-pointer shadow-md rounded-xl"
          >
            <p className="text-lg font-semibold">{category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
