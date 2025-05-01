
import DestinationsCard from "./components/about/destinationsCard";
import NewsletterCard from "./components/about/newslettercard";
import WhereToNextCard from "./components/about/wheretonextcard";
import CategoryCarousel from "./components/home/categoryCarousal";
import ProfileCard from "./components/home/developerInfo";
import HeroSection from "./components/home/hero2";
import RecentArticles from "./components/home/recentArticles"
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from 'react-icons/fa'

export default function Home() {
  const social=[
    { href: 'https://facebook.com/', label: 'Facebook', icon: FaFacebookF },
    { href: 'https://instagram.com/', label: 'Instagram', icon: FaInstagram },
    { href: 'https://youtube.com/', label: 'YouTube', icon: FaYoutube },
    { href: 'https://twitter.com/', label: 'Twitter', icon: FaTwitter },
  ]
  
    return (
      <div className="min-h-screen bg-white text-black">
        <HeroSection />
        <CategoryCarousel />
  
        <section className="container mx-auto px-4 py-12 flex gap-8 items-start">
          <RecentArticles />
  
          <div className="w-[320px] space-y-8">
            <ProfileCard
              imageSrc="/images/hero.avif"
              name="Jaspreet Bhamrai"
              description="For as long as I can remember I've been obsessed with the idea of travel. I was always that person who was forever daydreaming of foreign lands and unfamiliar cultures; coming up with travel itineraries that would challenge my perceptions and help me gain a deeper understanding of the world."
              socials={social}
            />
  
            <DestinationsCard
              title="Destinations"
              items={[ 'Tokyo', 'Rome', 'San Francisco', 'San Jose' ]}
            />
  
            <NewsletterCard
              title="Newsletter"
              placeholder="example@email.com"
            />
  
            <WhereToNextCard title="Where to next?" />
          </div>
        </section>
      </div>
    )
  }
  