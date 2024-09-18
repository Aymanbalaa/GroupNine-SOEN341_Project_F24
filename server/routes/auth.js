// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure User is imported

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, firstname, lastname, id, password, role } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let userid = await User.findOne({ id });
    if (userid) {
      return res.status(400).json({ message: 'ID already exists' });
    }

    user = new User({
      username,
      firstname,
      lastname,
      id,
      password: await bcrypt.hash(password, 10),
      role
    });

    await user.save();

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, '${process.env.JWT_SECRET_KEY}', { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    console.error('Error in register route:', err.message);
    res.status(500).send('Server error');
  }
});
// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    // Send back user information including firstname, lastname, and id
    res.json({ 
      token, 
      user: { 
        username: user.username,
        firstname: user.firstname, 
        lastname: user.lastname,
        id: user.id,  
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Error in login route:', err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;