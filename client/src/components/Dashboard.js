import React, { useState, useEffect } from 'react';
import API from '../api';
import './Dashboard.css';
import InstructorDashboard from './InstructorDashboard';
import ViewAssessments from './ViewAssessments';
import PeerAssessment from './PeerAssessment';
import AnonymousFeedback from './AnonymousFeedback';
import EditEvaluation from './EditEvaluation';
const Dashboard = ({ setRoute }) => {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [viewingAssessments, setViewingAssessments] = useState(false);
  const [makingEvaluation, setMakingEvaluation] = useState(false);
  const [viewingFeedback, setViewingFeedback] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data);
        if (res.data.role === 'student') await fetchTeamData();
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };

    const fetchTeamData = async () => {
      try {
        const res = await API.get('/team/myteam');
        setTeam(res.data);
      } catch (err) {
        console.error('Error fetching team details:', err.response?.data || err.message);
      }
    };

    fetchUserData();
  }, []);

  if (!user) return <div>Loading...</div>;

  const toggleView = (setFunction) => setFunction((prev) => !prev);

  const backButton = (
    <div className="center-button">
      <button onClick={() => resetView()} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );

  const resetView = () => {
    setViewingAssessments(false);
    setMakingEvaluation(false);
    setViewingFeedback(false);
    setEditingEvaluation(false);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.firstname} {user.lastname}!</h2>
      <p>You are logged in as a {user.role}.</p>

      {team && (
        <div className="team-info">
          <h3>Your Team: {team.name}</h3>
          <ul>
            {team.members.map((member) => (
              <li key={member._id}>{member.firstname} {member.lastname}</li>
            ))}
          </ul>
        </div>
      )}

      {viewingAssessments ? (
        <div>
          {backButton}
          <ViewAssessments role="student" />
        </div>
      ) : makingEvaluation ? (
        <div>
          {backButton}
          <PeerAssessment setRoute={setRoute} />
        </div>
      ) : viewingFeedback ? (
        <div>
          {backButton}
          <AnonymousFeedback />
        </div>
      ) : editingEvaluation ? (
        <div>
          {backButton}
          <EditEvaluation />
        </div>
      ) : (
        <div>
          <button onClick={() => toggleView(setViewingAssessments)}>View Peer Assessments</button>
          <button onClick={() => toggleView(setMakingEvaluation)}>Make Evaluation</button>
          <button onClick={() => toggleView(setViewingFeedback)}>View Received Feedback</button>
          <button onClick={() => toggleView(setEditingEvaluation)}>Edit Evaluation</button>
          <button className="logout-button" onClick={() => setRoute('login')}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;