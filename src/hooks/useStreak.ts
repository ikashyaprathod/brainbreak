/**
 * Hook for streak calculation from entry dates.
 * @module hooks/useStreak
 */

'use client';

import { useMemo } from 'react';
import { calculateStreak } from '@/utils/streak';
import type { StreakData } from '@/types';

/**
 * Custom hook that calculates streaks from an array of date strings.
 * Uses useMemo to avoid recalculating on every render.
 *
 * @param dates - Array of YYYY-MM-DD date strings when entries were made
 * @returns StreakData with current streak, best streak, and today's status
 *
 * @example
 * ```tsx
 * const { entries } = useJournalEntries();
 * const streak = useStreak(entries.map(e => e.date));
 * ```
 */
export function useStreak(dates: string[]): StreakData {
  return useMemo(() => calculateStreak(dates), [dates]);
}
