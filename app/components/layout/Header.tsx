import Link from 'next/link';
// import { ThemeToggle } from '@/app/components/ui/ThemeToggle';
import { auth } from '@/auth'; // Import server-side auth
import LoginButton from '@/app/components/auth/LoginButton';
import LogoutButton from '@/app/components/auth/LogoutButton';
import MobileMenu from './MobileMenu'; // Import the new MobileMenu component

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Articles', href: '/articles' },
  { name: 'Categories', href: '/categories' },
  { name: 'Preferences', href: '/preferences' }, // Keep preferences link
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

// Make Header an async server component
export default async function Header() {
  const session = await auth(); // Fetch session server-side
  const user = session?.user;

  // Filter out Preferences link if user is not logged in
  const filteredNavigation = user
    ? navigation
    : navigation.filter(item => item.name !== 'Preferences');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center font-bold text-xl text-pink-700 dark:text-pink-400"
            >
              <span className="sr-only">MomsLove</span>
              {/* Logo SVG */}
              <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="currentColor" />
                <path d="M16 9C16.5523 9 17 8.55228 17 8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8C15 8.55228 15.4477 9 16 9Z" fill="currentColor" />
                <path d="M12 18C15 18 16.5 15.5 17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              MomsLove
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-x-8">
             <div className="flex items-center space-x-4">
               {filteredNavigation.map((item) => (
                 <Link
                   key={item.name}
                   href={item.href}
                   className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pink-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-pink-400 dark:hover:bg-gray-800"
                 >
                   {item.name}
                 </Link>
               ))}
             </div>

             {/* Desktop Auth Buttons & Theme Toggle */}
             <div className="flex items-center gap-x-4">
                {/* <ThemeToggle /> */}
                {user ? (
                  <LogoutButton userName={user.name} userImage={user.image} />
                ) : (
                  <LoginButton />
                )}
             </div>
          </div>


          {/* Mobile Menu Trigger (uses MobileMenu component) */}
          <MobileMenu navigation={filteredNavigation} session={session} />

        </div>
      </nav>
    </header>
  );
}
