// pages/about.tsx

import React from "react";
import { NextPage } from "next";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaFingerprint,
} from "react-icons/fa";

const About: NextPage = () => {
  return (
    // Page background
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      {/* White Card Container */}
      <div className="bg-white  shadow-xl w-full max-w-3xl p-8">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-serif font-medium">
          My name is
        </h1>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold mt-1">
          Jaspreet Bhamrai
        </h2>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-6 mb-6">
          {[FaFacebookF, FaInstagram, FaYoutube, FaFingerprint].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="bg-black text-white p-3 rounded-lg hover:opacity-80 transition"
            >
              <Icon />
            </a>
          ))}
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Quote */}
        <p className="italic text-gray-700 text-lg">
          Some beautiful paths can’t be discovered without getting lost.
        </p>

        <hr className="border-gray-300 my-6" />

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">
          For as long as I can remember I’ve been obsessed with the idea of
          travel. I was always that person who was forever daydreaming of foreign
          lands and unfamiliar cultures; coming up with travel itineraries that
          would challenge my perceptions and help me gain a deeper
          understanding of the world.
        </p>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          <div className="bg-gray-200 aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center">
            {/* Replace with: <img src="/path/to/your1.jpg" alt="…" className="object-cover w-full h-full" /> */}
            <span className="text-gray-500">Image 1</span>
          </div>
          <div className="bg-gray-200 aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center">
            {/* Replace with: <img src="/path/to/your2.jpg" alt="…" className="object-cover w-full h-full" /> */}
            <span className="text-gray-500">Image 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
