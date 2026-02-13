const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
    unique: true
  },
  isbn: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  author: {
    type: String,
    required: true
  },
  coAuthors: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String
  },
  department: {
    type: String,
    required: true
  },
  era: {
    type: String,
    enum: ['Ancient', 'Medieval', 'Modern']
  },
  origin: {
    type: String,
    enum: ['India', 'World']
  },
  publisher: {
    type: String,
    required: true
  },
  edition: {
    type: String
  },
  publicationYear: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  durationMinutes: {
    type: Number,
    default: function() {
      return this.totalPages * 2;
    }
  },
  audiobookDuration: {
    type: Number
  },
  format: [{
    type: String,
    enum: ['Physical', 'Ebook', 'Audiobook']
  }],
  description: {
    type: String,
    required: true
  },
  keyTopics: [{
    type: String
  }],
  keywords: [{
    type: String
  }],
  difficultyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  coverImage: {
    type: String
  },
  pdfUrl: {
    type: String
  },
  previewUrl: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Issued', 'Reserved'],
    default: 'Available'
  },
  totalCopies: {
    type: Number,
    required: true
  },
  availableCopies: {
    type: Number,
    required: true
  },
  shelfLocation: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  totalDownloads: {
    type: Number,
    default: 0
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Category prefix mapping
const categoryPrefixes = {
  'Epic Literature': 'LIT',
  'Ancient India': 'ANC',
  'Medieval India': 'MED',
  'Freedom Struggle': 'FRE',
  'Indian Philosophy': 'PHI',
  'World History': 'WOR'
};

// Auto-generate bookId before saving
bookSchema.pre('save', async function(next) {
  if (this.isNew) {
    const categoryPrefix = categoryPrefixes[this.category] || this.category.substring(0, 3).toUpperCase();
    const lastBook = await mongoose.model('Book').findOne({ bookId: new RegExp(`^${categoryPrefix}`) }).sort({ bookId: -1 });
    let nextNumber = 101;
    if (lastBook) {
      const lastNumber = parseInt(lastBook.bookId.substring(3));
      nextNumber = lastNumber + 1;
    }
    this.bookId = `${categoryPrefix}${nextNumber}`;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
