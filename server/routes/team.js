const express = require('express');
const Team = require('../models/Team');
const User = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Evaluation = require('../models/Evaluation'); // Import the Evaluation model

const mongoose = require('mongoose');


// Middleware to verify instructor
const verifyInstructor = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, '${process.env.JWT_SECRET_KEY}');  // Removed '${}'
    if (decoded.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a new team
router.post('/create', async (req, res) => {
  try {
    const { name, members } = req.body;

    //Check If All Fields Are Completed
    if (!name || !members || members.length === 0) {
      return res.status(400).json({ message: 'Team name and members are required' });
    }

    //Check if Users Are in the Database
    const foundMembers = await User.find({ _id: { $in: members }, role: 'student' });
    if (foundMembers.length !== members.length) {
      return res.status(400).json({ message: 'Some members were not found in the database' });
    }

    //Create New Team
    const newTeam = new Team({
      name,
      members,
    });

    await newTeam.save(); //Save in Database
    res.status(201).json(newTeam);
  } catch (err) {
    console.error('Error creating team:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});




//Fetch All Teams
router.get('/all', async (req, res) => {
    try {
      const teams = await Team.find().populate('members', 'firstname lastname'); // Populate members with firstname and lastname
      res.json(teams);
    } catch (err) {
      console.error('Error fetching teams:', err.message);
      res.status(500).send('Server error');
    }
  });
  
  
  
  
  router.get('/myteam', async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
  
      // Decode the JWT to get the user ID
      const decoded = jwt.verify(token, '${process.env.JWT_SECRET_KEY}');
      const userId = decoded.userId;
  
      // Find the team where the student is a member
      const team = await Team.findOne({ members: userId }).populate('members', 'firstname lastname');
      
      if (!team) {
        return res.status(404).json({ message: 'You are not assigned to any team' });
      }
  
      res.json(team);
    } catch (err) {
      console.error('Error fetching team details:', err.message);
      res.status(500).send('Server error');
    }
  });

// Submit peer evaluation
router.post('/evaluate', async (req, res) => {
  try {
    const { teammate, feedback } = req.body;
    const token = req.cookies.token;// JWT token from cookies

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Decode the token to get the evaluator's ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const evaluatorId = decoded.userId;

    // Save the evaluation (assuming you have an Evaluation model)
    const newEvaluation = new Evaluation({
      evaluator: evaluatorId,
      teammate,
      feedback,
    });

    await newEvaluation.save();
    res.status(201).json({ message: 'Evaluation submitted' });
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;