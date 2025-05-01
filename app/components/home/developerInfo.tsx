// components/ProfileCard.jsx
import React from 'react'

interface ProfileCardProps {
  imageSrc: string;
  name: string;
  description: string;
  socials?: { href: string; label: string; icon: React.ComponentType }[];
}

export default function ProfileCard({
  imageSrc,
  name,
  description,
  socials = [],
}: ProfileCardProps) {
  return (
    <div className="relative max-w-xs mx-auto">
      {/* Card with full border */}
      <div className="border border-gray-300  pt-16 pb-12 px-6 bg-white">
        {/* Name */}
        <h2 className="text-xl font-bold text-center mb-4">
          {name}
        </h2>
        {/* Description */}
        <p className="text-gray-600 text-center">
          {description}
        </p>
      </div>

      {/* Profile image overlapping top border */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img
          src={imageSrc}
          alt={name}
          className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
        />
      </div>

      {/* Social icons overlapping bottom border */}
      <div
        className="
          absolute 
          bottom-0 
          left-1/2 
          transform -translate-x-1/2 translate-y-1/2 
          flex space-x-4
        "
      >
        {socials.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="
              w-10 h-10 
              flex items-center justify-center 
              bg-black text-white 
              rounded 
              shadow 
              hover:opacity-80 
              transition
            "
          >
            <Icon />
          </a>
        ))}
      </div>
    </div>
  )
}
