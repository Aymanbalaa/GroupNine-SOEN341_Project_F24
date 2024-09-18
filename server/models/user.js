// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  firstname: {
    type: String,
    required: true,
    unique: false
  },
  lastname: {
    type: String,
    required: true,
    unique: false
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'instructor'],
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
