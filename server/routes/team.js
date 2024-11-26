const express = require('express');
const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const User = require('../models/user');

const router = express.Router();

// Middleware to verify instructor
const verifyInstructor = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, '${process.env.JWT_SECRET_KEY}'); // Removed '${}'
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

    // Check if all fields are completed
    if (!name || !members || members.length === 0) {
      return res.status(400).json({ message: 'Team name and members are required' });
    }

    // Check if users are in the database
    const foundMembers = await User.find({ _id: { $in: members }, role: 'student' });
    if (foundMembers.length !== members.length) {
      return res.status(400).json({ message: 'Some members were not found in the database' });
    }

    // Create new team
    const newTeam = new Team({
      name,
      members,
    });

    await newTeam.save();
    return res.status(201).json(newTeam); // Return newly created team
  } catch (err) {
    console.error('Error creating team:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all teams
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
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Decode the JWT to get the user ID
    const decoded = jwt.verify(token, '${process.env.JWT_SECRET_KEY}');
    const { userId } = decoded;

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

module.exports = router;
