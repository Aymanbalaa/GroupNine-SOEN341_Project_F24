import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import './InstructorSummaryView.css';

const InstructorSummaryView = ({ setRoute }) => {
  const [summaryData, setSummaryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const res = await API.get('/peer-assessment/summary-view');
        const summary = res.data;

        setSummaryData(summary);
      } catch (err) {
        console.error('Error fetching summary data:', err.message);
        setError('Failed to load summary data');
      }
    };

    fetchSummaryData();
  }, []);

  const handleBackToDashboard = useCallback(() => {
    if (setRoute) {
      setRoute('instructor-dashboard');
    } else {
      console.error('setRoute function is not defined');
      alert('Unable to navigate back to the dashboard');
    }
  }, [setRoute]);

  return (
    <div className="summary-view-container">
      <h2>Summary of Results</h2>
      {error && <p className="error-message">{error}</p>}
      {summaryData.length > 0 ? (
        <table className="summary-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Team</th>
              <th>Cooperation</th>
              <th>Conceptual Contribution</th>
              <th>Practical Contribution</th>
              <th>Work Ethic</th>
              <th>Average</th>
              <th>Peers who responded</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((student, index) => (
              <tr key={index}>
                <td>{student.studentId}</td>
                <td>{student.lastname}</td>
                <td>{student.firstname}</td>
                <td>{student.team}</td>
                <td>{student.cooperation}</td>
                <td>{student.conceptual}</td>
                <td>{student.practical}</td>
                <td>{student.workEthic}</td>
                <td>{student.average}</td>
                <td>{student.responseCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No summary data available.</p>
      )}
      <button onClick={handleBackToDashboard}>Back to Dashboard</button>
    </div>
  );
};

export default InstructorSummaryView;
