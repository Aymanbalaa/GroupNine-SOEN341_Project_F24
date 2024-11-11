// src/components/Login.test.js
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';
import API from '../../api';

jest.mock('../../api');

describe('Login Component', () => {
  const mockSetRoute = jest.fn();

  beforeEach(() => {
    API.post.mockClear();
    mockSetRoute.mockClear();
  });

  // TEST 1111111111111111111111111111111111111111111111111111111
  // MAKE SURE BUTTONS AND FORMS ARE THEREEEEEEEEEEEEEEEEEEEEEEEE
  test('renders login form', () => {
    render(<Login setRoute={mockSetRoute} />);

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  // TEST 222222222222222222222222222222222222222222222222222222
  // MAKE SURE IT REDIRECTS TO DASHBOARD ON SUCCESSFUL LOGIN
  test('redirects to dashboard on successful login', async () => {
    API.post.mockResolvedValueOnce({});

    render(<Login setRoute={mockSetRoute} />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { name: 'username', value: 'correctUser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: 'password', value: 'correctPass' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockSetRoute).toHaveBeenCalledWith('dashboard'));
  });
});
