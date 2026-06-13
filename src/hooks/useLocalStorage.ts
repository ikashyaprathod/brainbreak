/**
 * Generic localStorage React hook with SSR safety.
 * Foundation hook used by all domain-specific hooks.
 * @module hooks/useLocalStorage
 */

'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * A generic hook for reading and writing to localStorage.
 * Handles SSR (returns initialValue on server), JSON serialization,
 * and corrupted data gracefully.
 *
 * @param key - localStorage key
 * @param initialValue - Default value when key doesn't exist
 * @returns Tuple of [value, setValue, removeValue]
 *
 * @example
 * ```tsx
 * const [name, setName, removeName] = useLocalStorage('user_name', '');
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state with localStorage value or initial value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Sync with localStorage on mount (handles SSR hydration)
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // Corrupted data — keep initial value
    }
  }, [key]);

  /**
   * Updates both React state and localStorage.
   * Accepts a value or an updater function (like useState).
   */
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(newValue));
        } catch {
          // localStorage full — state still updates
        }
        return newValue;
      });
    },
    [key]
  );

  /**
   * Removes the key from localStorage and resets to initial value.
   */
  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore removal errors
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
