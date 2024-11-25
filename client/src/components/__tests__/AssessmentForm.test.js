// FILE: AssessmentForm.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AssessmentForm from '../AssessmentForm';

describe('AssessmentForm', () => {
  const mockAssessment = {
    ratings: {
      Cooperation: 3,
      'Conceptual Contribution': 4,
      'Practical Contribution': 2,
      'Work Ethic': 5,
    },
    comments: {
      Cooperation: 'Good teamwork',
      'Conceptual Contribution': 'Great ideas',
      'Practical Contribution': 'Needs improvement',
      'Work Ethic': 'Very dedicated',
    },
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(
      <AssessmentForm assessment={mockAssessment} onSubmit={mockOnSubmit} />,
    );
  });

  test('renders form with all dimensions', () => {
    const dimensions = [
      'Cooperation',
      'Conceptual Contribution',
      'Practical Contribution',
      'Work Ethic',
    ];
    dimensions.forEach((dimension) => {
      expect(screen.getByLabelText(dimension + ':')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(`Comments for ${dimension}`),
      ).toBeInTheDocument();
    });
  });

  test('allows changing ratings and comments', () => {
    fireEvent.change(screen.getByLabelText('Cooperation:'), {
      target: { value: '4' },
    });
    fireEvent.change(screen.getByPlaceholderText('Comments for Cooperation'), {
      target: { value: 'Excellent teamwork' },
    });

    expect(screen.getByLabelText('Cooperation:').value).toBe('4');
    expect(screen.getByPlaceholderText('Comments for Cooperation').value).toBe(
      'Excellent teamwork',
    );
  });

  test('calls onSubmit with correct data when submit button is clicked', () => {
    fireEvent.click(screen.getByText('Submit'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      ...mockAssessment,
      ratings: {
        Cooperation: 3,
        'Conceptual Contribution': 4,
        'Practical Contribution': 2,
        'Work Ethic': 5,
      },
      comments: {
        Cooperation: 'Good teamwork',
        'Conceptual Contribution': 'Great ideas',
        'Practical Contribution': 'Needs improvement',
        'Work Ethic': 'Very dedicated',
      },
    });
  });
});
