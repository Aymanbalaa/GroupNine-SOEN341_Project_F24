/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/prefer-presence-queries */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/prefer-find-by */
// src/components/__tests__/Dashboard.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';
import API from '../../api';

// Mock the API
jest.mock('../../api');

describe('Dashboard Component', () => {
  const mockSetRoute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserStudent = { _id: 'student123', role: 'student', firstname: 'John', lastname: 'Doe' };

  const mockTeamData = {
    name: 'Team Alpha',
    members: [
      { _id: 'member1', firstname: 'Alice', lastname: 'Anderson' },
      { _id: 'member2', firstname: 'Bob', lastname: 'Brown' },
    ],
  };

  const renderDashboard = async (user) => {
    API.get.mockImplementation((url) => {
      switch (url) {
        case '/auth/me':
          return Promise.resolve({ data: user });
        case '/team/myteam':
          return Promise.resolve({ data: mockTeamData });
        default:
          return Promise.resolve({ data: [] });
      }
    });

    await act(async () => {
      render(<Dashboard setRoute={mockSetRoute} />);
    });
  };

  test('renders loading state initially', async () => {
    render(<Dashboard setRoute={mockSetRoute} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders student dashboard with team details and actions', async () => {
    await renderDashboard(mockUserStudent);

    // Check if the dashboard renders without relying on exact text
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/student/i)).toBeInTheDocument();

    // Verify team details appear without relying on exact member names
    expect(screen.getByText(/team/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view peer assessments/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /make evaluation/i })).toBeInTheDocument();
  });

  test('student can toggle between views - assessments, evaluation, feedback, and edit evaluation', async () => {
    await renderDashboard(mockUserStudent);
  
    // Helper function to click the first "Back" button that is a button element
    const clickBackButton = async () => {
      const backButtons = screen.getAllByRole('button', { name: /back/i });
      fireEvent.click(backButtons[0]); // Click the first button element with "Back"
    };
  
    // Toggle assessments view
    fireEvent.click(screen.getByRole('button', { name: /view peer assessments/i }));
    await waitFor(() => expect(screen.getAllByRole('button', { name: /back/i }).length).toBeGreaterThan(0));
    await clickBackButton();
  
    // Toggle evaluation view
    fireEvent.click(screen.getByRole('button', { name: /make evaluation/i }));
    await waitFor(() => expect(screen.getAllByRole('button', { name: /back/i }).length).toBeGreaterThan(0));
    await clickBackButton();
  
    // Toggle feedback view
    fireEvent.click(screen.getByRole('button', { name: /view received feedback/i }));
    await waitFor(() => expect(screen.getAllByRole('button', { name: /back/i }).length).toBeGreaterThan(0));
    await clickBackButton();
  
    // Toggle edit evaluation view
    fireEvent.click(screen.getByRole('button', { name: /edit evaluation/i }));
    await waitFor(() => expect(screen.getAllByRole('button', { name: /back/i }).length).toBeGreaterThan(0));
  });
  
  
});
