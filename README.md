# Mom's Love - A Mother's Day Tribute Blog

A beautiful, modern blog dedicated to celebrating mothers and motherhood around the world. Built with Next.js 15 and TailwindCSS.

![Mom's Love Banner](public/images/readme-banner.png)

## Features

- ✨ Modern UI with a soft, Mother's Day themed design
- 🌓 Dark/Light mode support
- 📱 Fully responsive design for all devices
- ⚡ Fast page loads with Next.js 15 optimizations
- 🔄 Dynamic routing for articles and categories
- 💅 Smooth animations with Framer Motion
- 📝 ZOD validation for form handling
- 🧩 Component-based architecture

## Pages

- **Home Page**: Featured articles, categories, and call-to-action sections
- **Articles Page**: Browse all articles
- **Individual Article Page**: Read full article content with related posts
- **Categories Page**: Browse all categories
- **Category Page**: View articles filtered by category
- **About Page**: Information about the blog and team
- **Contact Page**: Contact form with validation

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: TailwindCSS 4
- **State Management**: React Hooks
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **Theme Switching**: next-themes

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/yourusername/momslove.git
cd momslove
```

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/app
  /components    # Reusable UI components
    /articles    # Article-related components
    /home        # Homepage-specific components
    /layout      # Layout components (header, footer)
    /ui          # Base UI components (buttons, etc.)
  /data          # Mock data for blog content
  /hooks         # Custom React hooks
  /lib           # Utility functions and helpers
  /types         # TypeScript type definitions
  /about         # About page
  /articles      # Articles listing and individual articles
  /categories    # Categories listing and individual categories
  /contact       # Contact page
```

## Deployment

This project can be easily deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/momslove)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## UploadThing Configuration

For the profile image upload functionality to work, you need to set up UploadThing:

1. Create an account at [UploadThing](https://uploadthing.com/)
2. Create a new project
3. Add these environment variables to your `.env.local` file:
```
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

---

Made with ❤️ for celebrating mothers everywhere.
