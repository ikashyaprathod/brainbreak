/**
 * AI Companion Chat page.
 * @module app/chat/page
 */

import { ChatWindow } from '@/components/chat/ChatWindow';

/**
 * Full-screen AI companion chat page.
 */
export default function ChatPage() {
  return (
    <div className="animate-fade-in -my-6 -mx-4 md:mx-0 md:my-0">
      <ChatWindow />
    </div>
  );
}
