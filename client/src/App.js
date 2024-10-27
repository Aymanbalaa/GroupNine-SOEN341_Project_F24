import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InstructorDashboard from './components/InstructorDashboard';
import CreateTeamFromCsv from './components/CreateTeamFromCsv';
import PeerAssessment from './components/PeerAssessment'; // Import PeerAssessment component

const App = () => {
  const [route, setRoute] = useState('login'); // Default route is 'login'

  const renderComponent = () => {
    switch (route) {
      case 'register':
        return <Register setRoute={setRoute} />;
      case 'dashboard':
        return <Dashboard setRoute={setRoute} />;
      case 'instructor-dashboard':
        return <InstructorDashboard setRoute={setRoute} />;
      case 'create-team-from-csv':
        return <CreateTeamFromCsv setRoute={setRoute} />;
      case 'peer-assessment': // New route for peer assessment
        return <PeerAssessment setRoute={setRoute} />;
      case 'login':
      default:
        return <Login setRoute={setRoute} />;
    }
  };

  return (
    <div>
      {renderComponent()}
    </div>
  );
};

export default App;
