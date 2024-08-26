const express = require('express');
const axios = require('axios'); // Only needed if you're making HTTP requests
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb'); // Import MongoDB client
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection string
const uri = 'mongodb://localhost:27017'; // Update this with your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Database and collection names
const dbName = 'movieStreamingDB';
const collectionName = 'movies';

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'app')));

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const moviesCollection = db.collection(collectionName);

    // Use the collection in your routes
    app.get('/movies', async (req, res) => {
      try {
        const movies = await moviesCollection.find().toArray(); // Fetch all movies
        res.json(movies);
      } catch (error) {
        console.error('Error fetching movies:', error.message);
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
      }
    });

    app.get('/movies/:id', async (req, res) => {
      const movieId = req.params.id;
      try {
        const movie = await moviesCollection.findOne({ _id: ObjectId(movieId) }); // Fetch movie by ID
        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ message: 'Movie not found' });
        }
      } catch (error) {
        console.error('Error fetching movie:', error.message);
        res.status(500).json({ message: 'Error fetching movie', error: error.message });
      }
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

connectToDatabase();

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
