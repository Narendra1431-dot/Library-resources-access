const mongoose = require('mongoose');

const borrowHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Returned', 'Overdue', 'Active'],
    default: 'Active'
  },
  fineAmount: {
    type: Number,
    default: 0
  }
});

// Index for efficient queries
borrowHistorySchema.index({ userId: 1, status: 1 });
borrowHistorySchema.index({ bookId: 1, status: 1 });

module.exports = mongoose.model('BorrowHistory', borrowHistorySchema);
