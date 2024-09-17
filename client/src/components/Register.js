// client/src/components/Register.js
import React, { useState } from 'react';
import API from '../api';

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
    <form onSubmit={onSubmit}>
      <div>
        <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
      </div>
      <div>
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
      </div>
      <div>
        <select name="role" value={role} onChange={onChange}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
      </div>
      <button type="submit">Register</button>
      <button type="button" onClick={() => setRoute('login')}>Already have an account? Login</button>
    </form>
  );
};

export default Register;
