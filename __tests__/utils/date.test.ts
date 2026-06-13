import { formatDate, getRelativeTime, isToday, getDateKey, getTimeGreeting } from '@/utils/date';

describe('date utility tests', () => {
  test('formatDate translates YYYY-MM-DD to Indian format style', () => {
    expect(formatDate('2026-06-13')).toMatch(/13.*Jun.*2026/);
  });

  test('getRelativeTime checks relative differences', () => {
    const now = new Date().toISOString();
    expect(getRelativeTime(now)).toBe('Just now');

    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(getRelativeTime(tenMinsAgo)).toBe('10 min ago');

    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
    expect(getRelativeTime(fiveHoursAgo)).toBe('5h ago');
  });

  test('isToday returns true/false correctly', () => {
    const todayKey = getDateKey();
    expect(isToday(todayKey)).toBe(true);
    expect(isToday('2026-01-01')).toBe(false);
  });

  test('getDateKey formats Date objects correctly', () => {
    const d = new Date('2026-06-13T10:00:00');
    expect(getDateKey(d)).toBe('2026-06-13');
  });

  test('getTimeGreeting matches the hours of day', () => {
    const greeting = getTimeGreeting();
    expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(greeting);
  });
});
