import HeroBanner from '@/app/components/home/HeroBanner';
import CategoriesSection from '@/app/components/home/CategoriesSection';
import FeaturedArticles from '@/app/components/home/FeaturedArticles';
import CallToAction from '@/app/components/home/CallToAction';

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <CategoriesSection />
      <FeaturedArticles />
      <CallToAction />
    </main>
  );
} 