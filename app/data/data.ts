// Data for the Instagram banner gallery
export const instagramImages = [
  "/images/hero.avif",
  "/images/hero.avif",
  "/images/hero.avif",
  "/images/hero.avif",
  "/images/hero.avif",
  "/images/hero.avif",
];

import { NavLink } from "@/app/types";

// Data for the main navigation links
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Submit Story", href: "/submit-story" },
  { label: "Approved Stories", href: "/approved-stories" },
  { label: "Categories", href: "/category2" },
  { label: "About", href: "/about2" },
  { label: "Contact", href: "/contacts" },
  { label: "Dashboard", href: "/dashboard" },
];

// Data for the footer navigation links
export const footerLinks: NavLink[] = [
  // Main Navigation
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Submit Story", href: "/submit-story" },
  { label: "About", href: "/about2" },
  { label: "Contact", href: "/contacts" },
  
  // User Account
  { label: "Dashboard", href: "/dashboard" },
  { label: "Preferences", href: "/preferences" },
  
  // Content Sections
  { label: "Approved Stories", href: "/approved-stories" },
  { label: "Categories", href: "/category2" },
];

import {
  ProfileCardData,
  DestinationsCardData,
  NewsletterCardData,
  WhereToNextCardData,
  SocialLink,
  TOCItem,
  ContentBlock, 
  RelatedArticle,
  SampleArticleData, 
  PageFooterLink, 
} from "@/app/types"; 
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from 'react-icons/fa';


const sampleToc: TOCItem[] = [
  { id: "intro", label: "Introduction" },
  { id: "why-thoughtful", label: "Why Thoughtful Gifts Matter" },
  { id: "experience-gifts", label: "Experience Gifts" },
  { id: "personalized", label: "Personalized Treasures" },
  { id: "pampering", label: "Pampering & Relaxation" },
  { id: "homemade", label: "Homemade with Love" },
];

const sampleInitialContent: ContentBlock[] = [
  {
    id: "intro",
    type: "text",
    content:
      "Mother's Day is the perfect occasion to show appreciation for the amazing women in our lives. While flowers and chocolates are classics, putting extra thought into a gift can make it truly special.",
  },
  {
    id: "why-thoughtful",
    type: "text",
    content:
      "A thoughtful gift shows you truly know and appreciate her unique personality, interests, and needs. It's less about the price tag and more about the sentiment and effort behind it.",
  },
  {
    id: "experience-gifts",
    type: "image",
    url: "/images/mothers-day-spa.jpg", 
    alt: "Mother enjoying a relaxing spa day experience",
  },
  {
    id: "personalized",
    type: "image",
    url: "/images/mothers-day-personalized-necklace.jpg",
    alt: "Personalized necklace gift for Mother's Day",
  },
];

const sampleRelatedArticles: RelatedArticle[] = [
  {
    id: '1',
    title: '5 Easy Mother\'s Day Brunch Recipes',
    description: 'Whip up a delicious brunch for Mom.',
    imageUrl: '/images/mothers-day-brunch.jpg', 
  },
  {
    id: '2',
    title: 'DIY Spa Day at Home for Mom',
    description: 'Create a relaxing spa experience without leaving home.',
    imageUrl: '/images/hero-mother', 
  },
  {
    id: '3',
    title: 'Heartfelt Messages for Your Mother\'s Day Card',
    description: 'Find the perfect words to express your love.',
    imageUrl: '/images/mothers-day-card.jpg',
  },
];

export const sampleArticle: SampleArticleData = {
  title: "Beyond Flowers: Thoughtful Mother's Day Gift Ideas She'll Cherish",
  date: "05.05.2025", 
  readingTime: "7 minutes reading", 
  quote: "The best gifts come from the heart, reflecting the unique bond you share with your mother and the appreciation you hold for everything she does.",
  toc: sampleToc,
  initialContent: sampleInitialContent,
  relatedArticles: sampleRelatedArticles,
  tags: ["Mother's Day", "Gifts", "Family", "Appreciation"], 
  excerpt: "Find unique and meaningful gift ideas for Mother's Day that go beyond the usual.", // Updated excerpt
  coverImage: "/images/hero-mother.avif", 
  content: "This is the full content of the sample Mother's Day gift guide article." // Placeholder content
};

export const blogPageFooterLinks: PageFooterLink[] = [
  { label: "About", href: "/about2" },
  { label: "Contact", href: "/contacts" },
  { label: "Privacy", href: "/privacy" },
];


const homeSocials: SocialLink[] = [
  { href: 'https://facebook.com/', label: 'Facebook', icon: FaFacebookF },
  { href: 'https://instagram.com/', label: 'Instagram', icon: FaInstagram },
  { href: 'https://youtube.com/', label: 'YouTube', icon: FaYoutube },
  { href: 'https://twitter.com/', label: 'Twitter', icon: FaTwitter },
];

export const homeProfileCard: ProfileCardData = {
  imageSrc: "/images/hero-mother.avif", 
  name: "Jaspreet Bhamrai", 
  description: "Passionate about celebrating family, finding joy in the everyday, and sharing ideas to make special occasions like Mother's Day truly memorable. Join me in exploring ways to show appreciation and create lasting memories.", // Updated description
  socials: homeSocials,
};


export const homeDestinationsCard: DestinationsCardData = {
  title: "Popular Topics",
  items: [ 'Gift Ideas', 'Brunch Recipes', 'DIY Crafts', 'Heartfelt Messages' ], // Updated items
};

