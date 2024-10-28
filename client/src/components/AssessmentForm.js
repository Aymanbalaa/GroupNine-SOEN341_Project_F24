import React, { useState } from 'react';

const AssessmentForm = ({ assessment, onSubmit }) => {
  const [ratings, setRatings] = useState(assessment.ratings || {});
  const [comments, setComments] = useState(assessment.comments || {});

  const handleSubmit = () => onSubmit({ ...assessment, ratings, comments });

  return (
    <div>
      {['Cooperation', 'Conceptual Contribution', 'Practical Contribution', 'Work Ethic'].map((dimension) => (
        <div key={dimension}>
          <label>{dimension}:</label>
          <select
            value={ratings[dimension] || ''}
            onChange={(e) => setRatings({ ...ratings, [dimension]: e.target.value })}
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          <textarea
            placeholder={`Comments for ${dimension}`}
            value={comments[dimension] || ''}
            onChange={(e) => setComments({ ...comments, [dimension]: e.target.value })}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default AssessmentForm;
