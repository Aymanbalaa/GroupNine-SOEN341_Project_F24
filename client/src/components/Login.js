// client/src/components/Login.js
import React, { useState } from 'react';
import API from '../api';
import './Login.css'; // Make sure to create this CSS file

const Login = ({ setRoute }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

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
      console.error(err.response.data);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
