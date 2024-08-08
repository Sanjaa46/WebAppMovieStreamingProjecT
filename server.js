const express = require('express');
const fetchData = require('C:/Users/sanja/OneDrive/ドキュメント/GitHub/WebAppMovieStreamingProject/app/assets/scripts/webapi/api.js');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from the "app" directory
app.use(express.static(path.join(__dirname, 'app')));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// Endpoint to fetch movie data
app.get('/movies', async (req, res) => {
    const data = await fetchData();
    if (data) {
        res.json(data);
    } else {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
    res.status(404).send('Sorry, cannot find that!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
