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
    type: Number,
    required: true,
    unique: true,
    match: [/^\d{9}$/, 'ID must be a 9-digit number']
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

// Check if the model already exists before compiling it
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
