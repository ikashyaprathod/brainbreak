/**
 * Aggregated stress triggers display.
 * Shows identified triggers as color-coded badges.
 * @module components/dashboard/StressTriggers
 */

'use client';

import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Props for the StressTriggers component */
interface StressTriggersProps {
  readonly triggers: string[];
}

/**
 * Displays aggregated stress triggers from journal analyses.
 * Triggers are shown as badges, sorted by frequency (handled by hook).
 */
export function StressTriggers({ triggers }: StressTriggersProps) {
  if (triggers.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          No triggers identified yet. Keep journaling to uncover patterns! ✨
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-orange-500" aria-hidden="true" />
        <h3 className="text-sm font-medium">Identified Stress Triggers</h3>
      </div>
      <div className="flex flex-wrap gap-2" role="list" aria-label="Stress triggers">
        {triggers.slice(0, 10).map((trigger, index) => (
          <span
            key={trigger}
            role="listitem"
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              'transition-all duration-200 hover:scale-105',
              index === 0
                ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20'
                : index < 3
                ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                : 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20'
            )}
          >
            {trigger}
          </span>
        ))}
      </div>
    </div>
  );
}
