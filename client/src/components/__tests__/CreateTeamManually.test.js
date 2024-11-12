import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTeamManually from '../CreateTeamManually';
import API from '../../api';

// Mock global alert function
global.alert = jest.fn();

// Mock the API
jest.mock('../../api.js');

describe('CreateTeamManually Component', () => {
  const mockSetRoute = jest.fn();

  beforeEach(() => {
    global.alert.mockClear();
    API.get.mockClear();
    API.post.mockClear();
  });

  test('renders Create Team Manually form with students', async () => {
    // Mock API responses for students and teams
    API.get.mockResolvedValueOnce({
      data: [
        { _id: '1', firstname: 'John', lastname: 'Doe' },
        { _id: '2', firstname: 'Jane', lastname: 'Smith' },
      ],
    });
    API.get.mockResolvedValueOnce({
      data: [{ _id: 'team1', members: [{ _id: '2' }] }], // Jane Smith is already in a team
    });

    render(<CreateTeamManually setRoute={mockSetRoute} />);

    // Check that form fields render correctly
    expect(screen.getByPlaceholderText(/team name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create team/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();

    // Wait for students to load and check the content
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText(/jane smith \(already in a team\)/i)).toBeInTheDocument();
    });
  });

  test('shows warning if team name is empty', async () => {
    render(<CreateTeamManually setRoute={mockSetRoute} />);

    // Try submitting with an empty team name
    fireEvent.click(screen.getByRole('button', { name: /create team/i }));

    // Check that a warning is shown (handled by HTML5 required attribute)
    expect(screen.getByPlaceholderText(/team name/i)).toHaveAttribute('required');
  });

  test('creates team successfully when valid data is provided', async () => {
    // Mock API responses for students and team creation
    API.get.mockResolvedValueOnce({
      data: [
        { _id: '1', firstname: 'John', lastname: 'Doe', inTeam: false },
        { _id: '2', firstname: 'Jane', lastname: 'Smith', inTeam: true },
      ],
    });
    API.post.mockResolvedValueOnce({});

    render(<CreateTeamManually setRoute={mockSetRoute} />);

    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    // Fill out the form and submit
    fireEvent.change(screen.getByPlaceholderText(/team name/i), {
      target: { value: 'Team Alpha' },
    });
    fireEvent.click(screen.getByLabelText(/john doe/i)); // Select John Doe
    fireEvent.click(screen.getByRole('button', { name: /create team/i }));

    // Confirm success message and route change
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Team created successfully');
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(mockSetRoute).toHaveBeenCalledWith('instructor-dashboard');
    });
  });

  test('shows an alert if team creation fails', async () => {
    // Mock API responses
    API.get.mockResolvedValueOnce({
      data: [
        { _id: '1', firstname: 'John', lastname: 'Doe', inTeam: false },
      ],
    });
    API.post.mockRejectedValueOnce(new Error('Failed to create team'));

    render(<CreateTeamManually setRoute={mockSetRoute} />);

    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    // Fill out the form and submit
    fireEvent.change(screen.getByPlaceholderText(/team name/i), {
      target: { value: 'Team Beta' },
    });
    fireEvent.click(screen.getByLabelText(/john doe/i)); // Select John Doe
    fireEvent.click(screen.getByRole('button', { name: /create team/i }));

    // Confirm alert for failure
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to create team');
    });
  });
});
