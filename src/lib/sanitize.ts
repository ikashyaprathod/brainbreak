/**
 * Input sanitization utilities for BrainBreak.
 * Prevents XSS attacks and prompt injection.
 * @module lib/sanitize
 */

import { MAX_JOURNAL_LENGTH } from '@/utils/constants';

/**
 * Strips HTML tags from a string to prevent XSS.
 * @param input - Raw user input string
 * @returns Sanitized string with HTML tags removed
 *
 * @example
 * ```ts
 * sanitizeInput('<script>alert("xss")</script>Hello'); // => "Hello"
 * sanitizeInput('Normal text'); // => "Normal text"
 * ```
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    // Remove HTML/script tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '')
    // Normalize whitespace (but preserve newlines for journal entries)
    .replace(/[\t\r]/g, ' ')
    // Remove null bytes
    .replace(/\0/g, '')
    .trim();
}

/**
 * Sanitizes input specifically for sending to the AI API.
 * Includes length limiting and additional safety checks.
 * @param input - Raw user input
 * @returns Sanitized and length-limited string safe for AI consumption
 */
export function sanitizeForAI(input: string): string {
  const sanitized = sanitizeInput(input);

  // Truncate to max length
  const truncated = sanitized.slice(0, MAX_JOURNAL_LENGTH);

  // Remove potential prompt injection patterns
  return truncated
    .replace(/\bsystem\s*:/gi, '')
    .replace(/\bignore\s+(?:all\s+)?(?:previous|above)\s+instructions?\b/gi, '')
    .replace(/\byou\s+are\s+now\b/gi, '');
}

/**
 * Validates that a string is non-empty after sanitization.
 * @param input - String to validate
 * @returns True if the sanitized string has content
 */
export function isValidContent(input: string): boolean {
  return sanitizeInput(input).length > 0;
}
