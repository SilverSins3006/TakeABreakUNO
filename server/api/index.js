/**
 * @file This is the file Vercel actually deploys as the serverless function.
 * Sets up Express, checks the db connection on boot, and wires up the routers.
 * Also runs locally with its own listener when NODE_ENV isn't production.
 */

const express = require('express');
const cors = require('cors');
const app = express();

// db and routers live one level up in server/, not server/api/
const db = require('../config/db');
const settingsRouter = require('../routes/settings');
const challengeRouter = require('../routes/challenges');
const usersRouter = require('../routes/users');

// need cors since this is the one Vercel actually deploys
app.use(cors());
// without this req.body is undefined on POST/PUT routes
app.use(express.json());

/**
 * Just a sanity check that Neon is actually up when the server boots.
 * Logs the db time if it connects, logs the error if it doesn't.
 * Doesn't stop the app either way, just for debugging deploys.
 */
db.query('SELECT NOW()')
  .then((result) => {
    console.log('DATABASE CONNECTED SUCCESSFULLY');
    console.log('Current Serverless DB Time:', result.rows[0].now);
  })
  .catch((err) => {
    console.error('DATABASE CONNECTION FAILED!');
    console.error('Error details:', err.message);
  });

/**
 * Quick check to confirm this is the file Vercel is actually running.
 * @route GET /api
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @returns {void}
 */
app.get('/api', (req, res) => {
  res.json({ message: 'Express backend running successfully on Vercel!' });
});

app.use('/api/challenges', challengeRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/users', usersRouter);

// only spin up a listener locally, Vercel calls the exported app directly
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;