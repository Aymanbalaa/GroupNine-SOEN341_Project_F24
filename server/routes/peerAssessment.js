// routes/peerAssessment.js
const express = require('express');
const router = express.Router();
const PeerAssessment = require('../models/peerAssessment');
const { verifyToken } = require('../routes/auth'); // Adjust import if needed

router.get('/detailed-view', verifyToken, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const assessments = await PeerAssessment.find()
      .populate('studentId', 'firstname lastname')
      .populate('memberId', 'firstname lastname team'); // Attempt to populate `team` if it exists

    // Group assessments by team
    const detailedData = assessments.reduce((acc, assessment) => {
      // Check if `memberId` and `memberId.team` are defined
      const teamName = assessment.memberId && assessment.memberId.team ? assessment.memberId.team : 'No Team';

      if (!acc[teamName]) {
        acc[teamName] = {
          name: teamName,
          members: [],
        };
      }
      
      // Only add member details if `memberId` is defined
      if (assessment.memberId) {
        acc[teamName].members.push({
          firstname: assessment.memberId.firstname,
          lastname: assessment.memberId.lastname,
          cooperation: assessment.ratings.get('cooperation') || 0,
          conceptual: assessment.ratings.get('conceptual') || 0,
          practical: assessment.ratings.get('practical') || 0,
          workEthic: assessment.ratings.get('workEthic') || 0,
          averageAcrossAll: (
            (assessment.ratings.get('cooperation') || 0 +
             assessment.ratings.get('conceptual') || 0 +
             assessment.ratings.get('practical') || 0 +
             assessment.ratings.get('workEthic') || 0) / 4
          ).toFixed(2),
          comment: assessment.comments.get('general') || 'No comment provided',
        });
      }
      return acc;
    }, {});

    res.json(Object.values(detailedData));
  } catch (err) {
    console.error('Error fetching detailed view data:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});



// Route for summary view of assessments by student
router.get('/summary-view', verifyToken, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const assessments = await PeerAssessment.find()
      .populate('studentId', 'firstname lastname');

    // Calculate averages for each student
    const summaryData = assessments.reduce((acc, assessment) => {
      const studentId = assessment.memberId._id;
      if (!acc[studentId]) {
        acc[studentId] = {
          studentId,
          firstname: assessment.memberId.firstname,
          lastname: assessment.memberId.lastname,
          cooperation: 0,
          conceptual: 0,
          practical: 0,
          workEthic: 0,
          count: 0,
        };
      }

      acc[studentId].cooperation += assessment.ratings.get('cooperation') || 0;
      acc[studentId].conceptual += assessment.ratings.get('conceptual') || 0;
      acc[studentId].practical += assessment.ratings.get('practical') || 0;
      acc[studentId].workEthic += assessment.ratings.get('workEthic') || 0;
      acc[studentId].count += 1;

      return acc;
    }, {});

    // Calculate averages
    const summary = Object.values(summaryData).map((student) => ({
      studentId: student.studentId,
      firstname: student.firstname,
      lastname: student.lastname,
      cooperation: (student.cooperation / student.count).toFixed(2),
      conceptual: (student.conceptual / student.count).toFixed(2),
      practical: (student.practical / student.count).toFixed(2),
      workEthic: (student.workEthic / student.count).toFixed(2),
      average: (
        (student.cooperation +
          student.conceptual +
          student.practical +
          student.workEthic) /
        (4 * student.count)
      ).toFixed(2),
    }));

    res.json(summary);
  } catch (err) {
    console.error('Error fetching summary view data:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
