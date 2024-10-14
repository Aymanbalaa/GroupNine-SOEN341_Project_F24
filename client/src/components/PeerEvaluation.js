import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PeerEvaluation.css'; // Import your CSS file

const PeerEvaluation = () => {
  const [teammates, setTeammates] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [selectedTeammate, setSelectedTeammate] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(1); // Default rating set to 1
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get('/api/team/myteam', { withCredentials: true });
        if (response.data) {
          setTeammates(response.data.members);
          setTeamName(response.data.name); // Get the team name
        }
      } catch (error) {
        console.error('Error fetching teammates:', error);
      }
    };

    fetchTeamData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    // Validate the input
    if (!selectedTeammate || !feedback) {
      setError('Please select a teammate and provide feedback.');
      return;
    }

    try {
      const evaluationData = {
        teammateId: selectedTeammate,
        feedback,
        rating,
      };

      // Submit the evaluation
      const response = await axios.post('/api/evaluate', evaluationData, { withCredentials: true });
      console.log('Evaluation submitted:', response.data);
      // Clear form after submission
      setSelectedTeammate('');
      setFeedback('');
      setRating(1);
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

        <label htmlFor="rating">Rating (1-5):</label>
        <select 
          id="rating" 
          value={rating} 
          onChange={(e) => setRating(e.target.value)}
          className="select-rating"
        >
          {[1, 2, 3, 4, 5].map((rate) => (
            <option key={rate} value={rate}>{rate}</option>
          ))}
        </select>

        <label htmlFor="feedback">Feedback:</label>
        <textarea 
          id="feedback" 
          value={feedback} 
          onChange={(e) => setFeedback(e.target.value)} 
          required
          className="feedback-textarea"
        ></textarea>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button">Submit Evaluation</button>
      </form>
    </div>
  );
};

export default PeerEvaluation;
