import React, { useState, useEffect } from 'react';
import API from '../api';

const StudentDashboard = ({ setRoute }) => {
  const [team, setTeam] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // Fetch the student's team using the '/team/my-team' route
        const res = await API.get('/team/my-team', { withCredentials: true });
        setTeam(res.data);
      } catch (err) {
        // If the student isn't part of a team, display the message
        setMessage(err.response?.data?.message || 'You are not currently assigned to a team');
      }
    };
    fetchTeam();
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>
      {team ? (
        <div>
          <h3>Your Team: {team.name}</h3>
          <ul>
            {team.members.map((member) => (
              <li key={member._id}>{member.firstname} {member.lastname}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default StudentDashboard;
