import React from "react";

interface NewsletterCardProps {
  title: string;
  placeholder: string;
}

const NewsletterCard: React.FC<NewsletterCardProps> = ({ title, placeholder }) => (
    <div className="max-w-md mt-10 md:mt-0">
    <div className="border border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-4">
        Subscribe to receive exclusive content updates, travel & photo tips!
      </p>
      <input
        type="email"
        placeholder={placeholder}
        className="w-full px-3 py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none placeholder-gray-400 text-sm"
      />
      <button className="w-full bg-white text-black text-sm py-2 hover:bg-gray-200 transition">
        Subscribe
      </button>
    </div>
  </div>
);

export default NewsletterCard;
