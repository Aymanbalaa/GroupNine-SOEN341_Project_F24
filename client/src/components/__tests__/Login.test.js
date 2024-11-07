// src/components/Login.test.js
import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '.././Login';
import API from '../../api';

// Mock API module
jest.mock('../../api');

describe('Login Component', () => {
  const mockSetRoute = jest.fn();

  beforeEach(() => {
    API.post.mockClear();
    mockSetRoute.mockClear();
  });

  test('renders login form', () => {
    render(<Login setRoute={mockSetRoute} />);

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows error message on failed login', async () => {
    API.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    render(<Login setRoute={mockSetRoute} />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { name: 'username', value: 'wrongUser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: 'password', value: 'wrongPass' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    const errorMessage = await screen.findByText(/invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });

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

    await screen.findByRole('button', { name: /login/i });
    expect(mockSetRoute).toHaveBeenCalledWith('dashboard');
  });
});
