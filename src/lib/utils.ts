/**
 * Utility function for merging Tailwind CSS classes.
 * Standard shadcn/ui utility — combines clsx and tailwind-merge.
 * @module lib/utils
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple class names, resolving Tailwind CSS conflicts.
 * @param inputs - Class values to merge (strings, arrays, conditionals)
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * ```ts
 * cn('px-4 py-2', 'px-6'); // => 'py-2 px-6'
 * cn('text-red-500', isActive && 'text-blue-500'); // conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID using crypto.randomUUID with fallback.
 * @returns A unique string identifier
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
