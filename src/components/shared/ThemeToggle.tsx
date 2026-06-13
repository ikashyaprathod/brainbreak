/**
 * Theme toggle component for dark/light mode switching.
 * Uses next-themes for seamless theme management.
 * @module components/shared/ThemeToggle
 */

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A toggle button that switches between dark and light themes.
 * Renders a sun icon in dark mode and moon icon in light mode.
 * Includes smooth transition animation.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" aria-hidden="true" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative h-9 w-9 rounded-lg border border-border',
        'flex items-center justify-center',
        'bg-background hover:bg-muted',
        'transition-all duration-300 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Sun
        className={cn(
          'h-4 w-4 transition-all duration-300',
          isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          'absolute h-4 w-4 transition-all duration-300',
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        )}
        aria-hidden="true"
      />
    </button>
  );
}
