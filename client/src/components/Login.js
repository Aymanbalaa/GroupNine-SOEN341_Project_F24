// client/src/components/Login.js
import React, { useState } from 'react';
import API from '../api';
import './Login.css';

const Login = ({ setRoute }) => {
  console.log("setRoute in Login:", setRoute);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/login', formData);
      setRoute('dashboard'); // Navigate to dashboard after successful login
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
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
