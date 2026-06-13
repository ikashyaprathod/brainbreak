/**
 * Exam selector component for onboarding and settings.
 * Displays a grid of supported competitive exams.
 * @module components/shared/ExamSelector
 */

'use client';

import { EXAM_LIST } from '@/utils/constants';
import { cn } from '@/lib/utils';
import type { ExamType } from '@/types';

/** Props for the ExamSelector component */
interface ExamSelectorProps {
  /** Currently selected exam type */
  readonly selected: ExamType | null;
  /** Callback when an exam is selected */
  readonly onSelect: (exam: ExamType) => void;
}

/**
 * A grid of exam cards for selecting the competitive exam type.
 * Used in onboarding flow and settings page.
 */
export function ExamSelector({ selected, onSelect }: ExamSelectorProps) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 gap-3"
      role="radiogroup"
      aria-label="Select your exam"
    >
      {EXAM_LIST.map((exam) => {
        const isSelected = selected === exam.id;
        return (
          <button
            key={exam.id}
            onClick={() => onSelect(exam.id)}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${exam.label} - ${exam.fullName}`}
            className={cn(
              'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
              'hover:scale-[1.02] active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              isSelected
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border-border bg-card hover:border-primary/50 hover:bg-muted'
            )}
          >
            <span className="text-3xl" aria-hidden="true">
              {exam.icon}
            </span>
            <span className="font-semibold text-sm text-foreground">
              {exam.label}
            </span>
            <span className="text-xs text-muted-foreground text-center leading-tight">
              {exam.description}
            </span>
            {isSelected && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <svg
                  className="h-3 w-3 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
