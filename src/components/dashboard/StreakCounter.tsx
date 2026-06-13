/**
 * Streak counter display with celebration animation.
 * Memoized for performance.
 * @module components/dashboard/StreakCounter
 */

'use client';

import { memo } from 'react';
import { Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StreakData } from '@/types';

/** Props for the StreakCounter component */
interface StreakCounterProps {
  readonly streak: StreakData;
}

/** Milestone thresholds that trigger celebration */
const MILESTONES = [7, 14, 21, 30, 50, 100] as const;

/**
 * Displays current and best streaks with animated fire emoji.
 * Celebrates milestone achievements with pulse animation.
 */
export const StreakCounter = memo(function StreakCounter({ streak }: StreakCounterProps) {
  const isMilestone = MILESTONES.includes(streak.current as typeof MILESTONES[number]);

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border bg-card',
        isMilestone && 'ring-2 ring-orange-500/30 bg-orange-500/5'
      )}
      aria-label={`Current streak: ${streak.current} days. Best streak: ${streak.best} days`}
    >
      {/* Current Streak */}
      <div className="flex items-center gap-2">
        <Flame
          className={cn(
            'h-8 w-8',
            streak.current > 0
              ? 'text-orange-500 animate-pulse'
              : 'text-muted-foreground'
          )}
          aria-hidden="true"
        />
        <div>
          <p className="text-2xl font-bold text-foreground">
            {streak.current}
          </p>
          <p className="text-xs text-muted-foreground">day streak</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-10 w-px bg-border" aria-hidden="true" />

      {/* Best Streak */}
      <div className="flex items-center gap-2">
        <Trophy
          className="h-5 w-5 text-amber-500"
          aria-hidden="true"
        />
        <div>
          <p className="text-lg font-semibold text-foreground">
            {streak.best}
          </p>
          <p className="text-xs text-muted-foreground">best</p>
        </div>
      </div>

      {/* Milestone celebration */}
      {isMilestone && streak.current > 0 && (
        <span className="ml-auto text-sm font-medium text-orange-500 animate-bounce">
          🎉 Milestone!
        </span>
      )}
    </div>
  );
});
