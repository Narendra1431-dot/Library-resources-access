const mongoose = require('mongoose');

const historyBookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  era: {
    type: String,
    enum: ['Ancient', 'Medieval', 'Modern'],
    required: true
  },
  origin: {
    type: String,
    enum: ['India', 'World'],
    required: true
  },
  category: {
    type: String,
    enum: ['Epic Literature', 'Ancient India', 'Medieval India', 'Freedom Struggle', 'Indian Philosophy', 'World History'],
    required: true
  },
  language: {
    type: String,
    required: true,
    trim: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  downloads: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HistoryBook', historyBookSchema);
