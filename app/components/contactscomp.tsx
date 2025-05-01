// components/ContactSection.tsx
import React from "react";
import Navbar from "./layout/navbar2";

const ContactSection: React.FC = () => {
  return (
    <section className="bg-white text-black py-16">
        <Navbar/>
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-4xl font-serif font-bold mb-8">Contact</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* — Left Column: Image + Text */}
          <div>
            <div className="bg-gray-200 w-full aspect-[16/9] flex items-center justify-center">
              <span className="text-gray-500">Image Placeholder</span>
            </div>
            <p className="mt-4 text-sm text-gray-700">
              Donec accumsan purus nec ligula volutpat posuere. Integer lectus
              lorem, mollis eget varius condimentum, vehicula eu arcu. Duis
              viverra orci vel pretium eleifend. Phasellus sit amet
              pellentesque risus. Nulla ut ex sit amet nisl malesuada semper.
            </p>
          </div>

          {/* — Right Column: Contact Form */}
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-transparent border-b border-gray-300 focus:border-black focus:outline-none py-2 rounded-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-transparent border-b border-gray-300 focus:border-black focus:outline-none py-2 rounded-none"
              />
            </div>

            <input
              type="text"
              placeholder="Subject"
              className="w-full bg-transparent border-b border-gray-300 focus:border-black focus:outline-none py-2 rounded-none"
            />

            <textarea
              placeholder="Your message"
              rows={5}
              className="w-full bg-transparent border-b border-gray-300 focus:border-black focus:outline-none py-2 resize-none rounded-none"
            />

            <button
              type="submit"
              className="bg-black text-white px-6 py-3 hover:bg-gray-900 transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
