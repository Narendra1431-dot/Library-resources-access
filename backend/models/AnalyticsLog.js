const mongoose = require('mongoose');

const analyticsLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true }, // e.g., 'download', 'search', 'view'
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
  searchQuery: { type: String },
  department: { type: String },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String }
});

module.exports = mongoose.model('AnalyticsLog', analyticsLogSchema);
