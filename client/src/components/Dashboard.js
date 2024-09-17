// client/src/components/Dashboard.js
import React from 'react';

const Dashboard = () => {
  // Retrieve user information from local storage
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  return (
    <div>
      <h2>Welcome, {username}!</h2>
      <p>You are logged in as a {role}.</p>
    </div>
  );
};

export default Dashboard;
