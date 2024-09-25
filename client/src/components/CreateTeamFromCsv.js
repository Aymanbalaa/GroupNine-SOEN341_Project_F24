import React, { useState } from 'react';
import API from '../api';

const CreateTeamFromCsv = ({ setRoute }) => {
  console.log('setRoute in CreateTeamFromCsv:', setRoute);  // This should log the setRoute function

  const [teamName, setTeamName] = useState(''); // Store the team name
  const [students, setStudents] = useState([]); // Store the students found in the database
  const [selectedStudents, setSelectedStudents] = useState([]); // Store selected students
  const [errorMessage, setErrorMessage] = useState(null); // Error message handler

  // Handle the CSV file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; // Get the file from the input

    if (file) {
      const reader = new FileReader(); // Create a new FileReader to read the CSV

      // Process the file contents
      reader.onload = async (e) => {
        const contents = e.target.result;
        try {
          const rows = contents.split('\n'); // Split CSV by rows
          const parsedData = rows
            .slice(1) // Skip header row
            .map(row => {
              const cols = row.split(','); // Split row by columns (assuming columns are separated by commas)
              return {
                name: cols[0]?.replace(/"/g, '') || '',
                lastName: cols[1]?.replace(/"/g, '') || '',
                id: cols[2]?.replace(/"/g, '') || '', // Assume ID is in the third column
              };
            })
            .filter(student => student.name && student.lastName && student.id); // Filter valid students

          setErrorMessage(null); // Clear any previous error messages

          try {
            const studentIdsFromCsv = parsedData.map(student => student.id); // Extract student IDs from the CSV
            const studentDetailsPromises = studentIdsFromCsv.map(studentId =>
              API.get(`/auth/student/${studentId}`) // API call to get student details by ID
            );
            const studentDetailsResponses = await Promise.all(studentDetailsPromises); // Wait for all API calls to finish
            const studentDetails = studentDetailsResponses.map(res => res.data); // Extract the student data from the API responses

            const validStudentDetails = studentDetails.filter(student => student); // Filter valid students
            setStudents(validStudentDetails); // Update the state with found students

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

      reader.readAsText(file); // Read the file as text
    } else {
      setErrorMessage("Please select a CSV file.");
      setStudents([]); // Clear the student list if no file is uploaded
    }
  };

  // Create the team using the selected students
  const createTeam = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert('Team name cannot be empty');
      return;
    }

    try {
      await API.post('/team/create', {
        name: teamName,
        members: students.filter(student => selectedStudents.includes(student._id)), // Filter students based on selection
      });

      alert('Team created successfully');
      setTeamName(''); // Clear the form after team creation
      setSelectedStudents([]); // Clear the selected students

      // Navigate back to InstructorDashboard after successful team creation
      setRoute('instructor-dashboard');
    } catch (err) {
      console.error('Error creating team:', err);
      alert(err.response?.data?.message || 'Failed to create team');
    }
  };

  // Handle selecting or deselecting students for team creation
  const handleStudentSelect = (e) => {
    const { value, checked } = e.target;
    setSelectedStudents((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((id) => id !== value)
    );
  };

  return (
    <div className="container">
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
        <input type="file" accept=".csv" onChange={handleFileUpload} /> {/* File input */}

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}

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
              {student.firstname} {student.lastname} {/* Display student names */}
            </label>
          </div>
        ))}

        <button type="submit">Create Team</button> {/* Button to create the team */}
      </form>

      <button onClick={() => setRoute('instructor-dashboard')}>Back to Instructor Dashboard</button> {/* Go back to dashboard */}
    </div>
  );
};

export default CreateTeamFromCsv;
