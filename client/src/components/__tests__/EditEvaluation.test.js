/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-render-in-setup */
// FILE: EditEvaluation.test.js

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import EditEvaluation from '../EditEvaluation';
import API from '../../api'; // Adjust the import path as necessary

jest.mock('../../api'); // Mock the API module

describe('EditEvaluation', () => {
  const mockEvaluations = [
    {
      memberId: { firstname: 'John', lastname: 'Doe' },
      ratings: { Cooperation: 3, 'Conceptual Contribution': 4 },
      comments: { Cooperation: 'Good', 'Conceptual Contribution': 'Average' },
    },
    {
      memberId: { firstname: 'Jane', lastname: 'Smith' },
      ratings: { Cooperation: 5, 'Conceptual Contribution': 2 },
      comments: { Cooperation: 'Excellent', 'Conceptual Contribution': 'Poor' },
    },
  ];

  beforeEach(async () => {
    API.get.mockResolvedValue({ data: mockEvaluations });
    API.put = jest.fn(); // Ensure API.put exists and is mockable

    await act(async () => {
      render(<EditEvaluation />);
    });
    await waitFor(() =>
      expect(API.get).toHaveBeenCalledWith('/peer-assessment/my-assessments'),
    );
  });

  test('fetches and displays evaluations', async () => {
    mockEvaluations.forEach((evaluation) => {
      expect(
        screen.getByText(
          `Evaluating: ${evaluation.memberId.firstname} ${evaluation.memberId.lastname}`,
        ),
      ).toBeInTheDocument();
    });
  });

  test('allows editing an evaluation', async () => {
    fireEvent.click(screen.getAllByText('Edit')[0]); // Assuming there is an "Edit" button for each evaluation

    const cooperationInput = screen.getByLabelText('Cooperation:');
    fireEvent.change(cooperationInput, { target: { value: '4' } });

    expect(cooperationInput.value).toBe('4');
  });

  test('saves an edited evaluation', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(screen.getAllByText('Edit')[0]); // Assuming there is an "Edit" button for each evaluation

    const cooperationInput = screen.getByLabelText('Cooperation:');
    fireEvent.change(cooperationInput, { target: { value: '4' } });

    fireEvent.click(screen.getByText('Save')); // Assuming there is a "Save" button

    await waitFor(() =>
      expect(API.put).toHaveBeenCalledWith(
        '/peer-assessment/update',
        expect.any(Object),
      ),
    );
    expect(alertMock).toHaveBeenCalledWith('Evaluation updated successfully');

    // Clean up the mock
    alertMock.mockRestore();
  });
});
