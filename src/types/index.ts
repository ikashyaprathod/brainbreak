/**
 * Core TypeScript types for BrainBreak application.
 * All types are strictly defined — zero `any` types allowed.
 * @module types
 */

/** Supported competitive exam types */
export type ExamType = 'NEET' | 'JEE' | 'CUET' | 'CAT' | 'GATE' | 'UPSC';

/** Mood scale value (1-10) */
export type MoodScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Chat message role */
export type MessageRole = 'user' | 'assistant';

/** Mindfulness exercise type */
export type ExerciseType = 'breathing' | 'meditation' | 'physical';

/**
 * A single mood log entry.
 * Stored in localStorage as part of an array.
 */
export interface MoodEntry {
  /** Unique identifier (UUID) */
  readonly id: string;
  /** ISO date string (YYYY-MM-DD) */
  readonly date: string;
  /** Mood score from 1-10 */
  readonly mood: MoodScore;
  /** Emoji representing the mood */
  readonly emoji: string;
  /** Exam the student is preparing for */
  readonly examType: ExamType;
  /** ISO timestamp of creation */
  readonly createdAt: string;
}

/**
 * AI-generated analysis of a journal entry.
 * Returned by the /api/analyze endpoint.
 */
export interface AIAnalysis {
  /** Identified stress triggers (e.g., "exam anxiety", "peer comparison") */
  readonly triggers: string[];
  /** Detected emotional patterns (e.g., "declining mood on weekdays") */
  readonly patterns: string[];
  /** Brief empathetic summary of the entry */
  readonly summary: string;
  /** Personalized coping suggestions */
  readonly suggestions: string[];
}

/**
 * A single journal entry with optional AI analysis.
 */
export interface JournalEntry {
  /** Unique identifier (UUID) */
  readonly id: string;
  /** ISO date string (YYYY-MM-DD) */
  readonly date: string;
  /** Journal text content */
  readonly content: string;
  /** Associated mood score */
  readonly mood: MoodScore;
  /** Emoji representing the mood */
  readonly emoji: string;
  /** Exam the student is preparing for */
  readonly examType: ExamType;
  /** AI-generated analysis (populated after API call) */
  readonly analysis?: AIAnalysis;
  /** ISO timestamp of creation */
  readonly createdAt: string;
}

/**
 * A single chat message in the AI companion conversation.
 */
export interface ChatMessage {
  /** Unique identifier (UUID) */
  readonly id: string;
  /** Who sent the message */
  readonly role: MessageRole;
  /** Message text content */
  readonly content: string;
  /** Unix timestamp (ms) */
  readonly timestamp: number;
}

/**
 * User profile stored in localStorage.
 */
export interface UserProfile {
  /** User's display name */
  readonly name: string;
  /** Selected exam type */
  readonly examType: ExamType;
  /** Whether onboarding has been completed */
  readonly onboarded: boolean;
}

/**
 * A mindfulness exercise recommended by AI.
 */
export interface MindfulnessExercise {
  /** Exercise title */
  readonly title: string;
  /** Brief description */
  readonly description: string;
  /** Duration (e.g., "5 minutes") */
  readonly duration: string;
  /** Type of exercise */
  readonly type: ExerciseType;
  /** Step-by-step instructions */
  readonly steps: string[];
}

/**
 * Streak calculation result.
 */
export interface StreakData {
  /** Current consecutive days */
  readonly current: number;
  /** All-time best streak */
  readonly best: number;
  /** Whether the user has logged today */
  readonly isActiveToday: boolean;
}

/**
 * Quick statistics for the dashboard.
 */
export interface QuickStatsData {
  /** Total number of journal entries */
  readonly totalEntries: number;
  /** Average mood across all entries */
  readonly averageMood: number;
  /** Current streak in days */
  readonly currentStreak: number;
  /** Total days since first entry */
  readonly daysTracked: number;
}

// ─── API Request/Response Types ──────────────────────────────────────

/** Request body for /api/analyze */
export interface AnalyzeRequest {
  readonly content: string;
  readonly mood: number;
  readonly examType: ExamType;
}

/** Response body from /api/analyze */
export interface AnalyzeResponse {
  readonly analysis: AIAnalysis;
}

/** Request body for /api/chat */
export interface ChatRequest {
  readonly messages: ChatMessage[];
  readonly examType: ExamType;
  readonly currentMood: number;
}

/** Request body for /api/mindfulness */
export interface MindfulnessRequest {
  readonly mood: number;
  readonly triggers: string[];
  readonly examType: ExamType;
}

/** Response body from /api/mindfulness */
export interface MindfulnessResponse {
  readonly exercises: MindfulnessExercise[];
}

/** Generic API error response */
export interface APIErrorResponse {
  readonly error: string;
  readonly retryAfter?: number;
}
