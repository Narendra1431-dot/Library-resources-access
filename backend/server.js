const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const analyticsRoutes = require('./routes/analytics');
const submissionRoutes = require('./routes/submissions');
const historyRoutes = require('./routes/history');
const booksRouter = require('./routes/books');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/history', historyRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Library E-Resources API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
