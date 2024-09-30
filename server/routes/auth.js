// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
    
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 3600000 });
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in register route:', err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
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
    const token = jwt.sign(payload, '${process.env.JWT_SECRET_KEY}', { expiresIn: '1h' });
    
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 3600000 });
    
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error in login route:', err.message);
    res.status(500).send('Server error');
  }
});


router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, '${process.env.JWT_SECRET_KEY}');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user details:', err.message);
    res.status(500).send('Server error');
  }
});

// Get All Students
router.get('/all-students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('firstname lastname _id');
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err.message);
    res.status(500).send('Server error');
  }
});

router.get('/student/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await User.findOne({ id: studentId, role: 'student' }).select('firstname lastname _id');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    console.error('Error fetching student:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;