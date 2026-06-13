/**
 * API route for AI companion chat with streaming responses.
 * Uses Gemini's generateContentStream for real-time chat UX.
 *
 * POST /api/chat
 * @module app/api/chat
 */

import { getGeminiModel } from '@/lib/gemini';
import { buildChatPrompt } from '@/lib/prompts';
import { sanitizeForAI } from '@/lib/sanitize';
import { validateChatRequest } from '@/lib/validators';
import { checkRateLimit, getRateLimitHeaders, getSessionId } from '@/lib/rate-limiter';
import { AI_CONFIG } from '@/utils/constants';

/**
 * Handles POST requests for streaming AI companion chat.
 * Validates input, builds conversation context, then streams
 * Gemini's response back to the client in real-time.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // 1. Rate limiting
    const sessionId = getSessionId(request);
    const rateLimit = checkRateLimit(sessionId);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please wait a moment before sending another message.',
          retryAfter: rateLimit.resetIn,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...getRateLimitHeaders(rateLimit),
          },
        }
      );
    }

    // 2. Parse and validate request body
    const body: unknown = await request.json();
    const { messages, examType, currentMood } = validateChatRequest(body);

    // 3. Build system prompt and conversation history
    const systemPrompt = buildChatPrompt(examType, currentMood);

    // Convert chat messages to Gemini format
    // Gemini uses 'user' and 'model' roles
    const chatHistory = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: msg.content }],
    }));

    // Get the latest user message and sanitize it
    const latestMessage = messages[messages.length - 1];
    const sanitizedMessage = sanitizeForAI(latestMessage.content);

    if (sanitizedMessage.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Initialize Gemini model and start chat
    const model = getGeminiModel(AI_CONFIG.CHAT_TEMPERATURE, AI_CONFIG.CHAT_MAX_TOKENS);

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'System instructions: ' + systemPrompt }] },
        { role: 'model', parts: [{ text: 'I understand. I\'m BrainBreak, a supportive AI companion. I\'m here to help. How are you feeling today?' }] },
        ...chatHistory,
      ],
    });

    // 5. Stream the response
    const result = await chat.sendMessageStream(sanitizedMessage);

    // Create a ReadableStream to stream the response to the client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch {
          controller.enqueue(
            encoder.encode('\n\n[Sorry, I had trouble generating a response. Please try again.]')
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        ...getRateLimitHeaders(rateLimit),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';

    if (message.includes('must be') || message.includes('must have')) {
      return new Response(
        JSON.stringify({ error: message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to get a response. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
