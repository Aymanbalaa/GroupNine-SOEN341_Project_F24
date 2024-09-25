import React, { useState } from 'react';
import API from '../api';

const CreateTeamFromCsv = ({ setRoute }) => {  // Ensure setRoute is received as a prop
  const [teamName, setTeamName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const contents = e.target.result;

        try {
          const rows = contents.split('\n');
          const parsedData = rows
            .slice(1) // Skip header row
            .map(row => {
              const cols = row.split(',');
              return {
                name: cols[0]?.replace(/"/g, '') || '',
                lastName: cols[1]?.replace(/"/g, '') || '',
                id: cols[2]?.replace(/"/g, '') || '',
              };
            })
            .filter(student => student.name && student.lastName && student.id);

          setErrorMessage(null);

          try {
            const studentIdsFromCsv = parsedData.map(student => student.id);
            const studentDetailsPromises = studentIdsFromCsv.map(studentId =>
              API.get(`/auth/student/${studentId}`)
            );
            const studentDetailsResponses = await Promise.all(studentDetailsPromises);
            const studentDetails = studentDetailsResponses.map(res => res.data);

            const validStudentDetails = studentDetails.filter(student => student);
            setStudents(validStudentDetails);

            if (validStudentDetails.length !== studentIdsFromCsv.length) {
              setErrorMessage('Some student IDs were not found in the database. Please check your CSV file.');
            } else {
              setErrorMessage(null);
            }
          } catch (err) {
            console.error('Error fetching student details:', err);
            setErrorMessage('Error fetching student details from the database.');
            setStudents([]);
          }

        } catch (error) {
          console.error('Error parsing CSV:', error);
          setErrorMessage('Invalid CSV format. Please check your file.');
          setStudents([]);
        }
      };

      reader.readAsText(file);
    } else {
      setErrorMessage("Please select a CSV file.");
      setStudents([]);
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert('Team name cannot be empty');
      return;
    }

    try {
      await API.post('/team/create', {
        name: teamName,
        members: students.filter(student => selectedStudents.includes(student._id)),
      });

      alert('Team created successfully');
      setTeamName('');
      setSelectedStudents([]);

      // Navigate back to InstructorDashboard after successful team creation
      setRoute('instructor-dashboard');
    } catch (err) {
      console.error('Error creating team:', err);
      alert(err.response?.data?.message || 'Failed to create team');
    }
  };

  const handleStudentSelect = (e) => {
    const { value, checked } = e.target;
    setSelectedStudents((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((id) => id !== value)
    );
  };

  return (
    <div className="container"> {/* Consider adding a unique className for styling */}
      <h2>Create Team from CSV</h2>
      <form onSubmit={createTeam}>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
          required
        />

        <h3>Upload CSV File:</h3>
        <input type="file" accept=".csv" onChange={handleFileUpload} />

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        {/* Display students from the CSV file */}
        <h3>Students from CSV:</h3>
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

      {/* Button to navigate back to InstructorDashboard */}
      <button onClick={() => setRoute('instructor-dashboard')}>Back to Instructor Dashboard</button>
    </div>
  );
};

export default CreateTeamFromCsv;
