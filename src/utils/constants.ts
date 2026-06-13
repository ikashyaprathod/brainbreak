/**
 * Application-wide constants for BrainBreak.
 * Centralizes all magic strings, config values, and static data.
 * @module utils/constants
 */

import type { ExamType } from '@/types';

// ─── Exam Configuration ─────────────────────────────────────────────

/** Exam metadata for display and AI context */
export interface ExamInfo {
  readonly id: ExamType;
  readonly label: string;
  readonly fullName: string;
  readonly description: string;
  readonly icon: string;
}

/** All supported competitive exams with metadata */
export const EXAM_LIST: readonly ExamInfo[] = [
  {
    id: 'NEET',
    label: 'NEET',
    fullName: 'National Eligibility cum Entrance Test',
    description: 'Medical entrance exam',
    icon: '🩺',
  },
  {
    id: 'JEE',
    label: 'JEE',
    fullName: 'Joint Entrance Examination',
    description: 'Engineering entrance exam',
    icon: '⚙️',
  },
  {
    id: 'CUET',
    label: 'CUET',
    fullName: 'Common University Entrance Test',
    description: 'Central university admissions',
    icon: '🎓',
  },
  {
    id: 'CAT',
    label: 'CAT',
    fullName: 'Common Admission Test',
    description: 'MBA entrance exam',
    icon: '📊',
  },
  {
    id: 'GATE',
    label: 'GATE',
    fullName: 'Graduate Aptitude Test in Engineering',
    description: 'Postgrad engineering exam',
    icon: '🔬',
  },
  {
    id: 'UPSC',
    label: 'UPSC',
    fullName: 'Union Public Service Commission',
    description: 'Civil services exam',
    icon: '🏛️',
  },
] as const;

// ─── Mood Configuration ─────────────────────────────────────────────

/** Emoji mapped to mood score ranges */
export interface MoodEmojiConfig {
  readonly emoji: string;
  readonly label: string;
  readonly minScore: number;
  readonly maxScore: number;
  readonly color: string;
}

/** Mood emoji configurations (5 levels covering 1-10 scale) */
export const MOOD_EMOJIS: readonly MoodEmojiConfig[] = [
  { emoji: '😫', label: 'Very Low', minScore: 1, maxScore: 2, color: 'text-red-500' },
  { emoji: '😟', label: 'Low', minScore: 3, maxScore: 4, color: 'text-orange-500' },
  { emoji: '😐', label: 'Okay', minScore: 5, maxScore: 6, color: 'text-yellow-500' },
  { emoji: '😊', label: 'Good', minScore: 7, maxScore: 8, color: 'text-emerald-500' },
  { emoji: '🤩', label: 'Excellent', minScore: 9, maxScore: 10, color: 'text-green-500' },
] as const;

// ─── localStorage Keys ──────────────────────────────────────────────

/** All localStorage keys — prevents magic strings */
export const STORAGE_KEYS = {
  MOOD_HISTORY: 'brainbreak_mood_history',
  JOURNAL_ENTRIES: 'brainbreak_journal_entries',
  CHAT_HISTORY: 'brainbreak_chat_history',
  USER_PROFILE: 'brainbreak_user_profile',
  JOURNAL_DRAFT: 'brainbreak_journal_draft',
} as const;

// ─── Rate Limiting ──────────────────────────────────────────────────

/** Rate limit configuration */
export const RATE_LIMIT = {
  /** Maximum requests per window */
  MAX_REQUESTS: 10,
  /** Window duration in milliseconds (60 seconds) */
  WINDOW_MS: 60_000,
} as const;

// ─── AI Configuration ───────────────────────────────────────────────

/** NVIDIA model configuration */
export const AI_CONFIG = {
  /** Model name */
  MODEL_NAME: 'nvidia/nemotron-3-ultra-550b-a55b',
  /** Temperature for analysis (more deterministic) */
  ANALYSIS_TEMPERATURE: 0.4,
  /** Temperature for chat (more creative) */
  CHAT_TEMPERATURE: 0.7,
  /** Temperature for mindfulness suggestions */
  MINDFULNESS_TEMPERATURE: 0.6,
  /** Max output tokens for analysis */
  ANALYSIS_MAX_TOKENS: 1024,
  /** Max output tokens for chat */
  CHAT_MAX_TOKENS: 512,
  /** Max output tokens for mindfulness */
  MINDFULNESS_MAX_TOKENS: 1024,
  /** Max messages to send to chat API */
  MAX_CHAT_MESSAGES: 20,
  /** Max messages to store in localStorage */
  MAX_STORED_MESSAGES: 50,
} as const;

// ─── UI Constants ───────────────────────────────────────────────────

/** Maximum journal entry length */
export const MAX_JOURNAL_LENGTH = 5000;

/** Debounce delay for journal auto-save (ms) */
export const DEBOUNCE_DELAY_MS = 500;

/** Navigation links */
export const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/journal', label: 'Journal', icon: 'BookOpen' },
  { href: '/chat', label: 'AI Chat', icon: 'MessageCircle' },
  { href: '/insights', label: 'Insights', icon: 'TrendingUp' },
] as const;
