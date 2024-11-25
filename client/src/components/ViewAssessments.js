// src/components/ViewAssessments.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import './ViewAssessments.css';

const ViewAssessments = ({ role, setRoute }) => {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const endpoint =
          role === 'instructor'
            ? '/peer-assessment/all-assessments'
            : '/peer-assessment/my-assessments';
        const res = await API.get(endpoint);
        setAssessments(res.data);
      } catch (err) {
        console.error('Error fetching assessments:', err);
      }
    };

    fetchAssessments();
  }, [role]);

  return (
    <div>
      <h2>Peer Assessments</h2>
      {assessments.length > 0 ? (
        assessments.map((assessment, index) => (
          <div key={index} className='assessment-card'>
            <h4>
              Assessment for: {assessment.memberId.firstname}{' '}
              {assessment.memberId.lastname}
            </h4>
            {Object.keys(assessment.ratings).map((dimension) => (
              <p key={dimension}>
                <strong>{dimension}:</strong> {assessment.ratings[dimension]}{' '}
                <br />
                <strong>Comments:</strong> {assessment.comments[dimension]}
              </p>
            ))}
          </div>
        ))
      ) : (
        <p>No assessments found.</p>
      )}
    </div>
  );
};

export default ViewAssessments;
