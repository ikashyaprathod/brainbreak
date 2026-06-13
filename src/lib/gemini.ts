/**
 * Server-side Google Gemini AI client initialization.
 * This module should ONLY be imported in API routes (server-side).
 * @module lib/gemini
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG } from '@/utils/constants';

/**
 * Initializes and returns the Google Generative AI client.
 * Throws if the API key is not configured.
 * @returns GoogleGenerativeAI instance
 * @throws Error if GEMINI_API_KEY is not set
 */
function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Add it to your .env.local file.'
    );
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Gets a configured Gemini model instance for content generation.
 * @param temperature - Generation temperature (0-1). Lower = more deterministic.
 * @param maxOutputTokens - Maximum tokens in the response.
 * @returns Configured GenerativeModel instance
 */
export function getGeminiModel(
  temperature: number = AI_CONFIG.CHAT_TEMPERATURE,
  maxOutputTokens: number = AI_CONFIG.CHAT_MAX_TOKENS
) {
  const client = getClient();

  return client.getGenerativeModel({
    model: AI_CONFIG.MODEL_NAME,
    generationConfig: {
      temperature,
      maxOutputTokens,
      topP: 0.95,
      topK: 40,
    },
  });
}
