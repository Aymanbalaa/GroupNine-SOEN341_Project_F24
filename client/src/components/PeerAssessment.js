import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import API from '../api';
import './PeerAssessment.css';

const PeerAssessment = ({ setRoute }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await API.get('/auth/me');
        setUserId(userRes.data._id); // Set current user ID

        const teamRes = await API.get('/team/myteam');
        const filteredMembers = teamRes.data.members.filter(
          (member) => member._id !== userRes.data._id
        ); // Exclude self from team members list

        setTeamMembers(filteredMembers);
        setSelectedMemberId(filteredMembers.length ? filteredMembers[0]._id : ''); // Default to first team member
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleRatingChange = (dimension, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [selectedMemberId]: { ...(prevRatings[selectedMemberId] || {}), [dimension]: value },
    }));
  };

  const handleCommentChange = (dimension, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [selectedMemberId]: { ...(prevComments[selectedMemberId] || {}), [dimension]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      // Submit selected member's assessment only
      await API.post('/peer-assessment/submit', {
        ratings: ratings[selectedMemberId],
        comments: comments[selectedMemberId],
        memberId: selectedMemberId, // Pass selected member ID for evaluation
      });

      setSubmitted(true);
      alert('Peer assessment submitted successfully!');
    } catch (err) {
      console.error('Error submitting peer assessment:', err.response?.data || err.message);
      alert('Failed to submit assessment');
    }
  };

  if (submitted) {
    return (
      <div>
        <div>Thank you for your submission!</div>
        <button onClick={() => setSubmitted(false)}>Submit Another Assessment</button>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      <h2>Peer Assessment</h2>

      <label htmlFor="memberSelect">Select a team member to evaluate:</label>
      <select
        id="memberSelect"
        value={selectedMemberId}
        onChange={(e) => setSelectedMemberId(e.target.value)}
      >
        {teamMembers.map((member) => (
          <option key={member._id} value={member._id}>
            {member.firstname} {member.lastname}
          </option>
        ))}
      </select>

      {selectedMemberId && (
        <div className="member-assessment">
          <h3>Evaluating: {teamMembers.find((m) => m._id === selectedMemberId).firstname}{' '}
            {teamMembers.find((m) => m._id === selectedMemberId).lastname}</h3>
          
          {['Cooperation', 'Conceptual Contribution', 'Practical Contribution', 'Work Ethic'].map((dimension) => (
            <div key={dimension} className="assessment-dimension">
              <label>{dimension}:</label>
              <select
                value={ratings[selectedMemberId]?.[dimension] || ''}
                onChange={(e) => handleRatingChange(dimension, e.target.value)}
              >
                <option value="">Select Rating</option>
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
              <textarea
                placeholder={`Comments for ${dimension}`}
                value={comments[selectedMemberId]?.[dimension] || ''}
                onChange={(e) => handleCommentChange(dimension, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <button onClick={handleSubmit}>Submit Assessment</button>
    </div>
  );
};

PeerAssessment.propTypes = {
  setRoute: PropTypes.func.isRequired,
};

export default PeerAssessment;
