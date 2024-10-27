// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import API from '../api';
import InstructorDashboard from './InstructorDashboard';
import ViewAssessments from './ViewAssessments';

const Dashboard = ({ setRoute }) => {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [viewingAssessments, setViewingAssessments] = useState(false); // State to toggle assessments view

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data);

        // Only fetch team data if the user is a student
        if (res.data.role === 'student') {
          await fetchTeamData();
        }
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

  if (!user) {
    return <div>Loading...</div>;
  }

  // Toggle between dashboard and peer assessments
  const handleViewAssessments = () => setViewingAssessments(!viewingAssessments);

  // Instructor view
  if (user.role === 'instructor') {
    return (
      <div>
        {viewingAssessments ? (
          <div>
            <button onClick={handleViewAssessments}>Back to Dashboard</button>
            <ViewAssessments role="instructor" />
          </div>
        ) : (
          <InstructorDashboard setRoute={setRoute} handleViewAssessments={handleViewAssessments} />
        )}
      </div>
    );
  }

  // Student view
  return (
    <div>
      <h2>Welcome, {user.firstname} {user.lastname}!</h2>
      <p>You are logged in as a {user.role}.</p>

      {viewingAssessments ? (
        <div>
          <button onClick={handleViewAssessments}>Back to Dashboard</button>
          <ViewAssessments role="student" />
        </div>
      ) : (
        <div>
          {team ? (
            <div>
              <h3>Your Team: {team.name}</h3>
              <h4>Members:</h4>
              <ul>
                {team.members.map((member) => (
                  <li key={member._id}>
                    {member.firstname} {member.lastname}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>You are not assigned to any team.</p>
          )}
          <button onClick={handleViewAssessments}>View Peer Assessments</button> {/* Button to view assessments */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
