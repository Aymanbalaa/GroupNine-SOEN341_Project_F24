import React from 'react';

const Login = ({ setRoute }) => {
  const handleLogin = () => {
    // Simulate a successful login
    console.log("User logged in, navigating to Dashboard");
    setRoute('dashboard'); // Navigate to the dashboard after login
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login</button> {/* Simulate login button */}
    </div>
  );
};

export default Login;
