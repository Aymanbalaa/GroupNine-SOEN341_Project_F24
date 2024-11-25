import React, { useState } from 'react';
import API from '../api';
import './CreateTeamFromCsv.css';

const CreateTeamFromCsv = ({ setRoute, instructorId }) => {
  const [teamName, setTeamName] = useState(''); // Store Team Name
  const [students, setStudents] = useState([]); // Store Students in Database
  const [selectedStudents, setSelectedStudents] = useState([]); // Store Checkmarked Students
  const [errorMessage, setErrorMessage] = useState(null); // Error Message Handling

  // CSV File Upload
  // Format includes a header row with Column 1: First Name, Column 2: Last Name, and Column 3: ID
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const contents = e.target.result;
        try {
          const rows = contents.split('\n');
          const parsedData = rows
            .slice(1) // Skip Header
            .map((row) => {
              const cols = row.split(',');
              return {
                name: cols[0]?.replace(/"/g, '') || '',
                lastName: cols[1]?.replace(/"/g, '') || '',
                id: cols[2]?.replace(/"/g, '') || '',
              };
            })
            .filter(
              (student) => student.name && student.lastName && student.id,
            );

          const studentIdsFromCsv = parsedData.map((student) =>
            student.id.replace(/^0+/, ''),
          ); // Remove Leading Zeros
          setErrorMessage(null);

          try {
            const studentDetailsPromises = studentIdsFromCsv.map((studentId) =>
              API.get(`/auth/student/${studentId}`)
                .then((res) => res.data)
                .catch(() => null),
            );
            const studentDetailsResponses = await Promise.all(
              studentDetailsPromises,
            );

            const validStudentDetails = studentDetailsResponses.filter(
              (student) => student !== null,
            );
            setStudents(validStudentDetails);

            if (validStudentDetails.length < studentIdsFromCsv.length) {
              setErrorMessage(
                'Some student IDs were not found in the database, but valid students have been loaded.',
              );
            } else {
              setErrorMessage(null);
            }
          } catch (err) {
            console.error('Error fetching student details:', err);
            setErrorMessage(
              'Error fetching student details from the database.',
            );
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
      setErrorMessage('Please select a CSV file.');
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
        members: students.filter((student) =>
          selectedStudents.includes(student._id),
        ),
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

  const handleStudentSelect = (e) => {
    const { value, checked } = e.target;
    setSelectedStudents((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((id) => id !== value),
    );
  };

  return (
    <div className='csv-upload-container'>
      <h2>Create Team from CSV</h2>
      <form onSubmit={createTeam}>
        <input
          type='text'
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder='Team Name'
          required
        />

        <h3>Upload CSV File:</h3>
        <input type='file' accept='.csv' onChange={handleFileUpload} />

        {errorMessage && <p className='error-message'>{errorMessage}</p>}

        <h3>Students from CSV:</h3>
        {students.map((student) => (
          <div key={student._id} className='student-entry'>
            <label>
              <input
                type='checkbox'
                value={student._id}
                checked={selectedStudents.includes(student._id)}
                onChange={handleStudentSelect}
              />
              {student.firstname} {student.lastname}
            </label>
          </div>
        ))}

        <button type='submit'>Create Team</button>
      </form>
      <button
        onClick={() => setRoute('instructor-dashboard')}
        className='back-button'
      >
        Back to Instructor Dashboard
      </button>
    </div>
  );
};

export default CreateTeamFromCsv;
