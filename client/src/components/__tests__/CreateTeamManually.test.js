/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTeamManually from '../CreateTeamManually';
import API from '../../api';

global.alert = jest.fn();
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
      data: [{ _id: 'team1', members: [{ _id: '2' }] }],
    });

    render(<CreateTeamManually setRoute={mockSetRoute} />);

    // Verify form elements
    expect(screen.getByPlaceholderText(/team name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create team/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();

    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/jane smith \(already in a team\)/i)).toBeInTheDocument();
    });
  });

  test('shows warning if team name is empty', () => {
    render(<CreateTeamManually setRoute={mockSetRoute} />);

    fireEvent.click(screen.getByRole('button', { name: /create team/i }));
    expect(screen.getByPlaceholderText(/team name/i)).toHaveAttribute('required');
  });

  // test('creates team successfully when valid data is provided', async () => {
  //   API.get.mockResolvedValueOnce({
  //     data: [
  //       { _id: '1', firstname: 'John', lastname: 'Doe', inTeam: false },
  //       { _id: '2', firstname: 'Jane', lastname: 'Smith', inTeam: true },
  //     ],
  //   });
  //   API.post.mockResolvedValueOnce({});

  //   render(<CreateTeamManually setRoute={mockSetRoute} />);

  //   await waitFor(() => {
  //     expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  //   });

  //   fireEvent.change(screen.getByPlaceholderText(/team name/i), {
  //     target: { value: 'Team Alpha' },
  //   });
  //   fireEvent.click(screen.getByLabelText(/john doe/i));
  //   fireEvent.click(screen.getByRole('button', { name: /create team/i }));

  //   await waitFor(() => {
  //     expect(global.alert).toHaveBeenCalledWith('Team created successfully');
  //     expect(mockSetRoute).toHaveBeenCalledWith('instructor-dashboard');
  //   });
  // });

  // test('shows an alert if team creation fails', async () => {
  //   API.get.mockResolvedValueOnce({
  //     data: [
  //       { _id: '1', firstname: 'John', lastname: 'Doe', inTeam: false },
  //     ],
  //   });
  //   API.post.mockRejectedValueOnce(new Error('Failed to create team'));

  //   render(<CreateTeamManually setRoute={mockSetRoute} />);

  //   await waitFor(() => {
  //     expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  //   });

  //   fireEvent.change(screen.getByPlaceholderText(/team name/i), {
  //     target: { value: 'Team Beta' },
  //   });
  //   fireEvent.click(screen.getByLabelText(/john doe/i));
  //   fireEvent.click(screen.getByRole('button', { name: /create team/i }));

  //   await waitFor(() => {
  //     expect(global.alert).toHaveBeenCalledWith('Failed to create team');
  //   });
  // });
});
