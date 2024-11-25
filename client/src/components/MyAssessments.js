import React, { useState, useEffect } from 'react';
import API from '../api';
import AssessmentForm from './AssessmentForm'; // Import AssessmentForm component

const MyAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await API.get('/peer-assessment/my-assessments');
        setAssessments(res.data);
      } catch (err) {
        console.error(
          'Error fetching assessments:',
          err.response?.data || err.message,
        );
      }
    };
    fetchAssessments();
  }, []);

  const handleEdit = (assessment) => setEditing(assessment);

  const handleSubmit = async (updatedAssessment) => {
    try {
      await API.post('/peer-assessment/submit', updatedAssessment);
      setEditing(null);
      alert('Assessment updated successfully');
    } catch (err) {
      console.error(
        'Error updating assessment:',
        err.response?.data || err.message,
      );
      alert('Failed to update assessment');
    }
  };

  return (
    <div>
      <h2>My Assessments</h2>
      {assessments.map((assessment) => (
        <div key={assessment._id}>
          <h3>
            Evaluating: {assessment.memberId.firstname}{' '}
            {assessment.memberId.lastname}
          </h3>
          {editing?._id === assessment._id ? (
            <AssessmentForm assessment={editing} onSubmit={handleSubmit} />
          ) : (
            <button onClick={() => handleEdit(assessment)}>Edit</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyAssessments;
