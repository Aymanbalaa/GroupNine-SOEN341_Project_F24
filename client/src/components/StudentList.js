import React, { useState } from 'react';
import Papa from 'papaparse';

function StudentList() {
  const [studentData, setStudentData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); // To display errors

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true, // Assuming your CSV has headers
        complete: function(results) {
          console.log('Parsed Data:', results.data); // Log the parsed data
          
          // Map the parsed data to the required fields
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

  return (
    <div>
      <h1>Upload Student CSV</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} /> {/* File upload input */}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}

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
