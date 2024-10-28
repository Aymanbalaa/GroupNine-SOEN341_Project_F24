// src/components/AnonymousFeedback.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import './AnonymousFeedback.css';

const AnonymousFeedback = ({ setRoute }) => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await API.get('/peer-assessment/my-feedback');
        setFeedback(res.data);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="feedback-container">
      <h2>Anonymous Feedback</h2>
      {feedback.length > 0 ? (
        feedback.map((item, index) => (
          <div key={index} className="feedback-card">
            {Object.entries(item.ratings).map(([dimension, rating]) => (
              <p key={dimension}><strong>{dimension}:</strong> {rating}</p>
            ))}
            {Object.entries(item.comments).map(([dimension, comment]) => (
              <p key={dimension}><strong>{dimension} Comment:</strong> {comment}</p>
            ))}
          </div>
        ))
      ) : (
        <p>No feedback received.</p>
      )}
    </div>
  );
};

export default AnonymousFeedback;
