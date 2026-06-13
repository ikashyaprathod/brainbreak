/**
 * Loading spinner component with optional message.
 * @module components/shared/LoadingSpinner
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Props for the LoadingSpinner component */
interface LoadingSpinnerProps {
  /** Optional loading message to display */
  readonly message?: string;
  /** Size variant */
  readonly size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  readonly className?: string;
}

/** Size configurations for the spinner */
const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
} as const;

/**
 * An animated loading spinner with optional descriptive message.
 * Uses Lucide's Loader2 icon with CSS animation.
 */
export function LoadingSpinner({ message, size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-label={message ?? 'Loading'}
    >
      <Loader2
        className={cn('animate-spin text-primary', SIZES[size])}
        aria-hidden="true"
      />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
}
