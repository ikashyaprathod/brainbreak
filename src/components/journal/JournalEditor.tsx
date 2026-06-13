/**
 * Journal entry editor with debounced auto-save.
 * Pure UI component — submit logic handled by parent.
 * @module components/journal/JournalEditor
 */

'use client';

import { useState, useEffect } from 'react';
import { Send, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, MAX_JOURNAL_LENGTH, DEBOUNCE_DELAY_MS } from '@/utils/constants';

/** Props for the JournalEditor component */
interface JournalEditorProps {
  /** Callback when the entry is submitted */
  readonly onSubmit: (content: string) => void;
  /** Whether the form is currently submitting */
  readonly isSubmitting: boolean;
  /** Exam type for contextual placeholder */
  readonly examType: string;
}

/**
 * A textarea editor for daily journal reflections.
 * Features debounced auto-save to localStorage drafts,
 * character count, and exam-contextual placeholder text.
 */
export function JournalEditor({ onSubmit, isSubmitting, examType }: JournalEditorProps) {
  const [draft, setDraft] = useLocalStorage<string>(STORAGE_KEYS.JOURNAL_DRAFT, '');
  const [content, setContent] = useState(draft);
  const debouncedContent = useDebounce(content, DEBOUNCE_DELAY_MS);

  // Auto-save draft
  useEffect(() => {
    if (debouncedContent !== draft) {
      setDraft(debouncedContent);
    }
  }, [debouncedContent, draft, setDraft]);

  /** Handles form submission */
  const handleSubmit = () => {
    const trimmed = content.trim();
    if (trimmed.length === 0 || isSubmitting) return;
    onSubmit(trimmed);
    setContent('');
    setDraft('');
  };

  /** Handles keyboard shortcut (Ctrl+Enter to submit) */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCount = content.length;
  const isOverLimit = charCount > MAX_JOURNAL_LENGTH;
  const isEmpty = content.trim().length === 0;

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`How was your day? How's your ${examType} prep going? Write freely — this is your safe space... ✨`}
          rows={6}
          maxLength={MAX_JOURNAL_LENGTH + 100}
          disabled={isSubmitting}
          aria-label="Write your journal entry"
          aria-describedby="journal-char-count"
          className={cn(
            'w-full rounded-xl border bg-background p-4 text-sm leading-relaxed resize-none',
            'placeholder:text-muted-foreground/60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isOverLimit ? 'border-destructive' : 'border-border'
          )}
        />
        {/* Auto-save indicator */}
        {content.length > 0 && content === debouncedContent && (
          <div className="absolute bottom-3 left-4 flex items-center gap-1 text-xs text-muted-foreground/60">
            <Save className="h-3 w-3" aria-hidden="true" />
            <span>Draft saved</span>
          </div>
        )}
      </div>

      {/* Footer: char count + submit button */}
      <div className="flex items-center justify-between">
        <span
          id="journal-char-count"
          className={cn(
            'text-xs',
            isOverLimit ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {charCount.toLocaleString()} / {MAX_JOURNAL_LENGTH.toLocaleString()} characters
        </span>

        <button
          onClick={handleSubmit}
          disabled={isEmpty || isOverLimit || isSubmitting}
          aria-label="Submit journal entry"
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 active:scale-[0.98]',
            'transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary'
          )}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? 'Analyzing...' : 'Submit & Analyze'}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        💡 Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs">Enter</kbd> to submit
      </p>
    </div>
  );
}
