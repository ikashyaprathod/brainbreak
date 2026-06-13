import { getMoodEmoji, getMoodLabel, getMoodColor, getMoodBgColor, calculateAverageMood, getMoodChartColor } from '@/utils/mood';

describe('mood utility tests', () => {
  test('getMoodEmoji maps score to emoji correctly', () => {
    expect(getMoodEmoji(1)).toBe('😫');
    expect(getMoodEmoji(5)).toBe('😐');
    expect(getMoodEmoji(10)).toBe('🤩');
    expect(getMoodEmoji(0)).toBe('😐'); // fallback
  });

  test('getMoodLabel maps score to label correctly', () => {
    expect(getMoodLabel(2)).toBe('Very Low');
    expect(getMoodLabel(5)).toBe('Okay');
    expect(getMoodLabel(9)).toBe('Excellent');
  });

  test('getMoodColor maps score to classes correctly', () => {
    expect(getMoodColor(1)).toContain('text-red-500');
    expect(getMoodColor(5)).toContain('text-yellow-500');
    expect(getMoodColor(10)).toContain('text-green-500');
  });

  test('getMoodBgColor returns appropriate color variants', () => {
    expect(getMoodBgColor(2)).toBe('bg-red-500/20');
    expect(getMoodBgColor(5)).toBe('bg-yellow-500/20');
    expect(getMoodBgColor(9)).toBe('bg-green-500/20');
  });

  test('calculateAverageMood averages score values', () => {
    expect(calculateAverageMood([])).toBe(0);
    expect(calculateAverageMood([{ mood: 8 }, { mood: 5 }])).toBe(6.5);
    expect(calculateAverageMood([{ mood: 10 }, { mood: 10 }, { mood: 9 }])).toBe(9.7);
  });

  test('getMoodChartColor returns correct color hexes', () => {
    expect(getMoodChartColor(2)).toBe('#EF4444');
    expect(getMoodChartColor(6)).toBe('#EAB308');
    expect(getMoodChartColor(10)).toBe('#22C55E');
  });
});
