const express = require('express');
const jwt = require('jsonwebtoken');
const Submission = require('../models/Submission');
const multer = require('multer');

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

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Submit research contribution
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { title, type, description } = req.body;
    const submission = new Submission({
      userId: req.user.id,
      title,
      type,
      description,
      fileUrl: req.file ? req.file.path : null
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's submissions
router.get('/my', verifyToken, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all submissions
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const submissions = await Submission.find().populate('userId', 'name email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Review submission
router.put('/:id/review', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status, reviewComments } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status, reviewComments, reviewedBy: req.user.id, reviewedAt: new Date() },
      { new: true }
    );
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
