import React from 'react';

const Dashboard = ({ setRoute }) => {
  console.log("setRoute in Dashboard:", setRoute); // Ensure setRoute is passed

  const goToInstructorDashboard = () => {
    setRoute('instructor-dashboard'); // Navigate to Instructor Dashboard
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={goToInstructorDashboard}>Go to Instructor Dashboard</button>
    </div>
  );
};

export default Dashboard;
