const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/settings/test
router.get('/test', (req, res) => {
  res.json({ message: 'Settings route is working!' });
});

module.exports = router;