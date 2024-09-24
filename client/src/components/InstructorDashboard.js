import React, { useState, useEffect } from 'react';
import API from '../api';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const [teamName, setTeamName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [teams, setTeams] = useState([]); // State to store all teams

  useEffect(() => {
    // Fetch all students
    const fetchStudents = async () => {
      try {
        const res = await API.get('/auth/all-students');
        setStudents(res.data);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };

    // Fetch all teams
    const fetchTeams = async () => {
      try {
        const res = await API.get('/team/all');
        setTeams(res.data);
      } catch (err) {
        console.error('Error fetching teams:', err);
      }
    };

    fetchStudents();
    fetchTeams();
  }, []);

  const isStudentInTeam = (studentId) => {
    return teams.some(team => team.members.some(member => member._id === studentId));
  };

  const createTeam = async (e) => {
    e.preventDefault();

    // Ensure that the team name is not empty or just spaces
    if (!teamName || teamName.trim() === '') {
      alert('Team name cannot be empty');
      return;
    }

    // Check if any selected student is already in a team
    const studentsAlreadyInTeam = selectedStudents.filter(id => isStudentInTeam(id));

    if (studentsAlreadyInTeam.length > 0) {
      alert('Some students are already in a team and cannot be added.');
      return;
    }

    try {
      await API.post('/team/create', {
        name: teamName,
        members: selectedStudents,
      });
      alert('Team created successfully');
      setTeamName(''); // Clear the input after team creation
      setSelectedStudents([]); // Clear selected students
      // Fetch updated teams after creation
      const res = await API.get('/team/all');
      setTeams(res.data);
    } catch (err) {
      console.error('Error creating team:', err);
      alert(err.response.data.message || 'Failed to create team');
    }
  };

  const handleStudentSelect = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedStudents([...selectedStudents, value]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== value));
    }
  };

  return (
    <div className="container">
      <h2>Create Team</h2>
      <form onSubmit={createTeam}>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
          required
        />
        <h3>Select Students:</h3>
        {students.map((student) => (
          <div key={student._id}>
            <label>
              <input
                type="checkbox"
                value={student._id}
                checked={selectedStudents.includes(student._id)}
                onChange={handleStudentSelect}
                disabled={isStudentInTeam(student._id)}
              />
              {student.firstname} {student.lastname} {isStudentInTeam(student._id) && '(Already in a team)'}
            </label>
          </div>
        ))}
        <button type="submit">Create Team</button>
      </form>

      <h2>All Teams</h2>
      {teams.length > 0 ? (
        <ul>
          {teams.map((team) => (
            <li key={team._id}>
              <strong>{team.name}</strong>
              <ul>
                {team.members.map((member) => (
                  <li key={member._id}>
                    {member.firstname} {member.lastname}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No teams available.</p>
      )}
    </div>
  );
};

export default InstructorDashboard;
