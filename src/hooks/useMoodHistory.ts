/**
 * Hook for managing mood history data.
 * Provides CRUD operations for mood entries stored in localStorage.
 * @module hooks/useMoodHistory
 */

'use client';

import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import { calculateAverageMood } from '@/utils/mood';
import { generateId } from '@/lib/utils';
import { getDateKey } from '@/utils/date';
import type { MoodEntry, MoodScore, ExamType } from '@/types';

/** Return type for the useMoodHistory hook */
interface UseMoodHistoryReturn {
  /** All mood entries, sorted newest first */
  readonly moods: MoodEntry[];
  /** Add a new mood entry */
  readonly addMood: (mood: MoodScore, emoji: string, examType: ExamType) => MoodEntry;
  /** Get mood entry for a specific date */
  readonly getMoodByDate: (date: string) => MoodEntry | undefined;
  /** Average mood across all entries */
  readonly averageMood: number;
  /** Array of dates with entries (for streak calculation) */
  readonly entryDates: string[];
}

/**
 * Custom hook for mood history CRUD operations.
 * All data is persisted in localStorage.
 *
 * @returns UseMoodHistoryReturn with mood data and operations
 */
export function useMoodHistory(): UseMoodHistoryReturn {
  const [moods, setMoods] = useLocalStorage<MoodEntry[]>(
    STORAGE_KEYS.MOOD_HISTORY,
    []
  );

  /** Memoized sorted moods (newest first) */
  const sortedMoods = useMemo(
    () => [...moods].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [moods]
  );

  /** Memoized average mood */
  const averageMood = useMemo(() => calculateAverageMood(moods), [moods]);

  /** Memoized entry dates for streak calculation */
  const entryDates = useMemo(
    () => moods.map((m) => m.date),
    [moods]
  );

  /** Adds a new mood entry and returns it */
  const addMood = useCallback(
    (mood: MoodScore, emoji: string, examType: ExamType): MoodEntry => {
      const entry: MoodEntry = {
        id: generateId(),
        date: getDateKey(),
        mood,
        emoji,
        examType,
        createdAt: new Date().toISOString(),
      };
      setMoods((prev) => [...prev, entry]);
      return entry;
    },
    [setMoods]
  );

  /** Gets mood entry for a specific date */
  const getMoodByDate = useCallback(
    (date: string): MoodEntry | undefined => {
      return moods.find((m) => m.date === date);
    },
    [moods]
  );

  return {
    moods: sortedMoods,
    addMood,
    getMoodByDate,
    averageMood,
    entryDates,
  };
}
