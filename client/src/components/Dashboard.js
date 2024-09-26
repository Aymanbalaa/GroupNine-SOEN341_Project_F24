import React from 'react';

//Backend
const Dashboard = ({ setRoute }) => {
  console.log("setRoute in Dashboard:", setRoute);

  const goToInstructorDashboard = () => {
    setRoute('instructor-dashboard');
  };

  //Frontend
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={goToInstructorDashboard}>Go to Instructor Dashboard</button>
    </div>
  );
};

export default Dashboard;
