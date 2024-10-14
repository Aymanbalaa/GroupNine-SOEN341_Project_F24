const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teammate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);
