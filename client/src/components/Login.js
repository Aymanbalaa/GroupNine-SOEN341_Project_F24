import React, { useState } from 'react';
import API from '../api';
import './Login.css'; // Make sure to create this CSS file

const Login = ({ setRoute }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('role', user.role);

      console.log(res.data);
      setRoute('dashboard'); // Navigate to dashboard
    } catch (err) {
      // Set error message based on response, or show a generic message
      setErrorMessage(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message display */}
      <form onSubmit={onSubmit} className="login-form">
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            placeholder="Username"
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        <button type="button" className="register-button" onClick={() => setRoute('register')}>
          Don't have an account? Register
        </button>
      </form>
    </div>
  );
};

export default Login;
