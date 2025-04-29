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
}