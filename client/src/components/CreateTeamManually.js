import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import './CreateTeamManually.css';

const CreateTeamManually = ({ setRoute }) => {
  const [teamName, setTeamName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const [studentsRes, teamsRes] = await Promise.all([
          API.get('/auth/all-students'), // Fetch all students
          API.get('/team/all'), // Fetch all teams to check team membership
        ]);

        // Create a map of student IDs who are already in a team
        const studentsInTeams = new Set();
        teamsRes.data.forEach((team) => {
          team.members.forEach((member) => studentsInTeams.add(member._id));
        });

        // Add `inTeam` property to each student based on membership
        const studentsData = studentsRes.data.map((student) => ({
          ...student,
          inTeam: studentsInTeams.has(student._id),
        }));

        setStudents(studentsData);
      } catch (err) {
        console.error('Error fetching students or teams:', err);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentSelect = useCallback((e) => {
    const { value, checked } = e.target;
    setSelectedStudents((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((id) => id !== value),
    );
  }, []);

  const createTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert('Team name cannot be empty');
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
      setRoute('instructor-dashboard');
    } catch (err) {
      console.error('Error creating team:', err);
      alert('Failed to create team');
    }
  };

  return (
    <div className='create-team-container'>
      <h2>Create Team Manually</h2>
      <form onSubmit={createTeam}>
        <input
          type='text'
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder='Team Name'
          required
        />
        <h3>Select Students:</h3>
        {students.map((student) => (
          <label
            key={student._id}
            className={student.inTeam ? 'disabled-student' : ''}
          >
            <input
              type='checkbox'
              value={student._id}
              onChange={handleStudentSelect}
              disabled={student.inTeam} // Disable if student is already in a team
            />
            {student.firstname} {student.lastname}{' '}
            {student.inTeam && '(Already in a team)'}
          </label>
        ))}
        <button type='submit'>Create Team</button>
      </form>
      <button onClick={() => setRoute('instructor-dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default CreateTeamManually;
