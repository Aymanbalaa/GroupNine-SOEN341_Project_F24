import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import './InstructorDetailedView.css';

const InstructorDetailedView = ({ setRoute }) => {
  const [detailedData, setDetailedData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetailedData = async () => {
      try {
        const teamRes = await API.get('/team/all');
        const teams = teamRes.data;

        const assessmentRes = await API.get('/peer-assessment/all-assessments');
        const assessments = assessmentRes.data;

        const detailedFeedback = teams.map((team) => {
          const teamData = {
            name: team.name,
            members: team.members.map((member) => {
              const memberAssessments = assessments.filter(
                (assessment) => assessment.memberId && assessment.memberId._id === member._id
              );

              const assessmentDetails = memberAssessments.map((assessment) => ({
                evaluator: assessment.studentId
                  ? `${assessment.studentId.firstname} ${assessment.studentId.lastname}`
                  : 'Unknown Evaluator',
                cooperation: assessment.ratings["Cooperation"] || 0,
                conceptual: assessment.ratings["Conceptual Contribution"] || 0,
                practical: assessment.ratings["Practical Contribution"] || 0,
                workEthic: assessment.ratings["Work Ethic"] || 0,
                averageAcrossAll: (
                  (assessment.ratings["Cooperation"] +
                    assessment.ratings["Conceptual Contribution"] +
                    assessment.ratings["Practical Contribution"] +
                    assessment.ratings["Work Ethic"]) / 4
                ).toFixed(2),
                comments: assessment.comments || {},
              }));

              return {
                student: `${member.firstname} ${member.lastname}`,
                assessments: assessmentDetails,
              };
            }),
          };
          return teamData;
        });

        setDetailedData(detailedFeedback);
      } catch (err) {
        console.error('Error fetching detailed view:', err.message);
        setError('Failed to load detailed assessment data');
      }
    };

    fetchDetailedData();
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
    <div className="detailed-view-container">
      <h2>Detailed View of Assessments</h2>
      {error && <p className="error-message">{error}</p>}
      {detailedData.length > 0 ? (
        detailedData.map((team, teamIndex) => (
          <div key={teamIndex} className="team-section">
            <h3>Team Name: {team.name}</h3>
            {team.members.map((member, memberIndex) => (
              <div key={memberIndex} className="member-section">
                <h4>Student Name: {member.student}</h4>
                <table className="assessment-table">
                  <thead>
                    <tr>
                      <th>Evaluator</th>
                      <th>Cooperation</th>
                      <th>Conceptual</th>
                      <th>Practical</th>
                      <th>Work Ethic</th>
                      <th>Average Across All</th>
                    </tr>
                  </thead>
                  <tbody>
                    {member.assessments.map((assessment, assessmentIndex) => (
                      <tr key={assessmentIndex}>
                        <td>{assessment.evaluator}</td>
                        <td>{assessment.cooperation}</td>
                        <td>{assessment.conceptual}</td>
                        <td>{assessment.practical}</td>
                        <td>{assessment.workEthic}</td>
                        <td>{assessment.averageAcrossAll}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="comments-section">
                  <h5>Comments:</h5>
                  {member.assessments.map((assessment, assessmentIndex) => (
                    <div key={assessmentIndex}>
                      {Object.entries(assessment.comments).map(([dimension, comment]) => (
                        <p key={dimension}>
                          <strong>{assessment.evaluator} - {dimension} Comment:</strong> {comment || 'No comment provided'}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No assessment data available.</p>
      )}
      <button onClick={handleBackToDashboard}>Back to Dashboard</button>
    </div>
  );
};

export default InstructorDetailedView;
