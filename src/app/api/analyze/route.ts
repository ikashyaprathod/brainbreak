/**
 * API route for analyzing journal entries using Gemini AI.
 * Identifies stress triggers, emotional patterns, and provides suggestions.
 *
 * POST /api/analyze
 * @module app/api/analyze
 */

import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { buildAnalysisPrompt } from '@/lib/prompts';
import { sanitizeForAI } from '@/lib/sanitize';
import { validateAnalyzeRequest } from '@/lib/validators';
import { checkRateLimit, getRateLimitHeaders, getSessionId } from '@/lib/rate-limiter';
import { AI_CONFIG } from '@/utils/constants';
import type { AIAnalysis, APIErrorResponse } from '@/types';

/**
 * Handles POST requests for journal entry analysis.
 * Validates input, sanitizes content, checks rate limits,
 * then calls Gemini AI for structured analysis.
 */
export async function POST(request: Request): Promise<NextResponse<{ analysis: AIAnalysis } | APIErrorResponse>> {
  try {
    // 1. Rate limiting
    const sessionId = getSessionId(request);
    const rateLimit = checkRateLimit(sessionId);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.', retryAfter: rateLimit.resetIn },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    // 2. Parse and validate request body
    const body: unknown = await request.json();
    const { content, mood, examType } = validateAnalyzeRequest(body);

    // 3. Sanitize input for AI
    const sanitizedContent = sanitizeForAI(content);

    if (sanitizedContent.length === 0) {
      return NextResponse.json(
        { error: 'Journal entry content cannot be empty after sanitization.' },
        { status: 400 }
      );
    }

    // 4. Build prompt and call Gemini
    const model = getGeminiModel(AI_CONFIG.ANALYSIS_TEMPERATURE, AI_CONFIG.ANALYSIS_MAX_TOKENS);
    const prompt = buildAnalysisPrompt(examType);

    const result = await model.generateContent(
      `${prompt}\n\nMood Score: ${mood}/10\n\nJournal Entry:\n${sanitizedContent}`
    );

    const responseText = result.response.text();

    // 5. Parse AI response as JSON
    const analysis = parseAnalysisResponse(responseText);

    return NextResponse.json(
      { analysis },
      { headers: getRateLimitHeaders(rateLimit) }
    );
  } catch (error) {
    // Never return raw API errors to the client
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';

    // Check if it's a validation error (client's fault) vs server error
    if (message.includes('must be') || message.includes('cannot be')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to analyze your entry. Please try again in a moment.' },
      { status: 500 }
    );
  }
}

/**
 * Parses the AI response text into a structured AIAnalysis object.
 * Handles cases where the AI wraps JSON in markdown code blocks.
 *
 * @param text - Raw response text from Gemini
 * @returns Parsed AIAnalysis object
 */
function parseAnalysisResponse(text: string): AIAnalysis {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  try {
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;

    return {
      triggers: Array.isArray(parsed.triggers) ? parsed.triggers.map(String) : [],
      patterns: Array.isArray(parsed.patterns) ? parsed.patterns.map(String) : [],
      summary: typeof parsed.summary === 'string' ? parsed.summary : 'Analysis completed.',
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String) : [],
    };
  } catch {
    // Fallback if AI doesn't return valid JSON
    return {
      triggers: [],
      patterns: [],
      summary: text.slice(0, 200),
      suggestions: ['Take a few deep breaths', 'Consider talking to someone you trust'],
    };
  }
}
