import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList'; // Import the new component

const App = () => {
  const [route, setRoute] = useState('login'); // Default route is 'login'

  const renderComponent = () => {
    switch (route) {
      case 'register':
        return <Register setRoute={setRoute} />;
      case 'dashboard':
        return <Dashboard />; 
      case 'studentList': // Add a new case for the student list
        return <StudentList />;
      case 'login':
      default:
        return <Login setRoute={setRoute} />;
    }
  };

  return (
    <div>
      {renderComponent()}

      {/* Conditionally render a button to navigate to the StudentList */}
      {route === 'dashboard' && ( 
        <button onClick={() => setRoute('studentList')}>View Student List</button>
      )} 
    </div>
  );
};

export default App;