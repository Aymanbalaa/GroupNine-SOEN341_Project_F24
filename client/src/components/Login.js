// client/src/components/Login.js
import React, { useState } from 'react';
import API from '../api';

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
      // Assuming the response includes user name and role
      const { token, user } = res.data;

      // Store user information in local storage
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
    <form onSubmit={onSubmit}>
      <div>
        <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
      </div>
      <div>
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
      </div>
      <button type="submit">Login</button>
      <button type="button" onClick={() => setRoute('register')}>Don't have an account? Register</button>
    </form>
  );
};

export default Login;
