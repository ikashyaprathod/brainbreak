/**
 * Streak calculation logic for BrainBreak.
 * Computes current and best consecutive-day streaks from date entries.
 * @module utils/streak
 */

import type { StreakData } from '@/types';

/**
 * Calculates current and best streaks from an array of date strings.
 * Dates should be in YYYY-MM-DD format.
 *
 * @param dates - Array of date strings when entries were logged
 * @returns StreakData with current streak, best streak, and today's activity status
 *
 * @example
 * ```ts
 * calculateStreak(['2026-06-11', '2026-06-12', '2026-06-13']);
 * // => { current: 3, best: 3, isActiveToday: true }
 * ```
 */
export function calculateStreak(dates: string[]): StreakData {
  if (dates.length === 0) {
    return { current: 0, best: 0, isActiveToday: false };
  }

  // Deduplicate and sort dates in descending order (newest first)
  const uniqueDates = Array.from(new Set(dates)).sort().reverse();

  const today = getDateKey(new Date());
  const isActiveToday = uniqueDates[0] === today;

  // Calculate current streak (must include today or yesterday)
  let currentStreak = 0;

  // Only count current streak if the most recent entry is today or yesterday
  if (uniqueDates[0] === today || uniqueDates[0] === getDateKey(getPreviousDay(new Date()))) {
    let expectedDate = uniqueDates[0];
    for (const date of uniqueDates) {
      if (date === expectedDate) {
        currentStreak++;
        expectedDate = getDateKey(getPreviousDay(new Date(expectedDate + 'T00:00:00')));
      } else if (date < expectedDate) {
        break;
      }
    }
  }

  // Calculate best streak ever
  let bestStreak = 0;
  let tempStreak = 1;
  const sortedAsc = [...uniqueDates].sort();

  for (let i = 1; i < sortedAsc.length; i++) {
    const prevDate = new Date(sortedAsc[i - 1] + 'T00:00:00');
    const currDate = new Date(sortedAsc[i] + 'T00:00:00');
    const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      tempStreak++;
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak, currentStreak);

  return { current: currentStreak, best: bestStreak, isActiveToday };
}

/**
 * Gets the previous day from a given date.
 * @param date - The reference date
 * @returns A new Date object representing the previous day
 */
function getPreviousDay(date: Date): Date {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return prev;
}

/**
 * Converts a Date to a YYYY-MM-DD string key.
 * @param date - The date to convert
 * @returns Date string in YYYY-MM-DD format
 */
function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
