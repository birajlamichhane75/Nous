/**
 * Utility Functions
 * 
 * Common utility helpers for the application:
 * - cn(): Merge Tailwind CSS class names using clsx and twMerge
 *   Resolves conflicting utility classes intelligently.
 *   Usage: cn('px-2 px-4', 'py-2') => 'px-4 py-2'
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge CSS class names with Tailwind conflict resolution
 * @param inputs - Class names or objects to merge
 * @returns Merged class string with resolved conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
