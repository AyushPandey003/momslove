'use client';

import Image from 'next/image';
import { useState, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

function OptimizedImageBase({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  style,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className={`${className} overflow-hidden relative ${isLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-700' : ''}`} style={style}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        loading={priority ? 'eager' : 'lazy'}
        className={`${
          isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'
        } transition-all duration-300 ease-in-out ${className}`}
      />
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const OptimizedImage = memo(OptimizedImageBase);
OptimizedImage.displayName = 'OptimizedImage';

// Export specialized variants for common use cases
export const CoverImage = memo(({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <OptimizedImageBase
    src={src}
    alt={alt}
    width={0}
    height={0}
    fill
    className={`aspect-video ${className}`}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
  />
));
CoverImage.displayName = 'CoverImage';

export const AvatarImage = memo(({ src, alt, size = 40 }: { src: string; alt: string; size?: number }) => (
  <OptimizedImageBase
    src={src || '/images/default-avatar.png'}
    alt={alt}
    width={size}
    height={size}
    className="rounded-full"
    sizes={`${size}px`}
  />
));
AvatarImage.displayName = 'AvatarImage'; 