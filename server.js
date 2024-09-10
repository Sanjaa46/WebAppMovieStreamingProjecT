const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const router = express.Router();
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Database and Collections
const dbName = 'movieStreamingDB';
let moviesCollection, usersCollection;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.json());  // Parse JSON bodies

// Session Middleware
app.use(session({
  secret: 'temporary-secret',
  resave: false,
  saveUninitialized: false,
}));

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    moviesCollection = db.collection('movies');
    usersCollection = db.collection('users');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

connectToDatabase();

// Route to fetch all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await moviesCollection.find().toArray();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching movies' });
  }
});

// Route to check login status
router.get('/user/status', (req, res) => {
  const isLoggedIn = req.session && req.session.userId;
  res.json({ isLoggedIn: !!isLoggedIn });
});

// Route for user signup
router.post('/user/signup', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ success: false, message: 'Email, username, and password are required' });
  }

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      user_id: new ObjectId().toString(),
      username,
      email,
      password_hash: hashedPassword,
      date_joined: new Date().toISOString(),
      last_login: null,
      subscription_plan: 'free',
      favorites: [],
      watchlist: [],
      recently_watched: [],
      roles: ['user']
    };

    await usersCollection.insertOne(newUser);

    res.json({ success: true, message: 'User signed up successfully' });
  } catch (error) {
    console.error('Error signing up:', error.message);
    res.status(500).json({ success: false, message: 'An error occurred during signup' });
  }
});

// Route for user login
router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    req.session.userId = user.user_id;
    await usersCollection.updateOne({ email }, { $set: { last_login: new Date().toISOString() } });

    res.json({ success: true, message: 'Login successful', user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ success: false, message: 'An error occurred during login' });
  }
});

// Route for user logout
router.post('/user/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logout successful' });
});

// Mount the user-related routes to `/api`
app.use('/api', router);

// Serve the 404 page for unmatched routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'app', '404.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
