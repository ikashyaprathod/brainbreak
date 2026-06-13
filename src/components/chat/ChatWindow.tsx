/**
 * Chat window component with message list and streaming support.
 * @module components/chat/ChatWindow
 */

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { MessageCircle, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import type { ChatMessage, UserProfile } from '@/types';

/** Quick reply suggestions */
const QUICK_REPLIES = [
  "I'm feeling stressed about my studies",
  "Help me focus better",
  "I need a study break",
  "I'm worried about my mock test scores",
  "How do I deal with peer pressure?",
] as const;

/**
 * Full chat window with message list, streaming AI responses,
 * quick reply chips, and clear history option.
 */
export function ChatWindow() {
  const { messages, addMessage, clearHistory } = useChatHistory();
  const [profile] = useLocalStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const examType = profile?.examType ?? 'JEE';

  /** Auto-scroll to bottom when messages change */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  /** Sends a message and streams AI response */
  const handleSend = useCallback(async (content: string) => {
    // Add user message
    const userMessage = addMessage('user', content);
    setIsLoading(true);
    setStreamingContent('');

    try {
      // Build messages array for the API
      const allMessages: ChatMessage[] = [
        ...messages,
        userMessage,
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages,
          examType,
          currentMood: 5, // Default; could be pulled from latest mood entry
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Stream the response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        fullContent += text;
        setStreamingContent(fullContent);
      }

      // Add the complete AI message
      addMessage('assistant', fullContent);
      setStreamingContent('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      addMessage('assistant', `Sorry, I ran into an issue: ${errorMessage}. Please try again! 🙏`);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  }, [messages, addMessage, examType]);

  /** Handles quick reply click */
  const handleQuickReply = useCallback((reply: string) => {
    handleSend(reply);
  }, [handleSend]);

  const showWelcome = messages.length === 0 && !isLoading;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">BrainBreak AI</h2>
            <p className="text-xs text-muted-foreground">
              {isLoading ? 'Typing...' : 'Your study companion'}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
            aria-label="Clear chat history"
          >
            <Trash2 className="h-3 w-3" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {showWelcome && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold">Hey there! 👋</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              I&apos;m BrainBreak, your AI study companion. I&apos;m here to listen,
              support, and help you navigate your {examType} preparation journey.
              What&apos;s on your mind?
            </p>

            {/* Quick replies */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs border',
                    'bg-muted/50 hover:bg-primary/10 hover:border-primary/30',
                    'transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                  )}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Streaming indicator */}
        {streamingContent && (
          <MessageBubble
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingContent,
              timestamp: Date.now(),
            }}
          />
        )}

        {/* Loading dots */}
        {isLoading && !streamingContent && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
