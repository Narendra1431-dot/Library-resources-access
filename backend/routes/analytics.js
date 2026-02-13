const express = require('express');
const jwt = require('jsonwebtoken');
const AnalyticsLog = require('../models/AnalyticsLog');
const Resource = require('../models/Resource');
const Download = require('../models/Download');
const User = require('../models/User');
const Submission = require('../models/Submission');

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

// Get total resources
router.get('/total-resources', verifyToken, async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments();
    res.json({ totalResources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get total downloads
router.get('/total-downloads', verifyToken, async (req, res) => {
  try {
    const totalDownloads = await Download.countDocuments();
    res.json({ totalDownloads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get total users
router.get('/total-users', verifyToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active users (users who accessed resources in last 30 days)
router.get('/active-users', verifyToken, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await Download.distinct('userId', { downloadedAt: { $gte: thirtyDaysAgo } });
    res.json({ activeUsers: activeUsers.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get department usage
router.get('/department-usage', verifyToken, async (req, res) => {
  try {
    const departmentUsage = await Download.aggregate([
      { $lookup: { from: 'resources', localField: 'resourceId', foreignField: '_id', as: 'resource' } },
      { $unwind: '$resource' },
      { $group: { _id: '$resource.department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(departmentUsage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get most accessed resources
router.get('/most-accessed', verifyToken, async (req, res) => {
  try {
    const mostAccessed = await Resource.find().sort({ downloads: -1 }).limit(10);
    res.json(mostAccessed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get peak usage times
router.get('/peak-usage', verifyToken, async (req, res) => {
  try {
    const peakUsage = await AnalyticsLog.aggregate([
      { $group: { _id: { $hour: '$timestamp' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(peakUsage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category distribution
router.get('/category-distribution', verifyToken, async (req, res) => {
  try {
    const categoryDistribution = await Resource.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(categoryDistribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user activity trends
router.get('/user-activity', verifyToken, async (req, res) => {
  try {
    const userActivity = await AnalyticsLog.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
      { $limit: 30 }
    ]);
    res.json(userActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resource trends (new additions over time)
router.get('/resource-trends', verifyToken, async (req, res) => {
  try {
    const resourceTrends = await Resource.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
      { $limit: 30 }
    ]);
    res.json(resourceTrends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get submission statistics
router.get('/submission-stats', verifyToken, async (req, res) => {
  try {
    const total = await Submission.countDocuments();
    const pending = await Submission.countDocuments({ status: 'pending' });
    const approved = await Submission.countDocuments({ status: 'approved' });
    const rejected = await Submission.countDocuments({ status: 'rejected' });

    res.json({ total, pending, approved, rejected });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
