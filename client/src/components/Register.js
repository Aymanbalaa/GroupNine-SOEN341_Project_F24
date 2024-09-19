import React, { useState } from 'react';
import API from '../api';
import './Register.css'; // Ensure you have this CSS file

const Register = ({ setRoute }) => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    id: '', // Leave it as an empty string initially
    password: '',
    role: 'student'
  });

  const [errorMessage, setErrorMessage] = useState('');

  const { username, firstname, lastname, id, password, role } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === 'id') {
      // Ensure the id is converted to a number
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      console.log(res.data);
      setRoute('dashboard'); // Navigate to dashboard
    } catch (err) {
      // Display error message from response or a general message
      setErrorMessage(err.response.data.message || 'Registration failed. Please try again.');
    }
  };

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
            type="number" // This ensures it's a number input
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
