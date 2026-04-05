const mongoose = require('mongoose');

const SurveyRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  landDetails: {
    location: String,
    size: String,
    address: String,
  },
  ownerName: String,
  ownerPhone: String,
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('SurveyRequest', SurveyRequestSchema);
