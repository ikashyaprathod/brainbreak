/**
 * Type-safe localStorage CRUD utilities.
 * Handles JSON serialization, error recovery, and array operations.
 * @module utils/storage
 */

/**
 * Retrieves and parses a JSON value from localStorage.
 * Returns null if the key doesn't exist or JSON parsing fails.
 * @param key - The localStorage key to read
 * @returns The parsed value or null
 */
export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupted JSON — return null rather than crashing
    return null;
  }
}

/**
 * Serializes and stores a value in localStorage.
 * @param key - The localStorage key to write
 * @param value - The value to serialize and store
 */
export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch {
    // localStorage full or unavailable — fail silently
    console.warn(`[BrainBreak] Failed to write to localStorage key: ${key}`);
  }
}

/**
 * Removes a key from localStorage.
 * @param key - The localStorage key to remove
 */
export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

/**
 * Retrieves an array from localStorage, defaulting to empty array.
 * @param key - The localStorage key containing an array
 * @returns The parsed array or an empty array
 */
export function getAllEntries<T>(key: string): T[] {
  const data = getItem<T[]>(key);
  return Array.isArray(data) ? data : [];
}

/**
 * Appends an item to an array stored in localStorage.
 * Creates the array if it doesn't exist.
 * @param key - The localStorage key containing the array
 * @param item - The item to append
 */
export function appendToArray<T>(key: string, item: T): void {
  const existing = getAllEntries<T>(key);
  existing.push(item);
  setItem(key, existing);
}

/**
 * Updates an item in an array stored in localStorage by its ID.
 * @param key - The localStorage key containing the array
 * @param id - The ID of the item to update
 * @param updater - Function that returns the updated item
 */
export function updateInArray<T extends { id: string }>(
  key: string,
  id: string,
  updater: (item: T) => T
): void {
  const existing = getAllEntries<T>(key);
  const updated = existing.map((item) => (item.id === id ? updater(item) : item));
  setItem(key, updated);
}

/**
 * Removes an item from an array stored in localStorage by its ID.
 * @param key - The localStorage key containing the array
 * @param id - The ID of the item to remove
 */
export function removeFromArray<T extends { id: string }>(
  key: string,
  id: string
): void {
  const existing = getAllEntries<T>(key);
  const filtered = existing.filter((item) => item.id !== id);
  setItem(key, filtered);
}

/**
 * Exports all BrainBreak data from localStorage as a JSON string.
 * @param keys - Array of localStorage keys to export
 * @returns JSON string of all data
 */
export function exportAllData(keys: readonly string[]): string {
  const data: Record<string, unknown> = {};
  for (const key of keys) {
    data[key] = getItem(key);
  }
  return JSON.stringify(data, null, 2);
}
