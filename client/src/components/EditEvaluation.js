// src/components/EditEvaluation.js
import React, { useState, useEffect } from 'react';
import API from '../api';
import './EditEvaluation.css';

const EditEvaluation = ({ setRoute }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const res = await API.get('/peer-assessment/my-assessments');
        setEvaluations(res.data);
      } catch (err) {
        console.error('Error fetching evaluations:', err);
      }
    };

    fetchEvaluations();
  }, []);

  const handleEdit = (index) => setEditingIndex(index);

  const handleSave = async (evaluation) => {
    try {
      await API.put('/peer-assessment/update', evaluation);
      alert('Evaluation updated successfully');
      setEditingIndex(null);
    } catch (err) {
      console.error('Error updating evaluation:', err);
      alert('Failed to update evaluation');
    }
  };

  return (
    <div className='edit-evaluation'>
      <h2>Edit Evaluations</h2>
      {evaluations.map((evaluation, index) => (
        <div key={index} className='evaluation-card'>
          <h3>
            Evaluating: {evaluation.memberId.firstname}{' '}
            {evaluation.memberId.lastname}
          </h3>
          {editingIndex === index ? (
            <>
              {Object.keys(evaluation.ratings).map((dimension) => (
                <div key={dimension}>
                  <label htmlFor={`rating-${dimension}`}>{dimension}:</label>
                  <input
                    id={`rating-${dimension}`}
                    type='number'
                    value={evaluation.ratings[dimension]}
                    onChange={(e) => {
                      const updatedEvaluations = [...evaluations];
                      updatedEvaluations[index].ratings[dimension] =
                        e.target.value;
                      setEvaluations(updatedEvaluations);
                    }}
                  />
                  <textarea
                    id={`comment-${dimension}`}
                    value={evaluation.comments[dimension]}
                    onChange={(e) => {
                      const updatedEvaluations = [...evaluations];
                      updatedEvaluations[index].comments[dimension] =
                        e.target.value;
                      setEvaluations(updatedEvaluations);
                    }}
                  />
                </div>
              ))}
              <button onClick={() => handleSave(evaluation)}>Save</button>
            </>
          ) : (
            <>
              {Object.entries(evaluation.ratings).map(([dimension, rating]) => (
                <p key={dimension}>
                  <strong>{dimension}:</strong> {rating}
                </p>
              ))}
              <button onClick={() => handleEdit(index)}>Edit</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditEvaluation;
