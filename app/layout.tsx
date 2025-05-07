import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Footer from './components/layout/Footer';
import { ThemeProvider } from './components/ThemeProvider';
import AuthProvider from './components/AuthProvider'; // Import AuthProvider
import { ToastProvider } from './components/ui/Toast'; // Import ToastProvider
import PWAProvider from './components/pwa/PWAProvider'; // Import PWA Provider
import InstallPrompt from './components/pwa/InstallPrompt'; // Import Install Prompt

// Load Inter font and subset to only latin characters
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// Define metadata for SEO
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://momslove.vercel.app'),
  title: {
    template: '%s | MomsLove',
    default: 'MomsLove - Celebrating Motherhood',
  },
  description: 'A platform dedicated to celebrating mothers, sharing stories, and providing resources for maternal wellbeing.',
  keywords: ['mothers', 'parenting', 'stories', 'motherhood', 'community'],
  authors: [{ name: 'MomsLove Team' }],
  creator: 'MomsLove',
  publisher: 'MomsLove',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'MomsLove - Celebrating Motherhood',
    description: 'A platform dedicated to celebrating mothers, sharing stories, and providing resources for maternal wellbeing.',
    url: 'https://momslove.vercel.app',
    siteName: 'MomsLove',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MomsLove - Celebrating Motherhood',
    description: 'A platform dedicated to celebrating mothers, sharing stories, and providing resources for maternal wellbeing.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json', // Add manifest link for PWA
  appleWebApp: {
    capable: true,
    title: 'MomsLove',
    statusBarStyle: 'black-translucent',
  },
};

// Define viewport settings
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        {/* Preconnect to critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Preload critical CSS and fonts */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Apple PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              <PWAProvider> {/* PWA Provider registers service worker */}
                <div className="flex min-h-screen flex-col">
                  <main className="flex-1">{children}</main> {/* Wrap children in main for semantics */}
                  <Footer />
                  <InstallPrompt /> {/* PWA install prompt */}
                </div>
              </PWAProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider> 
      </body>
    </html>
  );
}
