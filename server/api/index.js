const express = require('express');
const cors = require('cors');
const app = express();

// db and routers live one level up in server/, not server/api/
const db = require('../config/db');
const settingsRouter = require('../routes/settings');
const challengeRouter = require('../routes/challenges');

// need cors since this is the one Vercel actually deploys
app.use(cors());
// without this req.body is undefined on POST/PUT routes
app.use(express.json());

// quick check on startup that Neon is actually reachable
db.query('SELECT NOW()')
  .then((result) => {
    console.log('DATABASE CONNECTED SUCCESSFULLY');
    console.log('Current Serverless DB Time:', result.rows[0].now);
  })
  .catch((err) => {
    console.error('DATABASE CONNECTION FAILED!');
    console.error('Error details:', err.message);
  });

// simple check to confirm this is actually the file Vercel is running
app.get('/api', (req, res) => {
  res.json({ message: 'Express backend running successfully on Vercel!' });
});

app.use('/api/challenges', challengeRouter);
app.use('/api/settings', settingsRouter);

// only spin up a listener locally, Vercel calls the exported app directly
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;