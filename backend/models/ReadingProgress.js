const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  currentPage: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number,
    required: true
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastReadDate: {
    type: Date,
    default: Date.now
  },
  timeSpentMinutes: {
    type: Number,
    default: 0
  },
  bookmarks: [{
    page: Number,
    note: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  highlights: [{
    page: Number,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Compound index for efficient queries
readingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true });

// Update progress percentage before saving
readingProgressSchema.pre('save', function(next) {
  if (this.totalPages > 0) {
    this.progressPercentage = Math.round((this.currentPage / this.totalPages) * 100);
  }
  next();
});

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);
