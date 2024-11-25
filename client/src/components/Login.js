import React, { useState } from 'react';
import API from '../api';
import './sharedfile.css';

const Login = ({ setRoute }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/login', formData);
      setRoute('dashboard');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-content">
          <h2>Sign In</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={onSubmit} className="auth-form">
            <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="auth-side">
          <h2>Hello, Friend!</h2>
          <p>Register your personal details to start your journey with us.</p>
          <button onClick={() => setRoute('register')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;