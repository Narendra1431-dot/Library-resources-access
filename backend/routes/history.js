const express = require('express');
const jwt = require('jsonwebtoken');
const HistoryBook = require('../models/HistoryBook');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all history books with filters
router.get('/', async (req, res) => {
  try {
    const { search, era, origin, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') }
      ];
    }
    if (era) query.era = era;
    if (origin) query.origin = origin;
    if (category) query.category = category;

    const books = await HistoryBook.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get history book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await HistoryBook.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get related books
router.get('/:id/related', async (req, res) => {
  try {
    const book = await HistoryBook.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const related = await HistoryBook.find({
      category: book.category,
      _id: { $ne: book._id }
    }).limit(4);

    res.json(related);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Add new history book
router.post('/', verifyToken, upload.single('coverImage'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  try {
    const bookData = {
      ...req.body,
      coverImage: req.file ? req.file.path : ''
    };
    const book = new HistoryBook(bookData);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update history book
router.put('/:id', verifyToken, upload.single('coverImage'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  try {
    const updateData = { ...req.body };
    if (req.file) updateData.coverImage = req.file.path;

    const book = await HistoryBook.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete history book
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

  try {
    const book = await HistoryBook.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
