import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodSelector } from '@/components/journal/MoodSelector';

describe('MoodSelector Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders all 5 emoji buttons', () => {
    render(<MoodSelector value={5} onChange={mockOnChange} />);
    
    const emojiButtons = screen.getAllByRole('radio');
    expect(emojiButtons.length).toBe(5);
  });

  test('clicking an emoji calls onChange with middle score of range', () => {
    render(<MoodSelector value={5} onChange={mockOnChange} />);
    
    // Select the first emoji button (Very Low: 1-2, mid is 1)
    const veryLowBtn = screen.getByLabelText(/Very Low mood/i);
    fireEvent.click(veryLowBtn);

    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  test('moving the range slider calls onChange with value', () => {
    render(<MoodSelector value={5} onChange={mockOnChange} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '8' } });

    expect(mockOnChange).toHaveBeenCalledWith(8);
  });
});
