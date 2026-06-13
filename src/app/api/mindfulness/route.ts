/**
 * API route for AI-powered mindfulness exercise suggestions.
 * Returns tailored exercises based on mood and identified triggers.
 *
 * POST /api/mindfulness
 * @module app/api/mindfulness
 */

import { NextResponse } from 'next/server';
import { getModel } from '@/lib/gemini';
import { buildMindfulnessPrompt } from '@/lib/prompts';
import { validateMindfulnessRequest } from '@/lib/validators';
import { checkRateLimit, getRateLimitHeaders, getSessionId } from '@/lib/rate-limiter';
import type { MindfulnessExercise, APIErrorResponse, MindfulnessResponse } from '@/types';

/**
 * Handles POST requests for mindfulness exercise suggestions.
 * Validates input, checks rate limits, calls NVIDIA Nemotron for tailored exercises.
 *
 * @param request - Request object containing the request body
 * @returns JSON response with exercises or error message
 */
export async function POST(
  request: Request
): Promise<NextResponse<MindfulnessResponse | APIErrorResponse>> {
  try {
    // 1. Rate limiting
    const sessionId = getSessionId(request);
    const rateLimit = checkRateLimit(sessionId);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait a moment.',
          retryAfter: rateLimit.resetIn,
        },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    // 2. Parse and validate request body
    const body: unknown = await request.json();
    const { mood, triggers, examType } = validateMindfulnessRequest(body);

    // 3. Build prompt and call NVIDIA Nemotron
    const { client, modelName } = getModel();
    const prompt = buildMindfulnessPrompt(examType, mood, triggers);

    const response = await client.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Suggest quick mindfulness exercises based on my current state.' }
      ],
      temperature: 0.6,
      max_tokens: 1024,
      stream: false,
    });

    const responseText = response.choices[0]?.message?.content || '';

    // 4. Parse response
    const exercises = parseMindfulnessResponse(responseText);

    return NextResponse.json(
      { exercises },
      { headers: getRateLimitHeaders(rateLimit) }
    );
  } catch (error) {
    console.error('Mindfulness API Error:', error);
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    if (message.includes('must be') || message.includes('must have')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to get mindfulness suggestions. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Parses NVIDIA response into structured MindfulnessExercise array.
 * Handles markdown code blocks and malformed JSON gracefully.
 *
 * @param text - Raw response text from NVIDIA model
 * @returns Array of parsed MindfulnessExercise objects
 */
function parseMindfulnessResponse(text: string): MindfulnessExercise[] {
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
    const parsed = JSON.parse(cleaned) as unknown[];

    return parsed.map((item: unknown) => {
      const exercise = item as Record<string, unknown>;
      return {
        title:
          typeof exercise.title === 'string'
            ? exercise.title
            : 'Mindfulness Exercise',
        description:
          typeof exercise.description === 'string'
            ? exercise.description
            : '',
        duration:
          typeof exercise.duration === 'string'
            ? exercise.duration
            : '5 minutes',
        type: validateExerciseType(exercise.type),
        steps: Array.isArray(exercise.steps) ? exercise.steps.map(String) : [],
      };
    });
  } catch {
    // Return default exercises if parsing fails
    return getDefaultExercises();
  }
}

/**
 * Validates the exercise type string.
 * @param type - Raw type value from AI response
 * @returns Valid ExerciseType
 */
function validateExerciseType(
  type: unknown
): 'breathing' | 'meditation' | 'physical' {
  if (type === 'breathing' || type === 'meditation' || type === 'physical') {
    return type;
  }
  return 'breathing';
}

/**
 * Returns default exercises when AI parsing fails.
 * @returns Array of fallback MindfulnessExercise objects
 */
function getDefaultExercises(): MindfulnessExercise[] {
  return [
    {
      title: '4-7-8 Breathing',
      description: 'A calming breathing technique to reduce anxiety',
      duration: '3 minutes',
      type: 'breathing',
      steps: [
        'Sit comfortably and close your eyes',
        'Breathe in quietly through your nose for 4 seconds',
        'Hold your breath for 7 seconds',
        'Exhale completely through your mouth for 8 seconds',
        'Repeat 3-4 times',
      ],
    },
    {
      title: 'Desk Stretch Break',
      description: 'Quick stretches you can do at your study desk',
      duration: '5 minutes',
      type: 'physical',
      steps: [
        'Roll your neck slowly in circles (30 seconds each direction)',
        'Stretch your arms overhead and hold for 15 seconds',
        'Roll your shoulders backward 10 times',
        'Stand up and touch your toes (hold 15 seconds)',
        'Shake out your hands and fingers',
      ],
    },
    {
      title: 'Gratitude Moment',
      description: 'A quick mindfulness exercise to shift perspective',
      duration: '2 minutes',
      type: 'meditation',
      steps: [
        'Close your eyes and take 3 deep breaths',
        'Think of one thing about your preparation that went well today',
        'Think of one person who supports your journey',
        'Smile and take one more deep breath',
        'Open your eyes with renewed focus',
      ],
    },
  ];
}
