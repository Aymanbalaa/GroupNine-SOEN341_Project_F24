// src/components/Register.test.js
import React from 'react';// src/components/Login.test.js and src/components/Register.test.js
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../Register';
import API from '../../api';


// Mock API module
jest.mock('../../api');

describe('Register Component', () => {
  const mockSetRoute = jest.fn();

  beforeEach(() => {
    API.post.mockClear();
    mockSetRoute.mockClear();
  });

  test('renders registration form', () => {
    render(<Register setRoute={mockSetRoute} />);

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/student\/faculty id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('shows error message on failed registration', async () => {
    API.post.mockRejectedValue({
      response: { data: { message: 'Username already exists' } }
    });

    render(<Register setRoute={mockSetRoute} />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { name: 'username', value: 'existingUser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { name: 'firstname', value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { name: 'lastname', value: 'Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText(/student\/faculty id/i), {
      target: { name: 'id', value: '123456' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: 'password', value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: 'student' }
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    const errorMessage = await screen.findByText(/username already exists/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('redirects to dashboard on successful registration', async () => {
    API.post.mockResolvedValueOnce({});

    render(<Register setRoute={mockSetRoute} />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { name: 'username', value: 'newUser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { name: 'firstname', value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { name: 'lastname', value: 'Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText(/student\/faculty id/i), {
      target: { name: 'id', value: '123456' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: 'password', value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: 'student' }
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await screen.findByRole('button', { name: /register/i });
    expect(mockSetRoute).toHaveBeenCalledWith('dashboard');
  });
});
