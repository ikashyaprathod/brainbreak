import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JournalCard } from '@/components/journal/JournalCard';
import type { JournalEntry } from '@/types';

describe('JournalCard Component', () => {
  const mockEntry: JournalEntry = {
    id: 'entry-1',
    date: '2026-06-13',
    createdAt: '2026-06-13T12:00:00Z',
    content: 'Today was a tough day. Mock tests scores were very low and I felt extremely stressed about the UPSC syllabus.',
    mood: 3,
    emoji: '😟',
    examType: 'UPSC',
    analysis: {
      triggers: ['mock tests', 'syllabus coverage'],
      patterns: ['academic pressure'],
      summary: 'You are feeling stressed due to academic pressure.',
      suggestions: ['Take a 15 min break', 'Revise weak topics']
    }
  };

  test('renders basic metadata and excerpt', () => {
    render(<JournalCard entry={mockEntry} />);

    expect(screen.getByText('😟')).toBeInTheDocument();
    // Excerpt should show up
    expect(screen.getByText(/Today was a tough day/i)).toBeInTheDocument();
    expect(screen.getByText(/UPSC/i)).toBeInTheDocument();
  });

  test('clicking show more expands the card and displays AI analysis', () => {
    render(<JournalCard entry={mockEntry} />);

    // Click show more
    const btn = screen.getByRole('button', { name: /Show more/i });
    fireEvent.click(btn);

    // AI Analysis section should now render
    expect(screen.getByText('AI Analysis')).toBeInTheDocument();
    expect(screen.getByText('You are feeling stressed due to academic pressure.')).toBeInTheDocument();
    expect(screen.getByText('mock tests')).toBeInTheDocument();
    expect(screen.getByText('Take a 15 min break')).toBeInTheDocument();
  });
});
