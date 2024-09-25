const express = require('express');
const router = express.Router();
const Team = require('../models/Team'); // Assuming Team is your Mongoose model
const User = require('../models/user'); // Assuming User is your user model

// Create a new team
router.post('/create', async (req, res) => {
  try {
    const { name, members } = req.body;  // No need to extract `createdBy` now

    // Check if team name and members are provided (no need for createdBy)
    if (!name || !members || members.length === 0) {
      return res.status(400).json({ message: 'Team name and members are required' });
    }

    // Optionally validate that all members exist in the database
    const foundMembers = await User.find({ _id: { $in: members }, role: 'student' });
    if (foundMembers.length !== members.length) {
      return res.status(400).json({ message: 'Some members were not found in the database' });
    }

    // Create a new team (no need to include `createdBy`)
    const newTeam = new Team({
      name,
      members,
    });

    await newTeam.save(); // Save the new team to the database
    res.status(201).json(newTeam);  // Respond with the created team
  } catch (err) {
    console.error('Error creating team:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




// Fetch all teams
router.get('/all', async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'firstname lastname').populate('createdBy', 'firstname lastname');
    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a team
router.delete('/:teamId', async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.remove();
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    console.error('Error deleting team:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
