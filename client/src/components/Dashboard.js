// client/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import API from '../api';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.firstname} {user.lastname}!</h2>
      <p>You are logged in as a {user.role}.</p>
    </div>
  );
};

export default Dashboard;
