/**
 * Mindfulness exercise card with expandable guided steps.
 * Memoized for list performance.
 * @module components/mindfulness/ExerciseCard
 */

'use client';

import { memo, useState } from 'react';
import { Wind, Brain, Dumbbell, ChevronUp, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MindfulnessExercise } from '@/types';

/** Props for the ExerciseCard component */
interface ExerciseCardProps {
  readonly exercise: MindfulnessExercise;
}

/** Icon mapping for exercise types */
const TYPE_ICONS = {
  breathing: Wind,
  meditation: Brain,
  physical: Dumbbell,
} as const;

/** Color mapping for exercise types */
const TYPE_COLORS = {
  breathing: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  meditation: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  physical: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
} as const;

/**
 * Displays a single mindfulness exercise with expandable steps.
 * Features type-specific icons and color coding.
 */
export const ExerciseCard = memo(function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const Icon = TYPE_ICONS[exercise.type];
  const colorClass = TYPE_COLORS[exercise.type];

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-300',
        'hover:shadow-md',
        isExpanded ? 'bg-card shadow-sm' : 'bg-card/50'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn('p-2 rounded-lg border', colorClass)}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {exercise.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {exercise.description}
            </p>
            <span className="inline-block mt-1 text-xs text-muted-foreground/80">
              ⏱ {exercise.duration}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse exercise steps' : 'Expand exercise steps'}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-lg',
            'hover:bg-muted transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          )}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4 text-primary" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Expandable steps */}
      {isExpanded && exercise.steps.length > 0 && (
        <div className="mt-4 ml-12 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs font-medium text-foreground mb-2">Steps:</p>
          <ol className="space-y-1.5" aria-label="Exercise steps">
            {exercise.steps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
});
