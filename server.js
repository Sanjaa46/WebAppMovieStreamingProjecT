const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const API_URL = process.env.API_URL || 'https://api.jsonbin.io/v3/b/6645bc42e41b4d34e4f48a87';

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'app'))); // Ensure the correct path is used

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html')); // Adjust the path if necessary
});

// Route to fetch movies data
app.get('/movies', async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    const movies = response.data.record;
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});