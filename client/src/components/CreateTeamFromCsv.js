import React, { useState } from 'react';
import API from '../api';

//Backend
const CreateTeamFromCsv = ({ setRoute, instructorId }) => { 
  console.log('setRoute in CreateTeamFromCsv:', setRoute);  

  const [teamName, setTeamName] = useState(''); //Store Team Name
  const [students, setStudents] = useState([]); //Store Students in Database
  const [selectedStudents, setSelectedStudents] = useState([]); //Store Checkmarked Students
  const [errorMessage, setErrorMessage] = useState(null); //Error Message Handling

  //CSV File Upload 
  //Format includes a header row with Column 1: First Name, Column 2: Last Name and Column 3: ID
  //CSV File must be of this format
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
            .map(row => {
              const cols = row.split(',');
              return {
                name: cols[0]?.replace(/"/g, '') || '',
                lastName: cols[1]?.replace(/"/g, '') || '',
                id: cols[2]?.replace(/"/g, '') || '',
              };
            })
            .filter(student => student.name && student.lastName && student.id);
  
          console.log("Parsed Student IDs:", parsedData.map(student => student.id));
  
          const studentIdsFromCsv = parsedData.map(student => student.id.replace(/^0+/, '')); //Remove Leading Zeros from ID
          console.log("Parsed Student IDs after removing leading zeros:", studentIdsFromCsv);
  
          setErrorMessage(null);
  
          try {
            const studentDetailsPromises = studentIdsFromCsv.map(studentId =>
              API.get(`/auth/student/${studentId}`)
                .then(res => res.data)
                .catch(err => {
                  console.warn(`Student ID ${studentId} not found.`);
                  return null; // Return null for non-existent students
                })
            );
            const studentDetailsResponses = await Promise.all(studentDetailsPromises);
  
            const validStudentDetails = studentDetailsResponses.filter(student => student !== null);
            setStudents(validStudentDetails);
  
            if (validStudentDetails.length < studentIdsFromCsv.length) {
              setErrorMessage('Some student IDs were not found in the database, but valid students have been loaded.');
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

  //Create Team from Checkmarked Students
  const createTeam = async (e) => {
    e.preventDefault();
  
    if (!teamName.trim()) {
      alert('Team name cannot be empty');
      return;
    }
  
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await API.post('/team/create', {
        name: teamName,
        members: students.filter(student => selectedStudents.includes(student._id)),
      });
  
      //Clear All After Team Successfully Created
      alert('Team created successfully');
      setTeamName('');
      setSelectedStudents([]);
      setRoute('instructor-dashboard');
    } catch (err) {
      console.error('Error creating team:', err);
      alert(err.response?.data?.message || 'Failed to create team');
    }
  };
  

  //Selection of Students
  const handleStudentSelect = (e) => {
    const { value, checked } = e.target;
    setSelectedStudents((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((id) => id !== value)
    );
  };

  //Frontend
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
