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

export interface Story {
  id: string;
  title: string;
  content: string;
  userId: string; // Link to the user who submitted
  user_name: string; // Store user name for display
  user_email?: string; // Optional: store email if needed
  status: 'pending' | 'approved' | 'rejected'; // Moderation status
  submitted_at: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string; // Optional reason for rejection
}
