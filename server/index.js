const express = require('express');
const app = express();
const PORT = 3000;

const db = require('./config/db');
const settingsRouter = require('./routes/settings');
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