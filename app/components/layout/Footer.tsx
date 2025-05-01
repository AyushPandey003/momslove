
import Link from "next/link";
import InstagramBanner from "../home/bottomGallery";
import { footerLinks } from "@/app/data/data"; // Import footerLinks data

export default function Footer() {
  return (
    <div className="mt-10">
      {/* Instagram bar */}
      <InstagramBanner />

      {/* Footer main */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
          {/* Left section */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold text-gray-900">Personal Travel</h2>
            <p className="text-sm text-gray-500">Copyrights © 2020. All Rights Reserved.</p>
          </div>

          {/* Right links */}
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
            {footerLinks.map((link, index) => (
              <Link key={index} href={link.href} className="hover:text-black transition">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
