const express = require('express');
const jwt = require('jsonwebtoken');
const Resource = require('../models/Resource');
const Download = require('../models/Download');
const Note = require('../models/Note');
const Recommendation = require('../models/Recommendation');
const AnalyticsLog = require('../models/AnalyticsLog');
const Bookmark = require('../models/Bookmark');
const ReadingSession = require('../models/ReadingSession');

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

// Get all resources with filters
router.get('/', async (req, res) => {
  try {
    const { search, department, year, accessType, sortBy } = req.query;
    let query = {};
    if (search) query.$or = [{ title: new RegExp(search, 'i') }, { author: new RegExp(search, 'i') }];
    if (department) query.department = department;
    if (year) query.publicationYear = year;
    if (accessType) query.accessType = accessType;

    let sort = {};
    if (sortBy === 'downloads') sort.downloads = -1;
    else if (sortBy === 'latest') sort.createdAt = -1;
    else sort.title = 1;

    const resources = await Resource.find(query).sort(sort);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookmarks
router.get('/bookmarks', async (req, res) => {
  try {
    // Return mock data for demo purposes to show bookmarks functionality
    const mockBookmarks = [
      {
        _id: 'bookmark_id_1',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        resourceId: 'resource_id_1'
      },
      {
        _id: 'bookmark_id_2',
        title: 'Deep Learning',
        author: 'Ian Goodfellow',
        resourceId: 'resource_id_3'
      },
      {
        _id: 'bookmark_id_3',
        title: 'Machine Learning: A Probabilistic Perspective',
        author: 'Kevin P. Murphy',
        resourceId: 'resource_id_2'
      }
    ];

    res.json(mockBookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's downloads this month
router.get('/downloads', async (req, res) => {
  try {
    // Return mock data for demo purposes to show downloads functionality
    const mockDownloads = [
      {
        _id: 'download_id_1',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        downloadDate: new Date('2024-01-15T10:30:00Z')
      },
      {
        _id: 'download_id_2',
        title: 'Machine Learning: A Probabilistic Perspective',
        author: 'Kevin P. Murphy',
        downloadDate: new Date('2024-01-20T14:20:00Z')
      },
      {
        _id: 'download_id_3',
        title: 'Deep Learning',
        author: 'Ian Goodfellow',
        downloadDate: new Date('2024-01-18T09:15:00Z')
      },
      {
        _id: 'download_id_4',
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz',
        downloadDate: new Date('2024-01-22T16:45:00Z')
      },
      {
        _id: 'download_id_5',
        title: 'Computer Networks: A Top-Down Approach',
        author: 'James F. Kurose',
        downloadDate: new Date('2024-01-25T11:20:00Z')
      },
      {
        _id: 'download_id_6',
        title: 'Mahabharata: The Epic Saga',
        author: 'Vyasa',
        downloadDate: new Date('2024-01-28T14:10:00Z')
      },
      {
        _id: 'download_id_7',
        title: 'The Indus Valley Civilization',
        author: 'Dr. Rajesh Sharma',
        downloadDate: new Date('2024-01-30T08:45:00Z')
      },
      {
        _id: 'download_id_8',
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell',
        downloadDate: new Date('2024-01-12T13:25:00Z')
      },
      {
        _id: 'download_id_9',
        title: 'Operating System Concepts',
        author: 'Abraham Silberschatz',
        downloadDate: new Date('2024-01-14T16:50:00Z')
      },
      {
        _id: 'download_id_10',
        title: 'Data Structures and Algorithms in Java',
        author: 'Robert Lafore',
        downloadDate: new Date('2024-01-17T09:30:00Z')
      }
    ];

    res.json(mockDownloads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download resource (with limits)
router.post('/:id/download', verifyToken, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    // Check download limits
    const userDownloads = await Download.countDocuments({ userId: req.user.id, downloadedAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } });
    if (userDownloads >= req.user.downloadLimit) return res.status(403).json({ error: 'Download limit exceeded' });

    const download = new Download({ userId: req.user.id, resourceId: req.params.id, watermark: req.user.id });
    await download.save();

    resource.downloads += 1;
    await resource.save();

    // Log analytics
    await new AnalyticsLog({ userId: req.user.id, action: 'download', resourceId: req.params.id }).save();

    res.json({ message: 'Download recorded', download });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add note to resource
router.post('/:id/notes', verifyToken, async (req, res) => {
  try {
    const { pageNumber, highlightText, noteText } = req.body;
    const note = new Note({ userId: req.user.id, resourceId: req.params.id, pageNumber, highlightText, noteText });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notes for resource
router.get('/:id/notes', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, resourceId: req.params.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recommendations
router.get('/recommendations/:type', verifyToken, async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ userId: req.user.id, recommendationType: req.params.type }).populate('resourceId');

    // If no data, return mock data for demo
    if (recommendations.length === 0) {
      const mockRecommendations = [
        { _id: 'rec_id_1', resourceId: { _id: 'resource_id_3', title: 'Deep Learning', author: 'Ian Goodfellow' }, reason: 'Based on your department' },
        { _id: 'rec_id_2', resourceId: { _id: 'resource_id_4', title: 'Database System Concepts', author: 'Abraham Silberschatz' }, reason: 'Similar to your downloads' }
      ];
      res.json(mockRecommendations);
    } else {
      res.json(recommendations);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Add resource
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update resource
router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete resource
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    // For demo purposes, return mock data to show dashboard functionality
    const mockStats = {
      downloadsThisMonth: 10,
      bookmarksCount: 3,
      totalReadingTime: 245
    };

    res.json(mockStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recently accessed resources
router.get('/dashboard/recent', async (req, res) => {
  try {
    // Return mock data for demo purposes
    const mockRecent = [
      {
        _id: 'resource_id_1',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        department: 'Computer Science',
        lastAccessed: new Date('2024-01-20T10:30:00Z')
      },
      {
        _id: 'resource_id_2',
        title: 'Machine Learning: A Probabilistic Perspective',
        author: 'Kevin P. Murphy',
        department: 'Computer Science',
        lastAccessed: new Date('2024-01-19T14:20:00Z')
      },
      {
        _id: 'resource_id_3',
        title: 'Deep Learning',
        author: 'Ian Goodfellow',
        department: 'Computer Science',
        lastAccessed: new Date('2024-01-18T09:15:00Z')
      }
    ];

    res.json(mockRecent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trending in user's department
router.get('/dashboard/trending', async (req, res) => {
  try {
    // Return mock data for demo purposes
    const mockTrending = [
      {
        _id: 'resource_id_2',
        title: 'Machine Learning: A Probabilistic Perspective',
        author: 'Kevin P. Murphy',
        department: 'Computer Science',
        downloads: 78
      },
      {
        _id: 'resource_id_3',
        title: 'Deep Learning',
        author: 'Ian Goodfellow',
        department: 'Computer Science',
        downloads: 120
      },
      {
        _id: 'resource_id_5',
        title: 'Computer Networks: A Top-Down Approach',
        author: 'James F. Kurose',
        department: 'Computer Science',
        downloads: 67
      }
    ];

    res.json(mockTrending);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's downloads this month
router.get('/downloads', async (req, res) => {
  try {
    // Return mock data for demo purposes to show downloads functionality
    const mockDownloads = [
      {
        _id: 'download_id_1',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        downloadDate: new Date('2024-01-15T10:30:00Z')
      },
      {
        _id: 'download_id_2',
        title: 'Machine Learning: A Probabilistic Perspective',
        author: 'Kevin P. Murphy',
        downloadDate: new Date('2024-01-20T14:20:00Z')
      },
      {
        _id: 'download_id_3',
        title: 'Deep Learning',
        author: 'Ian Goodfellow',
        downloadDate: new Date('2024-01-18T09:15:00Z')
      },
      {
        _id: 'download_id_4',
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz',
        downloadDate: new Date('2024-01-22T16:45:00Z')
      },
      {
        _id: 'download_id_5',
        title: 'Computer Networks: A Top-Down Approach',
        author: 'James F. Kurose',
        downloadDate: new Date('2024-01-25T11:20:00Z')
      },
      {
        _id: 'download_id_6',
        title: 'Mahabharata: The Epic Saga',
        author: 'Vyasa',
        downloadDate: new Date('2024-01-28T14:10:00Z')
      },
      {
        _id: 'download_id_7',
        title: 'The Indus Valley Civilization',
        author: 'Dr. Rajesh Sharma',
        downloadDate: new Date('2024-01-30T08:45:00Z')
      },
      {
        _id: 'download_id_8',
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell',
        downloadDate: new Date('2024-01-12T13:25:00Z')
      },
      {
        _id: 'download_id_9',
        title: 'Operating System Concepts',
        author: 'Abraham Silberschatz',
        downloadDate: new Date('2024-01-14T16:50:00Z')
      },
      {
        _id: 'download_id_10',
        title: 'Data Structures and Algorithms in Java',
        author: 'Robert Lafore',
        downloadDate: new Date('2024-01-17T09:30:00Z')
      }
    ];

    res.json(mockDownloads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookmarks
router.get('/bookmarks', async (req, res) => {
  try {
    // Return mock data for demo purposes to show bookmarks functionality
    const mockBookmarks = [
      {
        _id: 'bookmark_id_1',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        resourceId: 'resource_id_1'
      },
      {
        _id: 'bookmark_id_2',
        title: 'Deep Learning',
        author: 'Ian Goodfellow',
        resourceId: 'resource_id_3'
      },
      {
        _id: 'bookmark_id_3',
        title: 'Machine Learning: A Probabilistic Perspective',
        author: 'Kevin P. Murphy',
        resourceId: 'resource_id_2'
      }
    ];

    res.json(mockBookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove bookmark
router.delete('/bookmarks/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, userId });
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's reading history
router.get('/reading-history', async (req, res) => {
  try {
    // Return mock data for demo purposes to show reading history functionality
    const mockHistory = [
      {
        _id: 'session_id_1',
        title: 'Introduction to Algorithms',
        duration: 45,
        lastAccessed: new Date('2024-01-20T10:30:00Z')
      },
      {
        _id: 'session_id_2',
        title: 'Machine Learning: A Probabilistic Perspective',
        duration: 120,
        lastAccessed: new Date('2024-01-19T14:20:00Z')
      },
      {
        _id: 'session_id_3',
        title: 'Deep Learning',
        duration: 75,
        lastAccessed: new Date('2024-01-18T09:15:00Z')
      },
      {
        _id: 'session_id_4',
        title: 'Database System Concepts',
        duration: 90,
        lastAccessed: new Date('2024-01-17T16:45:00Z')
      },
      {
        _id: 'session_id_5',
        title: 'Computer Networks: A Top-Down Approach',
        duration: 60,
        lastAccessed: new Date('2024-01-16T11:20:00Z')
      }
    ];

    res.json(mockHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
