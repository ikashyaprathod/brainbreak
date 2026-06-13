import React from 'react';
import { render, screen } from '@testing-library/react';
import { StreakCounter } from '@/components/dashboard/StreakCounter';

describe('StreakCounter Component', () => {
  test('renders streak values correctly', () => {
    render(<StreakCounter streak={{ current: 5, best: 8, isActiveToday: true }} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  test('celebrates milestone when current streak is one of the milestones', () => {
    render(<StreakCounter streak={{ current: 7, best: 10, isActiveToday: true }} />);

    expect(screen.getByText('🎉 Milestone!')).toBeInTheDocument();
  });

  test('does not celebrate when current streak is not a milestone', () => {
    render(<StreakCounter streak={{ current: 5, best: 10, isActiveToday: true }} />);

    expect(screen.queryByText('🎉 Milestone!')).toBeNull();
  });
});
