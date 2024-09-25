import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios'; // For making API calls

function StudentList() {
  const [studentData, setStudentData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); // To display errors
  const [teamName, setTeamName] = useState(''); // New state for team name

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true, // Assuming your CSV has headers
        complete: function(results) {
          const parsedData = results.data.map(row => ({
            name: row['firstname'] || '', // Use 'firstname' from the CSV
            lastName: row['lastname'] || '', // Use 'lastname' from the CSV
            id: row['id'] || '' // Use 'id' from the CSV
          }));

          setStudentData(parsedData);
          setErrorMessage(null); // Clear any previous errors
        },
        error: function(error) {
          console.error('Error parsing CSV:', error);
          setErrorMessage('Invalid CSV format. Please check your file.');
          setStudentData([]); // Clear the table in case of errors
        }
      });
    } else {
      setErrorMessage("Please select a CSV file.");
      setStudentData([]);
    }
  };

  const saveTeam = async () => {
    if (!teamName.trim()) {
      alert('Team name cannot be empty');
      return;
    }

    try {
      // Format the student data into the structure the backend expects
      const members = studentData.map(student => ({
        firstname: student.name,
        lastname: student.lastName,
        id: student.id
      }));

      const response = await axios.post('/team/create', {
        name: teamName,
        members: members,
      });

      alert('Team saved successfully');
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team.');
    }
  };

  return (
    <div>
      <h1>Upload Student CSV</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} /> {/* File upload input */}
      
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
      
      <input 
        type="text" 
        placeholder="Enter Team Name" 
        value={teamName} 
        onChange={(e) => setTeamName(e.target.value)} 
      />
      
      <button onClick={saveTeam}>Save Team</button> {/* Save team button */}
      
      {studentData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Name</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.lastName}</td>
                <td>{student.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No student data available.</p>
      )}
    </div>
  );
}

export default StudentList;
