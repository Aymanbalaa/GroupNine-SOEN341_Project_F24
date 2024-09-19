// client/src/App.js
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  const [route, setRoute] = useState('login'); // Default route is 'login'

  const renderComponent = () => {
    switch (route) {
      case 'register':
        return <Register setRoute={setRoute} />;
      case 'dashboard':
        return <Dashboard />;
      case 'login':
      default:
        return <Login setRoute={setRoute} />;
    }
  };

  return (
    <div>
      <h1>Authentication System</h1>
      {renderComponent()}
    </div>
  );
};

export default App;
