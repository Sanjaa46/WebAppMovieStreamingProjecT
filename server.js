const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Database and Collections
const dbName = 'movieStreamingDB';
const moviesCollectionName = 'movies';
const usersCollectionName = 'users';

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.json());  // Parse JSON bodies

// Session Middleware (can be customized as needed)
app.use(session({
  secret: 'your-secret-key',  // Replace with a strong secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to true if using HTTPS
}));

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const moviesCollection = db.collection(moviesCollectionName);
    const usersCollection = db.collection(usersCollectionName);

    // Movies Endpoints
    app.get('/movies', async (req, res) => {
      try {
        const movies = await moviesCollection.find().toArray();
        res.json(movies);
      } catch (error) {
        console.error('Error fetching movies:', error.message);
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
      }
    });

    app.get('/movies/:id', async (req, res) => {
      const movieId = req.params.id;
      try {
        const movie = await moviesCollection.findOne({ _id: ObjectId(movieId) });
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

    // Users Endpoints
    app.get('/users', async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.json(users);
      } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
      }
    });

    app.get('/users/:id', async (req, res) => {
      const userId = req.params.id;
      try {
        const user = await usersCollection.findOne({ _id: ObjectId(userId) });
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
      }
    });

    // Authentication Endpoints
    app.post('/api/user/login', async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await usersCollection.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
          req.session.userId = user._id;  // Set the session
          res.json({ success: true, message: 'Login successful', isLoggedIn: true });
        } else {
          res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
      } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
      }
    });

    app.post('/api/user/signup', async (req, res) => {
      const { email, password } = req.body;
      try {
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password
        const newUser = { email, password: hashedPassword };
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ success: true, message: 'User created', user: result.ops[0] });
      } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
      }
    });

    app.post('/api/user/logout', (req, res) => {
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        res.json({ success: true, message: 'Logout successful' });
      });
    });

    // Check login status
    app.get('/api/user/status', (req, res) => {
      if (req.session.userId) {
        res.json({ isLoggedIn: true });
      } else {
        res.json({ isLoggedIn: false });
      }
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

connectToDatabase();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
