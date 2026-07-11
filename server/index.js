/**
 * @file Server entry point for the Take A Break backend.
 * @brief Starts the Express app, verifies the database connection, and registers API routes.
 */
const express = require('express');

/** Express application instance for the backend server. */
const app = express();

/** Default port used by the server. */
const PORT = 3000;

/** Database helper module for executing SQL queries. */
const db = require('./config/db');

/** Router for settings-related API endpoints. */
const settingsRouter = require('./routes/settings');

/** Router for challenge-related API endpoints. */
const challengeRouter = require('./routes/challenges');

// DATABASE CONNECTION TEST
db.query('SELECT NOW()')
  .then((result) => {
    console.log('DATABASE CONNECTED SUCCESSFULLY');
    console.log('Current Serverless DB Time:', result.rows[0].now);
  })
  .catch((err) => {
    console.error('DATABASE CONNECTION FAILED!');
    console.error('Error details:', err.message);
  });

// Base route to verify server status in browser
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/challenges', challengeRouter);
app.use('/api/settings', settingsRouter);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});