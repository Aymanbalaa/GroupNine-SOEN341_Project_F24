// src/components/assessments/InstructorSummaryView.js

import React, { useState, useEffect } from 'react';
import API from '../api';

const InstructorSummaryView = () => {
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const res = await API.get('/peer-assessment/summary-view');
        setSummaryData(res.data);
      } catch (err) {
        console.error('Error fetching summary view:', err);
      }
    };
    fetchSummaryData();
  }, []);

  return (
    <div>
      <h2>Summary View of Assessments</h2>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Team</th>
            <th>Cooperation</th>
            <th>Conceptual</th>
            <th>Practical</th>
            <th>Work Ethic</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.firstname} {student.lastname}</td>
              <td>{student.team}</td>
              <td>{student.cooperation}</td>
              <td>{student.conceptual}</td>
              <td>{student.practical}</td>
              <td>{student.workEthic}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorSummaryView;
