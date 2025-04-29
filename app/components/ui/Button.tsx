import React from 'react';
import Link from 'next/link';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', href, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      default: 'bg-pink-600 text-white hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800',
      ghost: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 data-[state=open]:bg-transparent',
      link: 'text-pink-600 underline-offset-4 hover:underline dark:text-pink-400'
    };
    
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3 rounded-md text-sm',
      lg: 'h-12 px-8 rounded-md text-lg',
      icon: 'h-10 w-10'
    };
    
    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );
    
    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    
    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button'; 