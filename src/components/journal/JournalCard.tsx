/**
 * Journal entry display card with expandable AI analysis.
 * Memoized to prevent unnecessary re-renders in lists.
 * @module components/journal/JournalCard
 */

'use client';

import { memo, useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, getRelativeTime } from '@/utils/date';
import { getMoodColor, getMoodLabel } from '@/utils/mood';
import type { JournalEntry } from '@/types';

/** Props for the JournalCard component */
interface JournalCardProps {
  readonly entry: JournalEntry;
}

/**
 * Displays a single journal entry with mood, excerpt, and AI analysis.
 * Expandable to show full content and analysis details.
 */
export const JournalCard = memo(function JournalCard({ entry }: JournalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const excerpt = entry.content.length > 120
    ? entry.content.slice(0, 120) + '...'
    : entry.content;

  return (
    <article
      className={cn(
        'rounded-xl border bg-card p-4 transition-all duration-300',
        'hover:shadow-md hover:border-primary/20'
      )}
    >
      {/* Header: Date + Mood */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{entry.emoji}</span>
          <div>
            <p className="text-sm font-medium text-foreground">
              {formatDate(entry.date)}
            </p>
            <p className="text-xs text-muted-foreground">
              {getRelativeTime(entry.createdAt)}
            </p>
          </div>
        </div>
        <span className={cn('text-sm font-semibold', getMoodColor(entry.mood))}>
          {getMoodLabel(entry.mood)} ({entry.mood}/10)
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {isExpanded ? entry.content : excerpt}
      </p>

      {/* AI Analysis (if available) */}
      {entry.analysis && isExpanded && (
        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>AI Analysis</span>
          </div>

          {/* Summary */}
          <p className="text-sm text-muted-foreground">{entry.analysis.summary}</p>

          {/* Triggers */}
          {entry.analysis.triggers.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <AlertTriangle className="h-3 w-3 text-orange-500" aria-hidden="true" />
                <span className="text-xs font-medium text-foreground">Stress Triggers</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {entry.analysis.triggers.map((trigger, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {entry.analysis.suggestions.length > 0 && (
            <div>
              <span className="text-xs font-medium text-foreground block mb-1.5">
                💡 Suggestions
              </span>
              <ul className="space-y-1">
                {entry.analysis.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Expand/Collapse button */}
      {(entry.content.length > 120 || entry.analysis) && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center gap-1 text-xs text-primary hover:text-primary/80 mt-2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded'
          )}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Show less' : 'Show more'}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" aria-hidden="true" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
              Show more{entry.analysis ? ' & AI analysis' : ''}
            </>
          )}
        </button>
      )}
    </article>
  );
});
