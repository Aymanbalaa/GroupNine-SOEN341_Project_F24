import React, { useState } from 'react';

function StudentList() {
  const [studentData, setStudentData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); // To display errors

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const contents = e.target.result;

        try {
          // Basic CSV parsing (you might want to use a library like Papa Parse for more robust handling)
          const rows = contents.split('\n');
          const parsedData = rows
            .slice(1) // Skip header row
            .map(row => {
              const cols = row.split(',');
              return {
                name: cols[0].replace(/"/g, ''),
                lastName: cols[1].replace(/"/g, ''),
                id: cols[2].replace(/"/g, ''),
              };
            })
            .filter(student => student.name && student.lastName && student.id); // Filter out invalid rows

          setStudentData(parsedData);
          setErrorMessage(null); // Clear any previous errors
        } catch (error) {
          console.error('Error parsing CSV:', error);
          setErrorMessage('Invalid CSV format. Please check your file.');
          setStudentData([]); // Clear the table in case of errors
        }
      };

      reader.readAsText(file);
    } else {
      setErrorMessage("Please select a CSV file.");
      setStudentData([]);
    }
  };

  return (
    <div>
      <h1>Upload Student CSV</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

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