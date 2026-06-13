/**
 * Hook for managing journal entries.
 * Provides CRUD operations and AI analysis integration.
 * @module hooks/useJournalEntries
 */

'use client';

import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import { generateId } from '@/lib/utils';
import { getDateKey } from '@/utils/date';
import { getMoodEmoji } from '@/utils/mood';
import type { JournalEntry, MoodScore, ExamType, AIAnalysis } from '@/types';

/** Return type for the useJournalEntries hook */
interface UseJournalEntriesReturn {
  /** All journal entries, sorted newest first */
  readonly entries: JournalEntry[];
  /** Add a new journal entry */
  readonly addEntry: (content: string, mood: MoodScore, examType: ExamType) => JournalEntry;
  /** Update an entry with AI analysis */
  readonly updateWithAnalysis: (id: string, analysis: AIAnalysis) => void;
  /** Get entry for a specific date */
  readonly getEntryByDate: (date: string) => JournalEntry | undefined;
  /** Delete an entry by ID */
  readonly deleteEntry: (id: string) => void;
  /** Array of dates with entries (for streak calculation) */
  readonly entryDates: string[];
  /** All triggers aggregated from all entries */
  readonly allTriggers: string[];
}

/**
 * Custom hook for journal entry CRUD operations.
 * All data is persisted in localStorage.
 *
 * @returns UseJournalEntriesReturn with entry data and operations
 */
export function useJournalEntries(): UseJournalEntriesReturn {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>(
    STORAGE_KEYS.JOURNAL_ENTRIES,
    []
  );

  /** Memoized sorted entries (newest first) */
  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [entries]
  );

  /** Memoized entry dates for streak calculation */
  const entryDates = useMemo(
    () => entries.map((e) => e.date),
    [entries]
  );

  /** Memoized aggregated triggers from all entries */
  const allTriggers = useMemo(() => {
    const triggerCounts = new Map<string, number>();
    for (const entry of entries) {
      if (entry.analysis?.triggers) {
        for (const trigger of entry.analysis.triggers) {
          const normalized = trigger.toLowerCase().trim();
          triggerCounts.set(normalized, (triggerCounts.get(normalized) ?? 0) + 1);
        }
      }
    }
    // Sort by frequency (most common first)
    return Array.from(triggerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([trigger]) => trigger);
  }, [entries]);

  /** Adds a new journal entry and returns it */
  const addEntry = useCallback(
    (content: string, mood: MoodScore, examType: ExamType): JournalEntry => {
      const entry: JournalEntry = {
        id: generateId(),
        date: getDateKey(),
        content,
        mood,
        emoji: getMoodEmoji(mood),
        examType,
        createdAt: new Date().toISOString(),
      };
      setEntries((prev) => [...prev, entry]);
      return entry;
    },
    [setEntries]
  );

  /** Updates an existing entry with AI analysis results */
  const updateWithAnalysis = useCallback(
    (id: string, analysis: AIAnalysis): void => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, analysis } : entry
        )
      );
    },
    [setEntries]
  );

  /** Gets the journal entry for a specific date */
  const getEntryByDate = useCallback(
    (date: string): JournalEntry | undefined => {
      return entries.find((e) => e.date === date);
    },
    [entries]
  );

  /** Deletes a journal entry by ID */
  const deleteEntry = useCallback(
    (id: string): void => {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    },
    [setEntries]
  );

  return {
    entries: sortedEntries,
    addEntry,
    updateWithAnalysis,
    getEntryByDate,
    deleteEntry,
    entryDates,
    allTriggers,
  };
}
