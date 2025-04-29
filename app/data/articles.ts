import { Article } from '@/app/types';

const articles: Article[] = [
  {
    id: '1',
    title: 'The Beauty of Motherhood: Embracing Each Moment',
    slug: 'beauty-of-motherhood',
    excerpt: 'Discover the small but significant moments that make motherhood a journey worth celebrating.',
    content: `
      <p>Motherhood is filled with countless tiny moments that, when strung together, create the most beautiful tapestry of life. From the first smile of your newborn to watching your children grow into their own person, each stage brings its own unique joy and challenges.</p>
      <p>In this article, we explore how embracing each moment, even the difficult ones, can help mothers find deeper meaning and connection in their parenting journey. We speak with several mothers who share their personal experiences and the lessons they've learned along the way.</p>
      <p>"The days are long but the years are short," says Maria Johnson, mother of three. "I've learned to pause and savor even the seemingly mundane moments, because before you know it, they're grown."</p>
      <p>Experts also weigh in on the importance of mindfulness in parenting, offering practical tips for staying present even during the busiest and most challenging times.</p>
    `,
    coverImage: '/images/articles/motherhood-beauty.jpg',
    date: '2023-04-15',
    author: {
      name: 'Emily Parker',
      image: '/images/authors/profileblog.jpg',
      bio: 'Emily is a parenting coach and mother of two who writes about the joys and challenges of modern motherhood.'
    },
    category: 'personal-stories',
    featured: true
  },
  {
    id: '2',
    title: 'Essential Self-Care Practices for Busy Moms',
    slug: 'self-care-for-moms',
    excerpt: 'Learn how to prioritize your wellbeing while balancing the demands of motherhood.',
    content: `
      <p>As mothers, we often put everyone else's needs before our own. But the truth is, self-care isn't selfish—it's essential for being the best parent you can be.</p>
      <p>This comprehensive guide offers practical self-care strategies that fit into even the busiest mom's schedule. From five-minute mindfulness practices to efficient workout routines, discover how small changes can make a big difference in your overall wellbeing.</p>
      <p>"I used to think self-care meant expensive spa days or long vacations away from my kids," shares Rebecca Torres, a single mom of twins. "Now I understand it's about those small daily practices that help me stay centered and energized."</p>
      <p>We also address the guilt many mothers feel when taking time for themselves, and provide strategies for overcoming these barriers to self-care.</p>
    `,
    coverImage: '/images/articles/mom-selfcare.avif',
    date: '2023-03-28',
    author: {
      name: 'Sarah Johnson',
      image: '/images/authors/profileblog.jpg',
      bio: 'Sarah is a wellness expert specializing in maternal health and self-care.'
    },
    category: 'health-wellness',
    featured: true
  },
  {
    id: '3',
    title: 'Navigating the First Year: A Guide for New Mothers',
    slug: 'first-year-guide',
    excerpt: 'Expert advice and parent-tested tips to help you thrive during your baby\'s first year.',
    content: `
      <p>The first year of motherhood is a whirlwind of joy, exhaustion, discovery, and growth. From feeding and sleep challenges to developmental milestones, new mothers face a steep learning curve.</p>
      <p>This comprehensive guide walks you through what to expect during each stage of your baby's first year, with practical advice from both pediatricians and experienced mothers. We cover everything from newborn care basics to supporting your baby's early development.</p>
      <p>"What surprised me most was how each phase passes so quickly," notes first-time mother Aisha Williams. "Just when I thought I had figured out my baby's patterns, everything would change!"</p>
      <p>Beyond the practical aspects, we also address the emotional journey of new motherhood, including strategies for managing anxiety, dealing with conflicting advice, and nurturing your relationship with your partner during this time of transition.</p>
    `,
    coverImage: '/images/articles/photo1.avif',
    date: '2023-02-10',
    author: {
      name: 'Dr. Lisa Chen',
      image: '/images/authors/profileblog.jpg',
      bio: 'Dr. Chen is a pediatrician and mother who specializes in infant development and maternal health.'
    },
    category: 'baby-care',
    featured: false
  },
  {
    id: '4',
    title: 'Raising Resilient Children in an Uncertain World',
    slug: 'raising-resilient-children',
    excerpt: 'How to foster strength, adaptability, and emotional intelligence in your children.',
    content: `
      <p>In today's rapidly changing world, resilience is perhaps the most important quality we can nurture in our children. But how exactly do we raise kids who can bounce back from setbacks, adapt to change, and thrive despite challenges?</p>
      <p>This article explores the science behind resilience and offers evidence-based strategies parents can use to build this crucial skill. Drawing on insights from child psychologists and successful parents, we provide a roadmap for raising children who are both strong and emotionally intelligent.</p>
      <p>"Resilience isn't about being stoic or never struggling," explains child psychologist Dr. Michael Rivera. "It's about having the tools to work through difficulties and the confidence that you can handle whatever comes your way."</p>
      <p>From practical exercises that build a growth mindset to everyday interactions that foster emotional regulation, this guide helps parents intentionally cultivate resilience from toddlerhood through the teen years.</p>
    `,
    coverImage: '/images/articles/photo2.avif',
    date: '2023-01-18',
    author: {
      name: 'James Wilson',
      image: '/images/authors/profileblog.jpg',
      bio: 'James is an educational psychologist and father who focuses on emotional intelligence and resilience in children.'
    },
    category: 'parenting-tips',
    featured: false
  },
  {
    id: '5',
    title: 'The Modern Mom\'s Guide to Work-Life Integration',
    slug: 'work-life-integration',
    excerpt: 'Strategies for blending career and motherhood in a way that works for your unique situation.',
    content: `
      <p>The concept of "work-life balance" often sets unrealistic expectations for mothers, suggesting that with the right approach, we can perfectly distribute our time and energy. But the reality is messier—and potentially more freeing.</p>
      <p>This article introduces the more practical concept of "work-life integration," exploring how modern mothers can design lives where career and family complement rather than compete with each other. Through interviews with successful working mothers across different fields, we showcase diverse approaches to creating a sustainable lifestyle.</p>
      <p>"Abandoning the idea of perfect balance was liberating," shares tech executive and mother of three, Dina Rodriguez. "Instead of separating my identities as 'professional' and 'mom,' I found ways to bring my whole self to both roles."</p>
      <p>From negotiating flexible work arrangements to building support systems and setting boundaries around technology, this guide offers actionable strategies for reducing stress and increasing satisfaction in both domains.</p>
    `,
    coverImage: '/images/articles/photo3.avif',
    date: '2022-12-12',
    author: {
      name: 'Tasha Brooks',
      image: '/images/authors/profileblog.jpg',
      bio: 'Tasha is a corporate consultant, author, and mother who specializes in workplace culture and work-life integration.'
    },
    category: 'work-life-balance',
    featured: false
  },
];

export function getAllArticles(): Article[] {
  return articles;
}

export function getFeaturedArticles(): Article[] {
  return articles.filter(article => article.featured);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter(article => article.category === category);
}

export function getRecentArticles(count: number): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
} 