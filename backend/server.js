// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data directory path
const dataDir = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Helper function to get all location data
const getAllLocations = () => {
  const files = fs.readdirSync(dataDir);
  const locations = files.map((file) => {
    const data = fs.readFileSync(path.join(dataDir, file));
    return JSON.parse(data);
  });
  return locations;
};

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

// POST a new location
app.post('/api/locations', (req, res) => {
  const { name, description, latitude, longitude } = req.body;

  // Validate request body
  if (!name || !description || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const newLocation = {
    id: uuidv4(),
    name,
    description,
    latitude,
    longitude,
    createdAt: new Date().toISOString(),
  };

  const filePath = path.join(dataDir, `${newLocation.id}.json`);

  fs.writeFile(filePath, JSON.stringify(newLocation, null, 2), (err) => {
    if (err) {
      console.error('Error saving location:', err);
      return res.status(500).json({ error: 'Failed to save location.' });
    }
    res.status(201).json(newLocation);
  });
});

// Optional: GET a single location by ID
app.get('/api/locations/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(dataDir, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Location not found.' });
  }

  const data = fs.readFileSync(filePath);
  const location = JSON.parse(data);
  res.json(location);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
