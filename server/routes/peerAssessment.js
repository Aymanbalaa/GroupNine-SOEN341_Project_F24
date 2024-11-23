// routes/peerAssessment.js
const express = require('express');
const router = express.Router();
const PeerAssessment = require('../models/peerAssessment');
const Team = require('../models/Team');
const User = require('../models/user');
const { verifyToken } = require('./auth');
const sendEmail = require('../utils/email');

// Route to submit or update a peer assessment
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

       // Find the evaluated user
     const evaluatedUser = await User.findById(memberId);
     if (evaluatedUser) {
       // Send email notification to the evaluated user
       const emailSubject = 'You have been evaluated';
       const emailText = `You have received a new evaluation with updated ratings and comments.`;
       await sendEmail(evaluatedUser.email, emailSubject, emailText);
     }

      return res.json({ message: 'Peer assessment updated successfully' });
    }

    const assessment = new PeerAssessment({ studentId, memberId, ratings, comments });
    await assessment.save();

     // Find the evaluated user
     const evaluatedUser = await User.findById(memberId);
     if (evaluatedUser) {
       // Send email notification to the evaluated user
       const emailSubject = 'You have been evaluated';
       const emailText = `You have received a new evaluation with ratings and comments.`;
       await sendEmail(evaluatedUser.email, emailSubject, emailText);
     }

    res.status(201).json({ message: 'Peer assessment submitted successfully' });
  } catch (err) {
    console.error('Error submitting peer assessment:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update an existing assessment
router.put('/update', verifyToken, async (req, res) => {
  const { ratings, comments, memberId } = req.body;
  const studentId = req.user.userId;

  try {
    const assessment = await PeerAssessment.findOne({ studentId, memberId });
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    assessment.ratings = ratings;
    assessment.comments = comments;
    assessment.updatedAt = Date.now();

    await assessment.save();
    res.json({ message: 'Assessment updated successfully' });
  } catch (err) {
    console.error('Error updating assessment:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch all assessments for the logged-in student
router.get('/my-assessments', verifyToken, async (req, res) => {
  try {
    const assessments = await PeerAssessment.find({ studentId: req.user.userId })
      .populate('memberId', 'firstname lastname');
    res.json(assessments);
  } catch (err) {
    console.error('Error fetching assessments:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for instructors to view all assessments
router.get('/all-assessments', verifyToken, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const assessments = await PeerAssessment.find()
      .populate('studentId memberId', 'firstname lastname');
    res.json(assessments);
  } catch (err) {
    console.error('Error fetching all assessments:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for instructors to view a detailed view of assessments organized by team
router.get('/detailed-view', verifyToken, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    // Fetch all teams with members populated
    const teams = await Team.find().populate('members', 'firstname lastname');
    const detailedData = [];

    // Process each team
    for (const team of teams) {
      const teamData = {
        name: team.name,
        members: [],
      };

      // Process each member in the team
      for (const member of team.members) {
        // Use the /my-feedback route to get the feedback for each member
        const memberFeedback = await PeerAssessment.find({ memberId: member._id })
          .populate('studentId', 'firstname lastname');

        // Organize assessments for the member
        const assessmentDetails = memberFeedback.map((assessment) => ({
          evaluator: assessment.studentId
            ? `${assessment.studentId.firstname} ${assessment.studentId.lastname}`
            : 'Unknown Evaluator',
          cooperation: assessment.ratings.get('cooperation') || 0,
          conceptual: assessment.ratings.get('conceptual') || 0,
          practical: assessment.ratings.get('practical') || 0,
          workEthic: assessment.ratings.get('workEthic') || 0,
          averageAcrossAll: (
            ((assessment.ratings.get('cooperation') || 0) +
              (assessment.ratings.get('conceptual') || 0) +
              (assessment.ratings.get('practical') || 0) +
              (assessment.ratings.get('workEthic') || 0)) / 4
          ).toFixed(2),
          comment: assessment.comments?.get('general') || 'No comment provided',
        }));

        // Add member's assessment details to team
        teamData.members.push({
          student: `${member.firstname} ${member.lastname}`,
          assessments: assessmentDetails,
        });
      }

      detailedData.push(teamData);
    }

    res.json(detailedData);
  } catch (err) {
    console.error('Error fetching detailed view data:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route for instructors to view a summary view of assessments
router.get('/summary-view', verifyToken, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const assessments = await PeerAssessment.find()
      .populate({
        path: 'studentId',
        select: 'firstname lastname id',
      })
      .populate({
        path: 'memberId',
        select: 'firstname lastname id',
      })
      .lean();

    const teams = await Team.find().populate('members', 'id').lean();
    const teamMap = {};
    teams.forEach((team) => {
      team.members.forEach((member) => {
        if (member && member.id) {
          teamMap[member.id] = team.name;
        }
      });
    });

    const summaryData = {};
    assessments.forEach((assessment) => {
      if (!assessment.memberId || !assessment.studentId) return;

      const memberId = assessment.memberId.id;

      if (!summaryData[memberId]) {
        summaryData[memberId] = {
          studentId: memberId,
          firstname: assessment.memberId.firstname,
          lastname: assessment.memberId.lastname,
          team: teamMap[memberId] || 'No Team',
          cooperation: 0,
          conceptual: 0,
          practical: 0,
          workEthic: 0,
          responseCount: 0,
        };
      }

      summaryData[memberId].cooperation += assessment.ratings["Cooperation"] || 0;
      summaryData[memberId].conceptual += assessment.ratings["Conceptual Contribution"] || 0;
      summaryData[memberId].practical += assessment.ratings["Practical Contribution"] || 0;
      summaryData[memberId].workEthic += assessment.ratings["Work Ethic"] || 0;
      summaryData[memberId].responseCount += 1;
    });

    const summary = Object.values(summaryData).map((student) => ({
      studentId: student.studentId,
      lastname: student.lastname,
      firstname: student.firstname,
      team: student.team,
      cooperation: (student.cooperation / student.responseCount).toFixed(2),
      conceptual: (student.conceptual / student.responseCount).toFixed(2),
      practical: (student.practical / student.responseCount).toFixed(2),
      workEthic: (student.workEthic / student.responseCount).toFixed(2),
      average: (
        (student.cooperation +
          student.conceptual +
          student.practical +
          student.workEthic) /
        (4 * student.responseCount)
      ).toFixed(2),
      responseCount: student.responseCount,
    }));

    res.json(summary);
  } catch (err) {
    console.error('Error fetching summary view data:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route to fetch feedback for a student
router.get('/my-feedback', verifyToken, async (req, res) => {
  try {
    const feedback = await PeerAssessment.find({ memberId: req.user.userId })
      .select('ratings comments')
      .exec();
      
    res.json(feedback);
  } catch (err) {
    console.error('Error fetching anonymous feedback:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