export const homeNewsletterCard: NewsletterCardData = {
  title: "Mother's Day Inspiration", 
  placeholder: "your.email@example.com",
};

export const homeWhereToNextCard: WhereToNextCardData = {
  title: "Explore More Ideas", 
};
export const recentArticles = [
  {
    id: "1",
    title: "Last-Minute Mother's Day Gifts That Don't Feel Rushed",
    slug: "last-minute-mothers-day-gifts",
    author: { name: "Emily Carter" },
    date: "2025-05-08",
    category: "Gifts",
    excerpt: "Running out of time? Find thoughtful last-minute gift ideas for Mom.",
    coverImage: "/images/hero-mother.avif",
    content: "Last-Minute Mother's Day Gifts Content",
    tags: ["Mother's Day", "Gifts", "Last Minute"]
  },
  {
    id: "2",
    title: "Easy Mother's Day Crafts for Kids",
    slug: "mothers-day-crafts-kids",
    author: { name: "Sarah Green" },
    date: "2025-05-07",
    category: "DIY",
    excerpt: "Fun and simple craft ideas kids can make for Mom this Mother's Day.",
    coverImage: "/images/hero-mother.avif",
    content: "Easy Mother's Day Crafts Content",
    tags: ["Mother's Day", "DIY", "Kids", "Crafts"]
  },
  {
    id: "3",
    title: "Planning the Perfect Mother's Day Brunch",
    slug: "perfect-mothers-day-brunch",
    author: { name: "Michael Lee" },
    date: "2025-05-06",
    category: "Food",
    excerpt: "Tips and recipes for hosting a delightful Mother's Day brunch at home.",
    coverImage: "/images/hero-mother.avif",
    content: "Mother's Day Brunch Content",
    tags: ["Mother's Day", "Brunch", "Recipes", "Hosting"]
  },
  {
    id: "4",
    title: "Beyond Gifts: Meaningful Ways to Celebrate Mom",
    slug: "meaningful-mothers-day-celebrations",
    author: { name: "Jessica Bloom" },
    date: "2025-05-05",
    category: "Activities",
    excerpt: "Show your appreciation with experiences and quality time this Mother's Day.",
    coverImage: "/images/hero-mother.avif",
    content: "Meaningful Celebrations Content",
    tags: ["Mother's Day", "Activities", "Family", "Experiences"]
  },
  {
    id: "5",
    title: "Self-Care Gift Ideas for the Busy Mom",
    slug: "self-care-gifts-mom",
    author: { name: "David Chen" },
    date: "2025-05-04",
    category: "Gifts",
    excerpt: "Help Mom relax and recharge with these thoughtful self-care gift ideas.",
    coverImage: "/images/hero-mother.avif",
    content: "Self-Care Gifts Content",
    tags: ["Mother's Day", "Gifts", "Self-Care", "Wellness"]
  },
  {
    id: "6",
    title: "A Short History of Mother's Day",
    slug: "history-of-mothers-day",
    author: { name: "Olivia Martinez" },
    date: "2025-05-03",
    category: "History",
    excerpt: "Learn about the origins and evolution of the Mother's Day holiday.",
    coverImage: "/images/hero-mother.avif",
    content: "History of Mother's Day Content",
    tags: ["Mother's Day", "History", "Tradition"]
  },
  {
    id: "7",
    title: "How to Write a Heartfelt Mother's Day Card",
    slug: "heartfelt-mothers-day-card",
    author: { name: "Rachel Adams" },
    date: "2025-05-02",
    category: "Writing",
    excerpt: "Struggling to find the right words? Here's how to craft a message Mom will cherish.",
    coverImage: "/images/hero-mother.avif",
    content: "Mother's Day Card Writing Tips Content",
    tags: ["Mother's Day", "Cards", "Emotional", "Writing"]
  },
  {
    id: "8",
    title: "Mother's Day Photo Ideas to Capture the Moment",
    slug: "mothers-day-photo-ideas",
    author: { name: "Nathan Rivera" },
    date: "2025-05-01",
    category: "Photography",
    excerpt: "Create lasting memories with these simple, beautiful photo ideas.",
    coverImage: "/images/hero-mother.avif",
    content: "Photo Ideas for Mother's Day Content",
    tags: ["Mother's Day", "Photos", "Memories", "Family"]
  },
  {
    id: "9",
    title: "Budget-Friendly Ways to Celebrate Mother's Day",
    slug: "budget-friendly-mothers-day",
    author: { name: "Laura Kim" },
    date: "2025-04-30",
    category: "Budget",
    excerpt: "Show love without spending a fortune—celebration ideas that are meaningful and affordable.",
    coverImage: "/images/hero-mother.avif",
    content: "Budget-Friendly Celebrations Content",
    tags: ["Mother's Day", "Budget", "Affordable", "Love"]
  },
  {
    id: "10",
    title: "Virtual Mother's Day Ideas for Long-Distance Families",
    slug: "virtual-mothers-day-ideas",
    author: { name: "Daniel White" },
    date: "2025-04-29",
    category: "Technology",
    excerpt: "Separated by distance? These virtual celebration tips keep you close.",
    coverImage: "/images/hero-mother.avif",
    content: "Virtual Celebration Ideas Content",
    tags: ["Mother's Day", "Virtual", "Distance", "Technology"]
  }
]
