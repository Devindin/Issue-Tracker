const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Load models
require('./models/Company');
require('./models/User');
require('./models/Issue');

// Routes
app.use('/auth', require('./routes/AuthRoutes'));
app.use('/issues', require('./routes/IssueRoutes'));
app.use('/users', require('./routes/UserRoutes'));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ message: error?.message || "Server error" });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Issue Tracker Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});