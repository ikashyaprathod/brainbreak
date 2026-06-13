import { calculateStreak } from '@/utils/streak';

describe('streak utility tests', () => {
  const getOffsetDateString = (offset: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return d.toISOString().split('T')[0];
  };

  test('empty array returns zero streak', () => {
    expect(calculateStreak([])).toEqual({ current: 0, best: 0, isActiveToday: false });
  });

  test('single entry today returns current 1, best 1, active today', () => {
    const today = getOffsetDateString(0);
    expect(calculateStreak([today])).toEqual({ current: 1, best: 1, isActiveToday: true });
  });

  test('single entry yesterday returns current 1, best 1, inactive today', () => {
    const yesterday = getOffsetDateString(1);
    expect(calculateStreak([yesterday])).toEqual({ current: 1, best: 1, isActiveToday: false });
  });

  test('single entry older than yesterday breaks current streak', () => {
    const twoDaysAgo = getOffsetDateString(2);
    expect(calculateStreak([twoDaysAgo])).toEqual({ current: 0, best: 1, isActiveToday: false });
  });

  test('consecutive dates calculated correctly', () => {
    const today = getOffsetDateString(0);
    const yesterday = getOffsetDateString(1);
    const twoDaysAgo = getOffsetDateString(2);

    expect(calculateStreak([today, yesterday, twoDaysAgo])).toEqual({
      current: 3,
      best: 3,
      isActiveToday: true,
    });
  });

  test('streak breaks are captured correctly while maintaining best streak', () => {
    const today = getOffsetDateString(0);
    const yesterday = getOffsetDateString(1);
    // Gap on 2 days ago
    const threeDaysAgo = getOffsetDateString(3);
    const fourDaysAgo = getOffsetDateString(4);
    const fiveDaysAgo = getOffsetDateString(5);

    // Three consecutive (3, 4, 5 days ago), gap (2 days ago), two consecutive (0, 1 days ago)
    const dates = [today, yesterday, threeDaysAgo, fourDaysAgo, fiveDaysAgo];
    expect(calculateStreak(dates)).toEqual({
      current: 2,
      best: 3,
      isActiveToday: true,
    });
  });
});
