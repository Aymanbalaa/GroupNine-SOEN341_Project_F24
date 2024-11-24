// src/components/Register.js
import React, { useState } from 'react';
import API from '../api';
import './Register.css';

// Backend
const Register = ({ setRoute }) => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    id: '',
    password: '',
    role: 'student'
  });

  const [errorMessage, setErrorMessage] = useState('');
  const { username, firstname, lastname,email, id, password, role } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === 'id') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      // console.log(res.data);
      setRoute('dashboard');
    } catch (err) {
      setErrorMessage(err.response.data.message || 'Registration failed. Please try again.');
    }
  };

  // Frontend
  return (
    <div className="register-container">
      <h2>Register</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
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
            type="text"
            name="firstname"
            value={firstname}
            onChange={onChange}
            placeholder="First Name"
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="lastname"
            value={lastname}
            onChange={onChange}
            placeholder="Last Name"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="id"
            value={id}
            onChange={onChange}
            placeholder="Student/Faculty ID"
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
          <label htmlFor="role-select">Role</label>
          <select
            id="role-select"
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