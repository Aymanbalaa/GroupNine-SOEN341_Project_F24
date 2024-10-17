import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import './PeerEvaluation.css'; // Import your CSS file

const PeerEvaluation = ({ team }) => {
  const [selectedTeammate, setSelectedTeammate] = useState('');
  const [conceptualRating, setConceptualRating] = useState(1);
  const [practicalRating, setPracticalRating] = useState(1);
  const [workEthicRating, setWorkEthicRating] = useState(1);
  const [conceptualFeedback, setConceptualFeedback] = useState('');
  const [practicalFeedback, setPracticalFeedback] = useState('');
  const [workEthicFeedback, setWorkEthicFeedback] = useState('');
  const [error, setError] = useState('');

  // Ensure team and members are defined
  const teammates = team?.members || [];
  const teamName = team?.name || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    // Validate the input
    if (!selectedTeammate) {
      setError('Please select a teammate.');
      return;
    }

    try {
      const evaluationData = {
        teammateId: selectedTeammate,
        conceptualRating,
        practicalRating,
        workEthicRating,
        conceptualFeedback,
        practicalFeedback,
        workEthicFeedback,
      };

      // Submit the evaluation
      const response = await axios.post('/api/evaluate', evaluationData, { withCredentials: true });
      console.log('Evaluation submitted:', response.data);
      
      // Clear form after submission
      setSelectedTeammate('');
      setConceptualRating(1);
      setPracticalRating(1);
      setWorkEthicRating(1);
      setConceptualFeedback('');
      setPracticalFeedback('');
      setWorkEthicFeedback('');
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      setError('Failed to submit evaluation. Please try again.');
    }
  };

  return (
    <div className="peer-evaluation-container">
      <h2 className="title">Peer Evaluation</h2>

      {teamName && <h3 className="team-name">Team: {teamName}</h3>}
      {teammates.length > 0 ? (
        <ul className="teammates-list">
          <h4>Team Members:</h4>
          {teammates.map(teammate => (
            <li key={teammate._id} className="teammate-item">
              {teammate.firstname} {teammate.lastname}
            </li>
          ))}
        </ul>
      ) : (
        <p>No teammates found.</p>
      )}

      <form onSubmit={handleSubmit} className="evaluation-form">
        <label htmlFor="teammate">Select a Teammate to Evaluate:</label>
        <select 
          id="teammate" 
          value={selectedTeammate} 
          onChange={(e) => setSelectedTeammate(e.target.value)}
          required
          className="select-teammate"
        >
          <option value="">Select a teammate</option>
          {teammates.map(teammate => (
            <option key={teammate._id} value={teammate._id}>
              {teammate.firstname} {teammate.lastname}
            </option>
          ))}
        </select>

        <h4>Conceptual Contribution</h4>
        <select 
          value={conceptualRating} 
          onChange={(e) => setConceptualRating(e.target.value)}
          className="select-rating"
        >
          {[1, 2, 3, 4, 5].map((rate) => (
            <option key={rate} value={rate}>{rate}</option>
          ))}
        </select>
        <textarea
          placeholder="comments on conceptual contribution"
          value={conceptualFeedback}
          onChange={(e) => setConceptualFeedback(e.target.value)}
          className="feedback-textarea"
        ></textarea>

        <h4>Practical Contribution</h4>
        <select 
          value={practicalRating} 
          onChange={(e) => setPracticalRating(e.target.value)}
          className="select-rating"
        >
          {[1, 2, 3, 4, 5].map((rate) => (
            <option key={rate} value={rate}>{rate}</option>
          ))}
        </select>
        <textarea
          placeholder="comments on practical contribution"
          value={practicalFeedback}
          onChange={(e) => setPracticalFeedback(e.target.value)}
          className="feedback-textarea"
        ></textarea>

        <h4>Work Ethic</h4>
        <select 
          value={workEthicRating} 
          onChange={(e) => setWorkEthicRating(e.target.value)}
          className="select-rating"
        >
          {[1, 2, 3, 4, 5].map((rate) => (
            <option key={rate} value={rate}>{rate}</option>
          ))}
        </select>
        <textarea
          placeholder="comments on work ethic"
          value={workEthicFeedback}
          onChange={(e) => setWorkEthicFeedback(e.target.value)}
          className="feedback-textarea"
        ></textarea>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button">Submit Evaluation</button>
      </form>
    </div>
  );
};

export default PeerEvaluation;
