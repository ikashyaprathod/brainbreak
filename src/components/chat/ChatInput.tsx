/**
 * Chat input bar with send button.
 * @module components/chat/ChatInput
 */

'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Props for the ChatInput component */
interface ChatInputProps {
  /** Callback when a message is sent */
  readonly onSend: (message: string) => void;
  /** Whether the AI is currently responding */
  readonly isLoading: boolean;
}

/**
 * Chat input with send button.
 * Enter sends, Shift+Enter adds newline.
 */
export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  /** Handles sending the message */
  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed.length === 0 || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  /** Handles keyboard events */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-4 border-t bg-background/80 backdrop-blur-sm">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        disabled={isLoading}
        aria-label="Type your message"
        className={cn(
          'flex-1 rounded-xl border bg-muted/50 px-4 py-2.5 text-sm resize-none',
          'placeholder:text-muted-foreground/60',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'max-h-32 min-h-[40px]'
        )}
        style={{ height: 'auto' }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = Math.min(target.scrollHeight, 128) + 'px';
        }}
      />
      <button
        onClick={handleSend}
        disabled={input.trim().length === 0 || isLoading}
        aria-label="Send message"
        className={cn(
          'flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center',
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90 active:scale-95',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
