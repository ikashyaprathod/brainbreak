/**
 * Hook for managing AI companion chat history.
 * @module hooks/useChatHistory
 */

'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, AI_CONFIG } from '@/utils/constants';
import { generateId } from '@/lib/utils';
import type { ChatMessage, MessageRole } from '@/types';

/** Return type for the useChatHistory hook */
interface UseChatHistoryReturn {
  /** All stored chat messages */
  readonly messages: ChatMessage[];
  /** Add a new message to the chat */
  readonly addMessage: (role: MessageRole, content: string) => ChatMessage;
  /** Clear all chat history */
  readonly clearHistory: () => void;
}

/**
 * Custom hook for AI companion chat history.
 * Limits stored messages to MAX_STORED_MESSAGES to manage localStorage size.
 *
 * @returns UseChatHistoryReturn with messages and operations
 */
export function useChatHistory(): UseChatHistoryReturn {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>(
    STORAGE_KEYS.CHAT_HISTORY,
    []
  );

  /** Adds a message and trims history to max size */
  const addMessage = useCallback(
    (role: MessageRole, content: string): ChatMessage => {
      const message: ChatMessage = {
        id: generateId(),
        role,
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => {
        const updated = [...prev, message];
        // Trim to max stored messages
        if (updated.length > AI_CONFIG.MAX_STORED_MESSAGES) {
          return updated.slice(-AI_CONFIG.MAX_STORED_MESSAGES);
        }
        return updated;
      });
      return message;
    },
    [setMessages]
  );

  /** Clears all chat history */
  const clearHistory = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return { messages, addMessage, clearHistory };
}
