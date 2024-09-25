import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import './InstructorDashboard.css';

const InstructorDashboard = ({ setRoute }) => {
  console.log('setRoute in InstructorDashboard:', setRoute);

  const [teamName, setTeamName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchStudentsAndTeams = async () => {
      try {
        const [studentsRes, teamsRes] = await Promise.all([
          API.get('/auth/all-students'),
          API.get('/team/all'),
        ]);
        setStudents(studentsRes.data);
        setTeams(teamsRes.data);
      } catch (err) {
        console.error('Error fetching students or teams:', err);
      }
    };

    fetchStudentsAndTeams();
  }, []);

  const isStudentInTeam = useCallback(
    (studentId) => teams.some((team) => team.members.some((member) => member._id === studentId)),
    [teams]
  );

  const createTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert('Team name cannot be empty');
      return;
    }
    const studentsAlreadyInTeam = selectedStudents.filter((id) => isStudentInTeam(id));
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
      setTeamName('');
      setSelectedStudents([]);
      const res = await API.get('/team/all');
      setTeams(res.data);
    } catch (err) {
      console.error('Error creating team:', err);
      alert(err.response?.data?.message || 'Failed to create team');
    }
  };

  const handleStudentSelect = useCallback(
    (e) => {
      const { value, checked } = e.target;
      setSelectedStudents((prevSelected) =>
        checked ? [...prevSelected, value] : prevSelected.filter((id) => id !== value)
      );
    },
    [setSelectedStudents]
  );

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
              />
              {student.firstname} {student.lastname}
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

      {/* Button to go to the CSV Upload Page */}
      <button onClick={() => setRoute('create-team-from-csv')}>
        Upload Team from CSV
      </button>
    </div>
  );
};

export default InstructorDashboard;
