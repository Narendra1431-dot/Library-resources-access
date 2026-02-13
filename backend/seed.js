const mongoose = require('mongoose');
const User = require('./models/User');
const Resource = require('./models/Resource');
const Download = require('./models/Download');
const Bookmark = require('./models/Bookmark');
const ReadingSession = require('./models/ReadingSession');
const Recommendation = require('./models/Recommendation');
const Submission = require('./models/Submission');
const AnalyticsLog = require('./models/AnalyticsLog');
const Book = require('./models/Book');
const mockData = require('../mock-data.json');

require('dotenv').config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library');

    // Clear existing data
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Download.deleteMany({});
    await Bookmark.deleteMany({});
    await ReadingSession.deleteMany({});
    await Recommendation.deleteMany({});
    await Submission.deleteMany({});
    await AnalyticsLog.deleteMany({});
    await Book.deleteMany({});

    // Seed users
    const users = [];
    for (const userData of mockData.users) {
      const user = new User({
        ...userData,
        password: require('bcryptjs').hashSync(userData.password, 10)
      });
      await user.save();
      users.push(user);
    }

    // Seed resources
    const resources = [];
    for (const resourceData of mockData.resources) {
      const resource = new Resource(resourceData);
      await resource.save();
      resources.push(resource);
    }

    // Create maps for IDs
    const userMap = {};
    users.forEach((user, index) => {
      userMap[`user_id_${index + 1}`] = user._id;
    });

    const resourceMap = {};
    resources.forEach((resource, index) => {
      resourceMap[`resource_id_${index + 1}`] = resource._id;
    });

    // Seed downloads
    for (const downloadData of mockData.downloads) {
      const download = new Download({
        ...downloadData,
        userId: userMap[downloadData.userId],
        resourceId: resourceMap[downloadData.resourceId]
      });
      await download.save();
    }

    // Seed bookmarks
    for (const bookmarkData of mockData.bookmarks) {
      const bookmark = new Bookmark({
        ...bookmarkData,
        userId: userMap[bookmarkData.userId],
        resourceId: resourceMap[bookmarkData.resourceId]
      });
      await bookmark.save();
    }

    // Seed reading sessions
    for (const sessionData of mockData.readingSessions) {
      const session = new ReadingSession({
        ...sessionData,
        userId: userMap[sessionData.userId],
        resourceId: resourceMap[sessionData.resourceId],
        lastAccessed: sessionData.sessionDate
      });
      await session.save();
    }

    // Seed recommendations
    for (const recData of mockData.recommendations) {
      const recommendation = new Recommendation({
        ...recData,
        userId: userMap[recData.userId],
        resourceId: resourceMap[recData.resourceId]
      });
      await recommendation.save();
    }

    // Seed submissions
    for (const subData of mockData.submissions) {
      const submission = new Submission({
        ...subData,
        userId: userMap[subData.userId]
      });
      await submission.save();
    }

    // Seed analytics logs
    for (const logData of mockData.analyticsLogs) {
      const log = new AnalyticsLog({
        ...logData,
        userId: userMap[logData.userId],
        resourceId: resourceMap[logData.resourceId]
      });
      await log.save();
    }

    // Seed books
    for (let i = 0; i < mockData.books.length; i++) {
      const bookData = mockData.books[i];
      const book = new Book({
        ...bookData,
        bookId: `book_${i + 1}`
      });
      await book.save();
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
