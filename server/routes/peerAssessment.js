const express = require('express');
const router = express.Router();
const PeerAssessment = require('../models/peerAssessment');
const { verifyToken } = require('../routes/auth'); // Correct import for verifyToken

// Define peer assessment routes using verifyToken middleware
router.post('/submit', verifyToken, async (req, res) => {
  const { ratings, comments, memberId } = req.body;
  const studentId = req.user.userId;

  try {
    const existingAssessment = await PeerAssessment.findOne({ studentId, memberId });
    
    if (existingAssessment) {
      existingAssessment.ratings = ratings;
      existingAssessment.comments = comments;
      existingAssessment.updatedAt = Date.now();
      await existingAssessment.save();
      return res.json({ message: 'Peer assessment updated successfully' });
    }

    const assessment = new PeerAssessment({ studentId, memberId, ratings, comments });
    await assessment.save();
    res.status(201).json({ message: 'Peer assessment submitted successfully' });
  } catch (err) {
    console.error('Error submitting peer assessment:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-assessments', verifyToken, async (req, res) => {
    try {
      const assessments = await PeerAssessment.find({ studentId: req.user.userId }).populate('memberId', 'firstname lastname');
      res.json(assessments);
    } catch (err) {
      console.error('Error fetching assessments:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // GET route for instructors to view all assessments
  router.get('/all-assessments', verifyToken, async (req, res) => {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }
  
    try {
      const assessments = await PeerAssessment.find().populate('studentId memberId', 'firstname lastname');
      res.json(assessments);
    } catch (err) {
      console.error('Error fetching all assessments:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
