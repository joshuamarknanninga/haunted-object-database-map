// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Location = require('./models/Location');

// Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
    if (!token) return res.status(401).json({ message: 'Access token missing' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid access token' });
      req.user = user;
      next();
    });
  };

  // Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Data directory path
const dataDir = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Verify Token Route
app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({ username: req.user.username });
  });
  
// Helper function to get all location data
const getAllLocations = () => {
  const files = fs.readdirSync(dataDir);
  const locations = files.map((file) => {
    const data = fs.readFileSync(path.join(dataDir, file));
    return JSON.parse(data);
  });
  return locations;
};

// Routes

// Register a new user
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
  
    // Validate input
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });
  
    try {
      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'Username already exists.' });
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user
      const newUser = new User({
        username,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  
  // Login a user
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Validate input
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });
  
    try {
      // Find user
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: 'Invalid credentials.' });
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
  
      // Create JWT
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token, username: user.username });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  
  // Logout a user (handled on client-side)
  app.post('/api/logout', (req, res) => {
    // For JWT, logout is handled on the client side by deleting the token
    res.json({ message: 'Logged out successfully.' });
  });

// GET all locations
app.get('/api/locations', (req, res) => {
  try {
    const locations = getAllLocations();
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations.' });
  }
});

// Add a new location (authenticated)
app.post('/api/locations', authenticateToken, async (req, res) => {
    const { name, description, latitude, longitude, behavior, documented } = req.body;
  
    // Validate input
    if (!name || !description || !latitude || !longitude) {
      return res.status(400).json({ message: 'Name, description, latitude, and longitude are required.' });
    }
  
    try {
      const newLocation = new Location({
        name,
        description,
        latitude,
        longitude,
        behavior,
        documented,
        createdBy: req.user.id,
      });
  
      await newLocation.save();
  
      // Populate the createdBy field
      await newLocation.populate('createdBy', 'username').execPopulate();
  
      res.status(201).json(newLocation);
    } catch (error) {
      console.error('Error adding location:', error);
      res.status(500).json({ message: 'Failed to add location.' });
    }
  });
  
  // Get a single location by ID (public)
  app.get('/api/locations/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const location = await Location.findById(id).populate('createdBy', 'username');
      if (!location) return res.status(404).json({ message: 'Location not found.' });
  
      res.json(location);
    } catch (error) {
      console.error('Error fetching location:', error);
      res.status(500).json({ message: 'Failed to fetch location.' });
    }
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
  });