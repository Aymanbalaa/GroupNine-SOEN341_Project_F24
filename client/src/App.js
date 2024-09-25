import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InstructorDashboard from './components/InstructorDashboard';
import CreateTeamFromCsv from './components/CreateTeamFromCsv';

const App = () => {
  const [route, setRoute] = useState('login'); // Initialize route as 'login'

  // Function to render components based on route
  const renderComponent = () => {
    switch (route) {
      case 'register':
        return <Register setRoute={setRoute} />; // Pass setRoute to Register
      case 'dashboard':
        return <Dashboard setRoute={setRoute} />; // Pass setRoute to Dashboard
      case 'instructor-dashboard':
        return <InstructorDashboard setRoute={setRoute} />; // Pass setRoute to InstructorDashboard
      case 'create-team-from-csv':
        return <CreateTeamFromCsv setRoute={setRoute} />; // Pass setRoute to CreateTeamFromCsv
      case 'login':
      default:
        return <Login setRoute={setRoute} />; // Pass setRoute to Login
    }
  };

  return (
    <div>
      {renderComponent()}
    </div>
  );
};

export default App;
