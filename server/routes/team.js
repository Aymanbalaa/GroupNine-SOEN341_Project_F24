const express = require('express');
const router = express.Router();
const Team = require('../models/Team'); 
const User = require('../models/user');

//Create New Team
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
    console.error('Error creating team:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




//Fetch All Teams
router.get('/all', async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'firstname lastname').populate('createdBy', 'firstname lastname');
    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

//Delete Team
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
