import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge'; // Correct import for twMerge

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
