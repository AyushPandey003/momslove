import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge'; // Correct import for twMerge

export function cn(...inputs: any[]) {
  return twMerge(clsx(...inputs));
}
