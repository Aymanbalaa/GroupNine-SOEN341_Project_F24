const mongoose = require('mongoose');

const PeerAssessmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ratings: {
    type: Map,
    of: Number, // Each dimension with a rating
    required: true,
  },
  comments: {
    type: Map,
    of: String, // Optional comments for each dimension
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('PeerAssessment', PeerAssessmentSchema);
