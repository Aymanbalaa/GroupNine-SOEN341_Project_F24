import React, { useState, useEffect } from 'react';
import API from '../api';
import InstructorDashboard from './InstructorDashboard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data);

        // Only fetch team if the user is a student
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

  // Instructor view
  if (user.role === 'instructor') {
    return <InstructorDashboard />;
  }

  // Student view
  return (
    <div>
      <h2>Welcome, {user.firstname} {user.lastname}!</h2>
      <p>You are logged in as a {user.role}.</p>

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
    </div>
  );
};

export default Dashboard;