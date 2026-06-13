/**
 * API route for AI companion chat with streaming responses.
 * Uses NVIDIA Nemotron model for real-time chat UX.
 *
 * POST /api/chat
 * @module app/api/chat
 */

import { getModel } from '@/lib/gemini';
import { buildChatPrompt } from '@/lib/prompts';
import { sanitizeForAI } from '@/lib/sanitize';
import { validateChatRequest } from '@/lib/validators';
import { checkRateLimit, getRateLimitHeaders, getSessionId } from '@/lib/rate-limiter';

/**
 * Handles POST requests for streaming AI companion chat.
 * Validates input, builds conversation context, then streams
 * NVIDIA Nemotron's response back to the client in real-time.
 *
 * @param request - Request object containing the request body
 * @returns Streaming Response or an error JSON Response
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

    // Get the latest user message and sanitize it
    const latestMessage = messages[messages.length - 1];
    const sanitizedMessage = sanitizeForAI(latestMessage.content);

    if (sanitizedMessage.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert chat messages to OpenAI format and append the latest sanitized message
    const formattedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.slice(0, -1).map((msg) => ({
        role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: msg.content,
      })),
      { role: 'user' as const, content: sanitizedMessage }
    ];

    // 4. Initialize NVIDIA model and start chat completion stream
    const { client, modelName } = getModel();

    const responseStream = await client.chat.completions.create({
      model: modelName,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    // 5. Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of responseStream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          console.error('Streaming API Error:', error);
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
    console.error('Chat API Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';

    if (message.includes('must be') || message.includes('must have')) {
      return new Response(
        JSON.stringify({ error: message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Failed to get a response. Please try again. Details: ${message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
