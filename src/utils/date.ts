/**
 * Date formatting and utility functions for BrainBreak.
 * @module utils/date
 */

/**
 * Formats a date string into a human-readable format.
 * @param dateStr - ISO date string (YYYY-MM-DD or full ISO)
 * @returns Formatted date string (e.g., "Jun 13, 2026")
 *
 * @example
 * ```ts
 * formatDate('2026-06-13'); // => "Jun 13, 2026"
 * ```
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns a relative time string (e.g., "2 hours ago", "Yesterday").
 * @param dateStr - ISO date string or timestamp
 * @returns Human-readable relative time
 */
export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateStr);
}

/**
 * Checks if a date string represents today's date.
 * @param dateStr - ISO date string (YYYY-MM-DD)
 * @returns True if the date is today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getDateKey();
}

/**
 * Generates a YYYY-MM-DD date key for the given date (defaults to today).
 * @param date - Optional Date object (defaults to new Date())
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * ```ts
 * getDateKey(); // => "2026-06-13" (today)
 * getDateKey(new Date('2026-01-01')); // => "2026-01-01"
 * ```
 */
export function getDateKey(date?: Date): string {
  const d = date ?? new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets a greeting based on the current time of day.
 * @returns "Good morning", "Good afternoon", or "Good evening"
 */
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
