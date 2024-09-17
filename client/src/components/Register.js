// client/src/components/Register.js
import React, { useState } from 'react';
import API from '../api';
import './Register.css'; // Make sure to create this CSS file

const Register = ({ setRoute }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  });

  const { username, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      console.log(res.data);
      setRoute('dashboard'); // Navigate to dashboard
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={onSubmit} className="register-form">
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
        <div className="form-group">
          <select
            name="role"
            value={role}
            onChange={onChange}
            className="form-select"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <button type="submit" className="register-button">Register</button>
        <button type="button" className="login-button" onClick={() => setRoute('login')}>
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Register;
