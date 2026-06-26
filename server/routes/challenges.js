const express = require('express');
const router = express.Router();
const db = require('../config/db');


// GET /api/challenges/test
router.get('/test', (req, res) => {
  res.json({ message: 'Challenges route is working!' });
});

module.exports = router;