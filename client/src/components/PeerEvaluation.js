import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PeerEvaluation = () => {
  const [teammates, setTeammates] = useState([]);
  const [selectedTeammate, setSelectedTeammate] = useState('');
  const [feedback, setFeedback] = useState('');

  // Fetch the user's team and members when the component loads
  useEffect(() => {
    const fetchTeammates = async () => {
      try {
        // Fetch the current user's team members from the server
        const response = await axios.get('/api/team/myteam');
        setTeammates(response.data.members);  // Set the teammates from the team data
      } catch (error) {
        console.error('Error fetching teammates:', error);
      }
    };

    fetchTeammates();
  }, []);

  // Handler for submitting peer evaluations
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const evaluationData = {
        teammate: selectedTeammate,
        feedback: feedback,
      };

      // POST request to submit the peer evaluation
      await axios.post('/api/team/evaluate', evaluationData);

      // Clear the form after submission
      setSelectedTeammate('');
      setFeedback('');
      alert('Evaluation submitted successfully!');
    } catch (error) {
      console.error('Error submitting evaluation:', error);
    }
  };

  return (
    <div className="peer-evaluation">
      <h2>Peer Evaluation</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Teammate for Evaluation:</label>
          <select
            value={selectedTeammate}
            onChange={(e) => setSelectedTeammate(e.target.value)}
            required
          >
            <option value="">-- Select a teammate --</option>
            {teammates.map((teammate) => (
              <option key={teammate._id} value={teammate._id}>
                {teammate.firstname} {teammate.lastname}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            placeholder="Provide your feedback here"
          ></textarea>
        </div>

        <button type="submit">Submit Evaluation</button>
      </form>
    </div>
  );
};

export default PeerEvaluation;
