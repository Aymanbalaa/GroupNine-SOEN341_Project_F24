/* eslint-disable testing-library/prefer-presence-queries */
/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
// src/components/__tests__/CreateTeamFromCsv.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTeamFromCsv from '../CreateTeamFromCsv';
import API from '../../api';

// Mock global alert function
global.alert = jest.fn();

// Mock the API
jest.mock('../../api');

describe('CreateTeamFromCsv Component', () => {
  const mockSetRoute = jest.fn();

  beforeEach(() => {
    global.alert.mockClear();
    API.get.mockClear();
    API.post.mockClear();
  });

  // test('renders Create Team from CSV form', () => {
  //   render(<CreateTeamFromCsv setRoute={mockSetRoute} instructorId="instructor123" />);
    
  //   expect(screen.getByPlaceholderText(/team name/i)).toBeInTheDocument();
  //   expect(screen.getByLabelText(/upload csv file/i)).toBeInTheDocument();
  //   expect(screen.getByRole('button', { name: /create team/i })).toBeInTheDocument();
  //   expect(screen.getByRole('button', { name: /back to instructor dashboard/i })).toBeInTheDocument();
  // });

  test('shows warning if team name is empty', async () => {
    render(<CreateTeamFromCsv setRoute={mockSetRoute} instructorId="instructor123" />);
    
    fireEvent.click(screen.getByRole('button', { name: /create team/i }));
    expect(screen.getByPlaceholderText(/team name/i)).toHaveAttribute('required');
  });

  // test('uploads CSV and fetches valid students', async () => {
  //   API.get.mockResolvedValueOnce({ data: { _id: '1', firstname: 'John', lastname: 'Doe' } });
  //   API.get.mockResolvedValueOnce({ data: { _id: '2', firstname: 'Jane', lastname: 'Smith' } });

  //   render(<CreateTeamFromCsv setRoute={mockSetRoute} instructorId="instructor123" />);

  //   const file = new File(['"First Name","Last Name","ID"\nJohn,Doe,1\nJane,Smith,2'], 'students.csv', { type: 'text/csv' });
  //   await act(async () => {
  //     fireEvent.change(screen.getByLabelText(/upload csv file/i), { target: { files: [file] } });
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  //     expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
  //   });
  // });

//   test('handles invalid CSV format', async () => {
//     render(<CreateTeamFromCsv setRoute={mockSetRoute} instructorId="instructor123" />);
    
//     // Simulate an invalid CSV file upload
//     const file = new File(['Invalid CSV Content'], 'invalid.csv', { type: 'text/csv' });
//     fireEvent.change(screen.getByLabelText(/upload csv file/i), { target: { files: [file] } });
  
//     // Use `waitFor` with a more flexible matcher
//     await waitFor(() => {
//       expect(screen.queryByText((content, element) => content.includes('Invalid CSV format'))).toBeInTheDocument();
//     });
//   });
  

  // test('creates team successfully with valid data', async () => {
  //   API.get.mockResolvedValueOnce({ data: { _id: '1', firstname: 'John', lastname: 'Doe' } });
  //   API.get.mockResolvedValueOnce({ data: { _id: '2', firstname: 'Jane', lastname: 'Smith' } });
  //   API.post.mockResolvedValueOnce({});

  //   render(<CreateTeamFromCsv setRoute={mockSetRoute} instructorId="instructor123" />);

  //   const file = new File(['"First Name","Last Name","ID"\nJohn,Doe,1\nJane,Smith,2'], 'students.csv', { type: 'text/csv' });
  //   await act(async () => {
  //     fireEvent.change(screen.getByLabelText(/upload csv file/i), { target: { files: [file] } });
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  //     expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
  //   });

  //   fireEvent.change(screen.getByPlaceholderText(/team name/i), { target: { value: 'Team Alpha' } });
  //   fireEvent.click(screen.getByLabelText(/john doe/i));
  //   fireEvent.click(screen.getByLabelText(/jane smith/i));
  //   fireEvent.click(screen.getByRole('button', { name: /create team/i }));

  //   await waitFor(() => {
  //     expect(global.alert).toHaveBeenCalledWith('Team created successfully');
  //     expect(mockSetRoute).toHaveBeenCalledWith('instructor-dashboard');
  //   });
  // });
});
