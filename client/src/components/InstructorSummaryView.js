// src/components/assessments/InstructorSummaryView.js

import React, { useState, useEffect } from 'react';
import API from '../api';
import './InstructorSummaryView.css';

const InstructorSummaryView = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const res = await API.get('/peer-assessment/all-assessments');
        const assessments = res.data;

        // Summarize data by student
        const summaryMap = {};
        assessments.forEach((assessment) => {
          if (!assessment.memberId || !assessment.studentId) return; // Skip if data is missing

          const memberId = assessment.memberId._id;

          // Initialize student entry if not present
          if (!summaryMap[memberId]) {
            summaryMap[memberId] = {
              studentId: assessment.memberId._id,
              firstname: assessment.memberId.firstname,
              lastname: assessment.memberId.lastname,
              team: 'TBD', // Placeholder if team data is not available
              cooperation: 0,
              conceptual: 0,
              practical: 0,
              workEthic: 0,
              responseCount: 0,
            };
          }

          // Accumulate ratings and increment response count
          summaryMap[memberId].cooperation += assessment.ratings["Cooperation"] || 0;
          summaryMap[memberId].conceptual += assessment.ratings["Conceptual Contribution"] || 0;
          summaryMap[memberId].practical += assessment.ratings["Practical Contribution"] || 0;
          summaryMap[memberId].workEthic += assessment.ratings["Work Ethic"] || 0;
          summaryMap[memberId].responseCount += 1;
        });

        // Calculate averages for each student and format data for display
        const summaryArray = Object.values(summaryMap).map((student) => ({
          studentId: student.studentId,
          lastname: student.lastname,
          firstname: student.firstname,
          team: student.team,
          cooperation: (student.cooperation / student.responseCount).toFixed(2),
          conceptual: (student.conceptual / student.responseCount).toFixed(2),
          practical: (student.practical / student.responseCount).toFixed(2),
          workEthic: (student.workEthic / student.responseCount).toFixed(2),
          average: (
            (student.cooperation +
              student.conceptual +
              student.practical +
              student.workEthic) /
            (4 * student.responseCount)
          ).toFixed(2),
          responseCount: student.responseCount,
        }));

        setSummaryData(summaryArray);
      } catch (err) {
        console.error('Error fetching summary data:', err.message);
        setError('Failed to load summary data');
      }
    };

    fetchSummaryData();
  }, []);

  return (
    <div className="summary-view-container">
      <h2>Summary of Results</h2>
      {error && <p className="error-message">{error}</p>}
      {summaryData.length > 0 ? (
        <table className="summary-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Team</th>
              <th>Cooperation</th>
              <th>Conceptual Contribution</th>
              <th>Practical Contribution</th>
              <th>Work Ethic</th>
              <th>Average</th>
              <th>Peers who responded</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((student, index) => (
              <tr key={index}>
                <td>{student.studentId}</td>
                <td>{student.lastname}</td>
                <td>{student.firstname}</td>
                <td>{student.team}</td>
                <td>{student.cooperation}</td>
                <td>{student.conceptual}</td>
                <td>{student.practical}</td>
                <td>{student.workEthic}</td>
                <td>{student.average}</td>
                <td>{student.responseCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No summary data available.</p>
      )}
    </div>
  );
};

export default InstructorSummaryView;
