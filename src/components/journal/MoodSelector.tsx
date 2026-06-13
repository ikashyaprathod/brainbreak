/**
 * Mood selector component with emoji buttons and fine-tune slider.
 * Pure UI component — all logic is handled by the parent.
 * @module components/journal/MoodSelector
 */

'use client';

import { cn } from '@/lib/utils';
import { MOOD_EMOJIS } from '@/utils/constants';
import { getMoodLabel, getMoodColor } from '@/utils/mood';

/** Props for the MoodSelector component */
interface MoodSelectorProps {
  /** Current mood value (1-10) */
  readonly value: number;
  /** Callback when mood changes */
  readonly onChange: (mood: number) => void;
}

/**
 * Interactive mood selector with emoji buttons and a range slider.
 * Five emoji buttons map to mood ranges (1-2, 3-4, 5-6, 7-8, 9-10).
 * Slider provides fine-grained 1-10 control.
 */
export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-4" role="group" aria-label="Select your mood">
      {/* Emoji Buttons */}
      <div
        className="flex items-center justify-center gap-3"
        role="radiogroup"
        aria-label="Mood level"
      >
        {MOOD_EMOJIS.map((mood) => {
          const midScore = Math.floor((mood.minScore + mood.maxScore) / 2);
          const isActive = value >= mood.minScore && value <= mood.maxScore;

          return (
            <button
              key={mood.label}
              onClick={() => onChange(midScore)}
              role="radio"
              aria-checked={isActive}
              aria-label={`${mood.label} mood (${mood.minScore}-${mood.maxScore})`}
              className={cn(
                'text-3xl md:text-4xl p-2 md:p-3 rounded-xl transition-all duration-300',
                'hover:scale-110 active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isActive
                  ? 'scale-125 bg-primary/10 shadow-lg ring-2 ring-primary/30'
                  : 'opacity-50 hover:opacity-80 bg-transparent'
              )}
            >
              <span aria-hidden="true">{mood.emoji}</span>
            </button>
          );
        })}
      </div>

      {/* Fine-tune Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Fine-tune</span>
          <span className={cn('text-sm font-semibold', getMoodColor(value))}>
            {getMoodLabel(value)} ({value}/10)
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            'w-full h-2 rounded-lg appearance-none cursor-pointer',
            'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500',
            'accent-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          )}
          aria-label={`Mood score: ${value} out of 10`}
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={value}
          aria-valuetext={`${getMoodLabel(value)}, ${value} out of 10`}
        />
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
