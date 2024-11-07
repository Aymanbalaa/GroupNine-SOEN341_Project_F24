// src/components/teams/CreateTeamManually.js

import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';

const CreateTeamManually = ({ setRoute }) => {
  const [teamName, setTeamName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get('/auth/all-students');
        setStudents(res.data);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentSelect = useCallback((e) => {
    const { value, checked } = e.target;
    setSelectedStudents((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((id) => id !== value)
    );
  }, []);

  const createTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert('Team name cannot be empty');
      return;
    }
    try {
      await API.post('/team/create', { name: teamName, members: selectedStudents });
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
    <div>
      <h2>Create Team Manually</h2>
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
          <label key={student._id}>
            <input
              type="checkbox"
              value={student._id}
              onChange={handleStudentSelect}
            />
            {student.firstname} {student.lastname}
          </label>
        ))}
        <button type="submit">Create Team</button>
      </form>
      <button onClick={() => setRoute('instructor-dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default CreateTeamManually;
