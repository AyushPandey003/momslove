// pages/about.tsx

import React from "react";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaFingerprint,
} from "react-icons/fa";
import { getUserProfile } from "@/app/lib/profiles";
import { auth } from "@/auth";

// Define a type for the profile data
type ProfileData = {
  bio: string;
  name: string;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  gallery_images: string[] | null;
};

const About = async () => {
  // Get the authenticated user
  const session = await auth();
  
  // Define a fallback profile for when data isn't available
  const fallbackProfile: ProfileData = {
    bio: "For as long as I can remember I've been obsessed with the idea of travel. I was always that person who was forever daydreaming of foreign lands and unfamiliar cultures; coming up with travel itineraries that would challenge my perceptions and help me gain a deeper understanding of the world.",
    name: "Jaspreet Bhamrai",
    facebook: null,
    instagram: null,
    twitter: null,
    gallery_images: null
  };
  
  // Try to get the profile from the database if user is authenticated
  let profile = fallbackProfile;
  
  if (session?.user?.id) {
    const userId = parseInt(session.user.id);
    const userProfile = await getUserProfile(userId);
    
    if (userProfile) {
      profile = {
        ...fallbackProfile,
        bio: userProfile.bio || fallbackProfile.bio,
        name: session.user.name || fallbackProfile.name,
        facebook: userProfile.facebook,
        instagram: userProfile.instagram,
        twitter: userProfile.twitter,
        gallery_images: userProfile.gallery_images
      };
    }
  }

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
          {profile.name}
        </h2>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-6 mb-6">
          {/* Show social icons conditionally if they exist in profile */}
          {profile.facebook && (
            <a
              href={`https://facebook.com/${profile.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white p-3 rounded-lg hover:opacity-80 transition"
            >
              <FaFacebookF />
            </a>
          )}
          {profile.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white p-3 rounded-lg hover:opacity-80 transition"
            >
              <FaInstagram />
            </a>
          )}
          {profile.twitter && (
            <a
              href={`https://twitter.com/${profile.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white p-3 rounded-lg hover:opacity-80 transition"
            >
              <FaYoutube />
            </a>
          )}
          <a
            href="#"
            className="bg-black text-white p-3 rounded-lg hover:opacity-80 transition"
          >
            <FaFingerprint />
          </a>
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Quote */}
        <p className="italic text-gray-700 text-lg">
          Some beautiful paths can&apos;t be discovered without getting lost.
        </p>

        <hr className="border-gray-300 my-6" />

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {profile.bio}
        </p>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          {profile.gallery_images && profile.gallery_images.length > 0 ? (
            // If we have gallery images, display them
            profile.gallery_images.slice(0, 2).map((imageUrl, index) => (
              <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden">
                <Image 
                  src={imageUrl} 
                  alt={`Gallery image ${index + 1}`} 
                  width={600} 
                  height={450} 
                  className="object-cover w-full h-full"
                />
              </div>
            ))
          ) : (
            // Fall back to placeholder content if no images
            <>
              <div className="bg-gray-200 aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center">
                <span className="text-gray-500">Image 1</span>
              </div>
              <div className="bg-gray-200 aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center">
                <span className="text-gray-500">Image 2</span>
              </div>
            </>
          )}
        </div>
        
        {/* Show more images if available */}
        {profile.gallery_images && profile.gallery_images.length > 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {profile.gallery_images.slice(2).map((imageUrl, index) => (
              <div key={index + 2} className="aspect-[4/3] rounded-lg overflow-hidden">
                <Image 
                  src={imageUrl} 
                  alt={`Gallery image ${index + 3}`} 
                  width={400} 
                  height={300} 
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
