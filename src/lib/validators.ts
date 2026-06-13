/**
 * Request body validators for API routes.
 * Validates shape and types of incoming request bodies.
 * @module lib/validators
 */

import type { ExamType, AnalyzeRequest, ChatRequest, MindfulnessRequest, ChatMessage } from '@/types';
import { EXAM_LIST, MAX_JOURNAL_LENGTH, AI_CONFIG } from '@/utils/constants';

/** Valid exam type values for validation */
const VALID_EXAM_TYPES: readonly string[] = EXAM_LIST.map((e) => e.id);

/**
 * Validates and parses the request body for /api/analyze.
 * @param body - Raw request body (unknown type)
 * @returns Validated AnalyzeRequest
 * @throws Error with descriptive message if validation fails
 */
export function validateAnalyzeRequest(body: unknown): AnalyzeRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be a JSON object');
  }

  const { content, mood, examType } = body as Record<string, unknown>;

  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('Content must be a non-empty string');
  }

  if (content.length > MAX_JOURNAL_LENGTH) {
    throw new Error(`Content must be ${MAX_JOURNAL_LENGTH} characters or fewer`);
  }

  if (typeof mood !== 'number' || mood < 1 || mood > 10 || !Number.isInteger(mood)) {
    throw new Error('Mood must be an integer between 1 and 10');
  }

  if (typeof examType !== 'string' || !VALID_EXAM_TYPES.includes(examType)) {
    throw new Error(`ExamType must be one of: ${VALID_EXAM_TYPES.join(', ')}`);
  }

  return {
    content: content.trim(),
    mood,
    examType: examType as ExamType,
  };
}

/**
 * Validates and parses the request body for /api/chat.
 * @param body - Raw request body (unknown type)
 * @returns Validated ChatRequest
 * @throws Error with descriptive message if validation fails
 */
export function validateChatRequest(body: unknown): ChatRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be a JSON object');
  }

  const { messages, examType, currentMood } = body as Record<string, unknown>;

  if (!Array.isArray(messages)) {
    throw new Error('Messages must be an array');
  }

  // Validate each message
  const validatedMessages: ChatMessage[] = messages
    .slice(-AI_CONFIG.MAX_CHAT_MESSAGES) // Limit to last N messages
    .map((msg: unknown, index: number) => {
      if (!msg || typeof msg !== 'object') {
        throw new Error(`Message at index ${index} must be an object`);
      }

      const { id, role, content, timestamp } = msg as Record<string, unknown>;

      if (typeof id !== 'string') {
        throw new Error(`Message at index ${index} must have a string id`);
      }

      if (role !== 'user' && role !== 'assistant') {
        throw new Error(`Message at index ${index} must have role "user" or "assistant"`);
      }

      if (typeof content !== 'string' || content.trim().length === 0) {
        throw new Error(`Message at index ${index} must have non-empty content`);
      }

      if (typeof timestamp !== 'number') {
        throw new Error(`Message at index ${index} must have a numeric timestamp`);
      }

      return { id, role, content: content.trim(), timestamp };
    });

  if (typeof examType !== 'string' || !VALID_EXAM_TYPES.includes(examType)) {
    throw new Error(`ExamType must be one of: ${VALID_EXAM_TYPES.join(', ')}`);
  }

  if (typeof currentMood !== 'number' || currentMood < 1 || currentMood > 10) {
    throw new Error('CurrentMood must be a number between 1 and 10');
  }

  return {
    messages: validatedMessages,
    examType: examType as ExamType,
    currentMood,
  };
}

/**
 * Validates and parses the request body for /api/mindfulness.
 * @param body - Raw request body (unknown type)
 * @returns Validated MindfulnessRequest
 * @throws Error with descriptive message if validation fails
 */
export function validateMindfulnessRequest(body: unknown): MindfulnessRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be a JSON object');
  }

  const { mood, triggers, examType } = body as Record<string, unknown>;

  if (typeof mood !== 'number' || mood < 1 || mood > 10) {
    throw new Error('Mood must be a number between 1 and 10');
  }

  if (!Array.isArray(triggers)) {
    throw new Error('Triggers must be an array');
  }

  const validatedTriggers = triggers.map((t: unknown) => {
    if (typeof t !== 'string') {
      throw new Error('Each trigger must be a string');
    }
    return t.trim();
  });

  if (typeof examType !== 'string' || !VALID_EXAM_TYPES.includes(examType)) {
    throw new Error(`ExamType must be one of: ${VALID_EXAM_TYPES.join(', ')}`);
  }

  return {
    mood,
    triggers: validatedTriggers,
    examType: examType as ExamType,
  };
}
