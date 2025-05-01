import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-bold mb-4">MomsLove</h3>
        <p className="text-sm mb-4">Your source for insightful articles and guides.</p>
        <div className="flex justify-center gap-4">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}