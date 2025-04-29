import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ThemeProvider } from './components/ThemeProvider';
import AuthProvider from './components/AuthProvider'; // Import AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MomsLove - Celebrating Motherhood',
  description: 'A platform dedicated to celebrating mothers, sharing stories, and providing resources for maternal wellbeing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider> {/* Close AuthProvider */}
      </body>
    </html>
  );
}
