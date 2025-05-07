import React from "react";
import NewsletterForm from "@/app/components/layout/NewsletterForm";

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
      <NewsletterForm
        source="newsletter-card"
        buttonText="Subscribe"
        placeholderText={placeholder}
        className="w-full"
      />
    </div>
  </div>
);

export default NewsletterCard;
