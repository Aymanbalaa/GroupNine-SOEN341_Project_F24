import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from './Login';

describe('Login Component', () => {
  test('renders Login form', () => {
    render(<Login setRoute={() => {}} />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('handles input changes', () => {
    render(<Login setRoute={() => {}} />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpass');
  });

  test('displays error message on failed login', async () => {
    render(<Login setRoute={() => {}} />);
    
    fireEvent.submit(screen.getByText('Login'));

    // Simulate the API error response
    await screen.findByText('Login failed. Please try again.');
    expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
  });
});
