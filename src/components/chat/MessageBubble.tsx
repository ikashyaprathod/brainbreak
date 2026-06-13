/**
 * Chat message bubble component.
 * Memoized to prevent re-renders in message lists.
 * @module components/chat/MessageBubble
 */

'use client';

import { memo } from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';

/** Props for the MessageBubble component */
interface MessageBubbleProps {
  readonly message: ChatMessage;
}

/**
 * A single chat message bubble.
 * User messages appear right-aligned in primary color.
 * AI messages appear left-aligned in surface color.
 */
export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
      role="article"
      aria-label={`${isUser ? 'You' : 'BrainBreak'} said: ${message.content.slice(0, 50)}${message.content.length > 50 ? '...' : ''}`}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white'
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message content */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md'
        )}
      >
        {/* Render line breaks */}
        {message.content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < message.content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
});
