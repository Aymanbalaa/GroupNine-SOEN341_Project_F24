import React, { useState, useEffect } from 'react';
import API from '../api';

const InstructorDetailedView = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetailedData = async () => {
      try {
        const res = await API.get('/peer-assessment/detailed-view');
        setDetailedData(res.data);
      } catch (err) {
        console.error('Error fetching detailed view:', err.message);
        setError('Failed to load detailed assessment data');
      }
    };
    fetchDetailedData();
  }, []);

  return (
    <div className="detailed-view-container">
      <h2>Detailed View of Assessments</h2>
      {error && <p className="error-message">{error}</p>}
      {detailedData.length > 0 ? (
        detailedData.map((team) => (
          <div key={team.name} className="team-section"> {/* Use team name as a unique key */}
            <h3>Team Name: {team.name}</h3>
            <div className="member-section">
              {team.members.map((member, index) => (
                <div key={member.firstname + member.lastname + index} className="member-details">
                  <h4>{member.firstname} {member.lastname}</h4>
                  <p><strong>Cooperation:</strong> {member.cooperation}</p>
                  <p><strong>Conceptual Contribution:</strong> {member.conceptual}</p>
                  <p><strong>Practical Contribution:</strong> {member.practical}</p>
                  <p><strong>Work Ethic:</strong> {member.workEthic}</p>
                  <p><strong>Average Across All:</strong> {member.averageAcrossAll}</p>
                  <p><strong>Comment:</strong> {member.comment || 'No comment provided'}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No assessment data available.</p>
      )}
    </div>
  );
};

export default InstructorDetailedView;
