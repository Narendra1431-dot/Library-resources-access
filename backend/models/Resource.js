const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  subject: { type: String },
  isbn: { type: String },
  publicationYear: { type: Number },
  impactFactor: { type: Number },
  isOpenAccess: { type: Boolean, default: false },
  isPeerReviewed: { type: Boolean, default: true },
  department: { type: String },
  accessType: { type: String, enum: ['free', 'subscription'], default: 'free' },
  downloadLimit: { type: Number, default: 100 },
  downloads: { type: Number, default: 0 },
  fileUrl: { type: String }, // URL to PDF or file
  description: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
