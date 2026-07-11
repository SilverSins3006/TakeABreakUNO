/**
 * @file Challenges route module.
 * @brief Provides endpoints for retrieving challenge data and category normalization.
 */
const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @brief Maps category aliases to normalized challenge categories.
 * @type {Object<string,string>}
 */
const categoryMap = {
  exercise: 'Exercise',
  stretch: 'Stretch',
  chores: 'Chores',
  brain: 'Brain Teaser',
  'brain-teaser': 'Brain Teaser',
  hunt: 'Scavenger Hunt',
  'scavenger-hunt': 'Scavenger Hunt',
  outside: 'Get Outside',
  'get-outside': 'Get Outside',
};

/**
 * @brief Get a single random challenge.
 * @route GET /api/challenges/random
 * @param {Object} req Express request object.
 * @param {string} [req.query.difficulty] Optional difficulty filter.
 * @param {string} [req.query.category] Optional category filter.
 * @param {Object} res Express response object.
 */
router.get('/random', async (req, res) => {
  try {
    // Force the browser and Vercel edge network to skip caching this request
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { difficulty, category } = req.query;

    let query = 'SELECT * FROM challenges';
    const conditions = [];
    const values = [];

    if (difficulty) {
      values.push(difficulty);
      conditions.push(`LOWER(difficulty) = LOWER($${values.length})`);
    }

    if (category) {
      const mappedCategory = categoryMap[category.toLowerCase()] || category;
      values.push(mappedCategory);
      conditions.push(`LOWER(category) = LOWER($${values.length})`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY RANDOM() LIMIT 1';

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'No matching challenge found.',
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to get random challenge:', err.message);
    res.status(500).json({ error: 'Failed to get random challenge' });
  }
});

/**
 * @brief Get all challenges, optionally filtered by difficulty or category.
 * @route GET /api/challenges
 * @param {Object} req Express request object.
 * @param {string} [req.query.difficulty] Optional difficulty filter.
 * @param {string} [req.query.category] Optional category filter.
 * @param {Object} res Express response object.
 */
router.get('/', async (req, res) => {
  try {
    const { difficulty, category } = req.query;

    let query = 'SELECT * FROM challenges';
    const conditions = [];
    const values = [];

    if (difficulty) {
      values.push(difficulty);
      conditions.push(`LOWER(difficulty) = LOWER($${values.length})`);
    }

    if (category) {
      const mappedCategory = categoryMap[category.toLowerCase()] || category;
      values.push(mappedCategory);
      conditions.push(`LOWER(category) = LOWER($${values.length})`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY id';

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to get challenges:', err.message);
    res.status(500).json({ error: 'Failed to get challenges' });
  }
});

module.exports = router;