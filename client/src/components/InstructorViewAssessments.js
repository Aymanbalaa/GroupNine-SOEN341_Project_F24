import React, { useEffect, useState } from 'react';
import API from '../api';

const InstructorViewAssessments = () => {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchAllAssessments = async () => {
      try {
        const res = await API.get('/peer-assessment/all-assessments');
        setAssessments(res.data);
      } catch (err) {
        console.error('Error fetching all assessments:', err.response?.data || err.message);
      }
    };
    fetchAllAssessments();
  }, []);

  return (
    <div>
      <h2>All Peer Assessments</h2>
      {assessments.map((assessment) => (
        <div key={assessment._id}>
          <h3>Evaluator: {assessment.studentId.firstname} {assessment.studentId.lastname}</h3>
          <p>Evaluated: {assessment.memberId.firstname} {assessment.memberId.lastname}</p>
          {Object.entries(assessment.ratings).map(([dimension, rating]) => (
            <p key={dimension}>{dimension}: {rating}</p>
          ))}
          {Object.entries(assessment.comments).map(([dimension, comment]) => (
            <p key={dimension}>{dimension} Comment: {comment}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default InstructorViewAssessments;
