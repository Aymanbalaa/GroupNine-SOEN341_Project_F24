import React, { useState } from 'react';
import API from '../api';
import './sharedfile.css';

const Register = ({ setRoute }) => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    id: '',
    password: '',
    role: 'student',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const { username, firstname, lastname, email, id, password, role } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      setRoute('dashboard');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-content">
          <h2>Create Account</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={onSubmit} className="auth-form">
            <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
            <input type="text" name="firstname" value={firstname} onChange={onChange} placeholder="First Name" required />
            <input type="text" name="lastname" value={lastname} onChange={onChange} placeholder="Last Name" required />
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
            <input type="number" name="id" value={id} onChange={onChange} placeholder="Student/Faculty ID" required />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
            <select name="role" value={role} onChange={onChange}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="auth-side">
          <h2>Welcome Back!</h2>
          <p>Enter your personal details and start reviewing your peers with us.</p>
          <button onClick={() => setRoute('login')}>Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default Register;