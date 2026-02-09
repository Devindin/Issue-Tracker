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

// Routes
app.use('/auth', require('./routes/AuthRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('Issue Tracker Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});