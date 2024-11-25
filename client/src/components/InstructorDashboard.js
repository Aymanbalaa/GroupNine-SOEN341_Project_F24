import React from 'react';
import PropTypes from 'prop-types';
import './InstructorDashboard.css';

const InstructorDashboard = ({ setRoute }) => {
  return (
    <div className='dashboard-container'>
      <h2>Instructor Dashboard</h2>

      {/* Buttons for each feature */}
      <button onClick={() => setRoute('create-team-manually')}>
        Create Teams Manually
      </button>

      <button onClick={() => setRoute('load-team-csv')}>
        Load Teams with CSV
      </button>

      <button onClick={() => setRoute('detailed-view')}>
        Detailed View of Assessments
      </button>

      <button onClick={() => setRoute('summary-view')}>
        Summary View of Assessments
      </button>

      <button onClick={() => setRoute('statistics-view')}>
        View Statistics
      </button>

      {/* Logout button with different styling */}
      <button className='logout-button' onClick={() => setRoute('login')}>
        Log Out
      </button>
    </div>
  );
};

InstructorDashboard.propTypes = {
  setRoute: PropTypes.func.isRequired,
};

export default InstructorDashboard;
