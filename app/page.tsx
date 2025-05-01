
import DestinationsCard from "./components/about/destinationsCard";
import NewsletterCard from "./components/about/newslettercard";
import WhereToNextCard from "./components/about/wheretonextcard";
import CategoryCarousel from "./components/home/categoryCarousal";
import ProfileCard from "./components/home/developerInfo";
import HeroSection from "./components/home/hero2";
import RecentArticles from "./components/home/recentArticles";
// Removed direct icon imports: FaFacebookF, FaInstagram, FaYoutube, FaTwitter
import {
  homeProfileCard,
  homeDestinationsCard,
  homeNewsletterCard,
  homeWhereToNextCard
} from "@/app/data/data"; // Import data

export default function Home() {
  
    return (
      <div className="min-h-screen bg-white text-black">
        <HeroSection />
        <CategoryCarousel />
  
        <section className="container mx-auto px-4 py-12 flex gap-8 items-start">
          <RecentArticles />
  
          <div className="w-[320px] space-y-8">
            <ProfileCard
              imageSrc={homeProfileCard.imageSrc}
              name={homeProfileCard.name}
              description={homeProfileCard.description}
              socials={homeProfileCard.socials}
            />
  
            <DestinationsCard
              title={homeDestinationsCard.title}
              items={homeDestinationsCard.items}
            />
  
            <NewsletterCard
              title={homeNewsletterCard.title}
              placeholder={homeNewsletterCard.placeholder}
            />
  
            <WhereToNextCard title={homeWhereToNextCard.title} />
          </div>
        </section>
      </div>
    )
  }
