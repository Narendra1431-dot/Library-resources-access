const mongoose = require('mongoose');

const readingSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  durationMinutes: { type: Number, required: true },
  sessionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReadingSession', readingSessionSchema);
