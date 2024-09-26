import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InstructorDashboard from './components/InstructorDashboard';
import CreateTeamFromCsv from './components/CreateTeamFromCsv';

//Backend
const App = () => {
  const [route, setRoute] = useState('login');

  console.log("App route state: ", route);
  console.log("App setRoute function: ", setRoute);
  
  const renderComponent = () => {
    console.log("Rendering component for route: ", route);
    
    switch (route) {
      case 'register':
        console.log("Rendering Register");
        return <Register setRoute={setRoute} />;
      case 'dashboard':
        console.log("Rendering Dashboard");
        return <Dashboard setRoute={setRoute} />;
      case 'instructor-dashboard':
        console.log("Rendering InstructorDashboard");
        return <InstructorDashboard setRoute={setRoute} />;
      case 'create-team-from-csv':
        console.log("Rendering CreateTeamFromCsv");
        return <CreateTeamFromCsv setRoute={setRoute} />;
      case 'login':
      default:
        console.log("Rendering Login");
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
