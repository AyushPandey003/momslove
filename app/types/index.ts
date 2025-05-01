export interface Author {
  name: string;
  image?: string;
  bio?: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: Author;
  category: string;
  featured?: boolean;
  tags?: string[];
}

export interface Story {
  id: string;
  title: string;
  content: string;
  userId: string;
  user_name: string;
  user_email?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export type ContentBlock =  | { type: "text"; content: string; id: string  }
| { type: "image"; url: string; alt?: string; id: string  };

export interface Article2 {
  title: string;
  author: string;
  date: string;
  readingTime: string;
  quote: string;
  initialContent: ContentBlock[];
  mainContent: ContentBlock[];
}

export interface RelatedArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}
export interface AboutContent {
  author: string;
  quote: string;
  socialLinks: { platform: string; url: string; icon: string }[];
  content: ContentBlock[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface RecentArticle {
  id: number;
  title: string;
  author: string;
  date: string;
  tags: string[];
  description: string;
  imageUrl: string;
}

import { IconType } from 'react-icons';

export interface SocialLink {
  href: string;
  label: string;
  icon: IconType;
}

export interface ProfileCardData {
  imageSrc: string;
  name: string;
  description: string;
  socials: SocialLink[];
}

export interface DestinationsCardData {
  title: string;
  items: string[];
}

export interface NewsletterCardData {
  title: string;
  placeholder: string;
}

export interface WhereToNextCardData {
  title: string;
}

export interface TOCItem {
  id: string;
  label: string;
}

export interface SampleArticleData {
  title: string;
  date: string;
  readingTime: string;
  quote: string;
  toc: TOCItem[];
  initialContent: ContentBlock[];
  relatedArticles: RelatedArticle[];
  tags?: string[];
  excerpt?: string;
  coverImage?: string;
  content?: string;
}

export interface PageFooterLink {
  label: string;
  href: string;
}
