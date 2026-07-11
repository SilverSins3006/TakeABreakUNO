/**
 * @file Settings route module.
 * @brief Defines settings-related API endpoints for the backend.
 */
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @brief Health-check route for settings APIs.
 * @route GET /api/settings/test
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
router.get('/test', (req, res) => {
  res.json({ message: 'Settings route is working!' });
});

module.exports = router;