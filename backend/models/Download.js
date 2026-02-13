const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  downloadedAt: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  watermark: { type: String } // User ID or other watermark info
});

module.exports = mongoose.model('Download', downloadSchema);
