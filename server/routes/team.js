const express = require('express');
const Team = require('../models/Team');
const User = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify instructor
const verifyInstructor = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const decoded = jwt.verify(token, '${process.env.JWT_SECRET_KEY}');
  if (decoded.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  req.user = decoded;
  next();
};

// Create a new team
router.post('/create', verifyInstructor, async (req, res) => {
    const { name, members } = req.body;
  
    // Ensure that the team name is not null or empty
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Team name is required' });
    }
  
    try {
      // Check if a team with the same name already exists
      const existingTeam = await Team.findOne({ name });
      if (existingTeam) {
        return res.status(400).json({ message: 'Team name already exists' });
      }
  
      const team = new Team({
        name,
        members,
        createdBy: req.user.userId,
      });
  
      await team.save();
      res.status(201).json({ message: 'Team created successfully', team });
    } catch (err) {
      console.error('Error creating team:', err.message);
      res.status(500).send('Server error');
    }
  });

  // Get the team of the logged-in student
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

  // Get all teams
router.get('/all', async (req, res) => {
    try {
      const teams = await Team.find().populate('members', 'firstname lastname'); // Populate members with firstname and lastname
      res.json(teams);
    } catch (err) {
      console.error('Error fetching teams:', err.message);
      res.status(500).send('Server error');
    }
  });
  
  
  
  

module.exports = router;
