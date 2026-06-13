/**
 * Mood-related utility functions for BrainBreak.
 * Maps mood scores to emojis, labels, and colors.
 * @module utils/mood
 */

import { MOOD_EMOJIS } from './constants';
import type { MoodEntry } from '@/types';

/**
 * Maps a mood score (1-10) to its corresponding emoji.
 * @param mood - Mood score from 1-10
 * @returns Emoji string representing the mood
 *
 * @example
 * ```ts
 * getMoodEmoji(1); // => "😫"
 * getMoodEmoji(9); // => "🤩"
 * ```
 */
export function getMoodEmoji(mood: number): string {
  const config = MOOD_EMOJIS.find(
    (m) => mood >= m.minScore && mood <= m.maxScore
  );
  return config?.emoji ?? '😐';
}

/**
 * Maps a mood score (1-10) to a human-readable label.
 * @param mood - Mood score from 1-10
 * @returns Label string (e.g., "Very Low", "Excellent")
 */
export function getMoodLabel(mood: number): string {
  const config = MOOD_EMOJIS.find(
    (m) => mood >= m.minScore && mood <= m.maxScore
  );
  return config?.label ?? 'Okay';
}

/**
 * Maps a mood score (1-10) to a Tailwind CSS color class.
 * @param mood - Mood score from 1-10
 * @returns Tailwind color class string
 */
export function getMoodColor(mood: number): string {
  const config = MOOD_EMOJIS.find(
    (m) => mood >= m.minScore && mood <= m.maxScore
  );
  return config?.color ?? 'text-yellow-500';
}

/**
 * Returns a Tailwind background color class based on mood score.
 * Used for chart gradients and card backgrounds.
 * @param mood - Mood score from 1-10
 * @returns Tailwind background color class
 */
export function getMoodBgColor(mood: number): string {
  if (mood <= 2) return 'bg-red-500/20';
  if (mood <= 4) return 'bg-orange-500/20';
  if (mood <= 6) return 'bg-yellow-500/20';
  if (mood <= 8) return 'bg-emerald-500/20';
  return 'bg-green-500/20';
}

/**
 * Calculates the average mood from an array of mood entries.
 * Returns 0 if the array is empty.
 * @param entries - Array of mood entries
 * @returns Average mood rounded to 1 decimal place
 *
 * @example
 * ```ts
 * calculateAverageMood([{ mood: 7 }, { mood: 5 }]); // => 6.0
 * calculateAverageMood([]); // => 0
 * ```
 */
export function calculateAverageMood(entries: Pick<MoodEntry, 'mood'>[]): number {
  if (entries.length === 0) return 0;
  const total = entries.reduce((sum, entry) => sum + entry.mood, 0);
  return Math.round((total / entries.length) * 10) / 10;
}

/**
 * Returns the hex color for mood chart visualization.
 * Gradient from red (low) to green (high).
 * @param mood - Mood score from 1-10
 * @returns Hex color string
 */
export function getMoodChartColor(mood: number): string {
  if (mood <= 2) return '#EF4444';
  if (mood <= 4) return '#F97316';
  if (mood <= 6) return '#EAB308';
  if (mood <= 8) return '#10B981';
  return '#22C55E';
}
