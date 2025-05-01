import { FaInstagram } from "react-icons/fa";
import Image from "next/image";
import { instagramImages } from "@/app/data/data"; // Import the data

export default function InstagramBanner() {
  return (
    <div className="w-full ">
      {/* Top black bar */}
      <div className="bg-black text-white flex items-center justify-between px-6 py-2">
        <p className="font-semibold">Follow me on Instagram</p>
        <FaInstagram className="text-xl" />
      </div>

      {/* Image grid */}
      <div className="bg-gray-200 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-0">
        {instagramImages.map((src, index) => ( // Use imported data
          <div key={index} className="relative aspect-square hover:opacity-80 transition">
            <Image
              src={src}
              alt={`Instagram ${index}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
