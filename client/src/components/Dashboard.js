import React from 'react';

const Dashboard = ({ setRoute }) => {
  const goToInstructorDashboard = () => {
    console.log("Navigating to Instructor Dashboard");
    setRoute('instructor-dashboard'); // Navigate to the Instructor Dashboard
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={goToInstructorDashboard}>Go to Instructor Dashboard</button> {/* Button to go to InstructorDashboard */}
    </div>
  );
};

export default Dashboard;
