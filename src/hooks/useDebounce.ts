/**
 * Debounce hook for delaying value updates.
 * Used for journal auto-save to prevent excessive writes.
 * @module hooks/useDebounce
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Debounces a value by the specified delay.
 * The returned value only updates after the specified delay
 * has passed since the last change.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [text, setText] = useState('');
 * const debouncedText = useDebounce(text, 500);
 *
 * useEffect(() => {
 *   // This runs 500ms after the last keystroke
 *   autoSave(debouncedText);
 * }, [debouncedText]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
